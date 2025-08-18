<?php

declare(strict_types=1);

namespace App\Domains\Menu\Actions;

use App\Domains\Menu\Data\UpdateMenuData;
use App\Models\Menu;
use App\Services\GoogleDriveService;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use RahulHaque\Filepond\Facades\Filepond;
use Throwable;

final class UpdateMenu
{
    use AsAction;

    public function __construct(
        private readonly GoogleDriveService $drive
    ) {}

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:1', 'max:255'],
            'image' => ['nullable', 'array'],
            'image.name' => ['required_with:image', 'string'],
            'image.path' => ['required_with:image', 'string'],
        ];
    }

    /**
     * Update menu with provided data.
     */
    public function handle(UpdateMenuData $data, Menu $menu): void
    {
        $updateData = ['name' => $data->title];

        if ($data->image !== null) {
            $updateData['thumbnail'] = $this->uploadImage($data->image, $menu);
        }

        try {
            $menu->fill($updateData)->save();
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'error' => [__('Unable to update menu: :message', ['message' => $e->getMessage()])]
            ]);
        }
    }

    /**
     * Upload image to Google Drive and return file ID.
     */
    private function uploadImage(array $imageData, Menu $menu): string
    {
        try {
            $path = trim($imageData['path']);
            $name = $imageData['name'];

            // Get temporary file
            $tempFile = Filepond::field($path);
            if (!$tempFile) {
                throw new \Exception("Temporary file not found: {$name}");
            }

            // Move to storage
            $fileInfo = $tempFile->moveTo("menu_uploads/" . uniqid());
            if (empty($fileInfo['location'])) {
                throw new \Exception("Failed to process file: {$name}");
            }

            // Find actual file path
            $filePath = $this->findFile($fileInfo['location'], $name);
            if (!$filePath) {
                throw new \Exception("File not found after upload: {$name}");
            }

            // Upload to Google Drive
            $result = $this->drive->upload(
                $filePath,
                $this->cleanFileName($name),
                mime_content_type($filePath) ?: 'application/octet-stream',
                "Menu_{$menu->id}"
            );

            if (!$result || !isset($result['id'])) {
                throw new \Exception("Google Drive upload failed: {$name}");
            }

            $this->drive->makePublic($result['id']);

            // Cleanup local file
            $this->cleanup($filePath);

            return $result['id']; // Return only the file ID

        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'image' => [__('Failed to upload image: :message', ['message' => $e->getMessage()])]
            ]);
        }
    }

    /**
     * Find the uploaded file in storage.
     */
    private function findFile(string $location, string $originalName): ?string
    {
        $storagePath = storage_path('app/public/');
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        $paths = [
            $storagePath . $location,
            $storagePath . $location . '.' . $extension,
            $storagePath . dirname($location) . '/' . basename($location) . '.' . $extension,
        ];

        // Check directory files
        $dir = $storagePath . dirname($location);
        if (is_dir($dir)) {
            $paths = array_merge($paths, glob($dir . '/*') ?: []);
        }

        foreach ($paths as $path) {
            if (file_exists($path) && is_file($path) && filesize($path) > 0) {
                return $path;
            }
        }

        return null;
    }

    /**
     * Clean filename for Google Drive compatibility.
     */
    private function cleanFileName(string $filename): string
    {
        $cleaned = preg_replace('/[<>:"\\/\\\\|?*]/', '_', $filename);
        $cleaned = preg_replace('/[\s_]+/', '_', trim($cleaned, ' _'));

        return $cleaned ?: 'menu_image_' . time() . '.' . pathinfo($filename, PATHINFO_EXTENSION);
    }

    /**
     * Cleanup local file and directory.
     */
    private function cleanup(string $filePath): void
    {
        if (file_exists($filePath)) {
            unlink($filePath);
            $dir = dirname($filePath);
            if (is_dir($dir) && count(scandir($dir)) === 2) {
                rmdir($dir);
            }
        }
    }
}
