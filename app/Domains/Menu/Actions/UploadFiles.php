<?php

declare(strict_types=1);

namespace App\Domains\Menu\Actions;

use App\Models\Menu;
use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;
use RahulHaque\Filepond\Facades\Filepond;

class UploadFiles
{
    use AsAction, AsController;

    private const SUPPORTED_VIDEO_FORMATS = [
        'mp4',
        'mov',
        'avi',
        'wmv',
        'flv',
        'webm',
        'mkv',
        '3gp',
        'm4v',
    ];

    private const GOOGLE_DRIVE_VIDEO_MIMES = [
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-ms-wmv',
        'video/x-flv',
        'video/webm',
        'video/x-matroska',
        'video/3gpp',
        'video/x-m4v',
    ];

    public function __construct(
        private readonly GoogleDriveService $drive
    ) {}

    public function handle(Request $request)
    {
        $request->validate([
            'client' => 'required|exists:users,id',
            'videos' => 'required|array|min:1',
            'videos.*.path' => 'required|string',
            'videos.*.name' => 'required|string',
        ]);

        $errors = [];
        $batchId = time().'_'.uniqid();
        $videos = $request->videos;

        // Group videos by unique Filepond path to avoid duplicates
        $videosByPath = [];
        foreach ($videos as $video) {
            $path = trim($video['path']);
            $videosByPath[$path][] = $video;
        }

        Log::info('Processing filepond paths', [
            'paths' => array_keys($videosByPath),
            'total_videos' => count($videos),
        ]);

        $uploadedFilesByPath = [];

        foreach ($videosByPath as $path => $videosWithSamePath) {
            try {
                $canonicalName = $videosWithSamePath[0]['name'];
                $uniqueId = uniqid();
                $targetDirectory = "videos_{$batchId}/{$uniqueId}";

                Log::info('Moving Filepond temp file', ['path' => $path, 'target_directory' => $targetDirectory]);

                $filepondField = Filepond::field($path);
                if (! $filepondField) {
                    $errors[] = "Filepond temporary file not found or expired: {$canonicalName} (Path: {$path})";
                    Log::error('Filepond field not found', ['path' => $path, 'name' => $canonicalName]);

                    continue;
                }

                $fileInfo = $filepondField->moveTo($targetDirectory);

                if (empty($fileInfo['location'])) {
                    $errors[] = "Failed to process video: {$canonicalName} (FilePond processing failed)";
                    Log::error('Filepond moveTo failed', ['path' => $path, 'file_info' => $fileInfo]);

                    continue;
                }

                Log::info('Filepond file moved successfully', ['location' => $fileInfo['location']]);

                $storagePath = storage_path('app/public/');
                $originalExtension = strtolower(pathinfo($canonicalName, PATHINFO_EXTENSION));

                // Find the actual file full path
                $possiblePaths = [
                    $storagePath.$fileInfo['location'],
                    $storagePath.$fileInfo['location'].'.'.$originalExtension,
                    $storagePath.dirname($fileInfo['location']).'/'.basename($fileInfo['location']).'.'.$originalExtension,
                ];

                $directoryPath = $storagePath.dirname($fileInfo['location']);
                if (is_dir($directoryPath)) {
                    $files = glob($directoryPath.'/*');
                    $possiblePaths = array_merge($possiblePaths, $files);
                }

                $fullPath = null;
                foreach ($possiblePaths as $p) {
                    if (file_exists($p) && is_file($p) && filesize($p) > 0) {
                        $fullPath = $p;
                        $fileInfo['location'] = str_replace($storagePath, '', $fullPath);
                        break;
                    }
                }

                if (! $fullPath) {
                    $errors[] = "Video file not found after upload: {$canonicalName}";

                    continue;
                }

                $fileSize = filesize($fullPath);
                if ($fileSize === 0) {
                    $errors[] = "Video file is empty: {$canonicalName}";

                    continue;
                }

                $mimeType = $this->getMimeType($fullPath, $originalExtension);

                if (! $this->isValidVideoFormat($originalExtension, $mimeType)) {
                    $errors[] = "Unsupported video format: {$canonicalName} (Extension: {$originalExtension})";

                    continue;
                }

                $cleanFileName = $this->cleanFileName($canonicalName);

                Log::info('Uploading to Google Drive', [
                    'original_name' => $canonicalName,
                    'clean_name' => $cleanFileName,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'extension' => $originalExtension,
                ]);

                // Upload file (make sure your GoogleDriveService uses resumable upload for large files)
                $uploadedFile = $this->drive->upload($fullPath, $cleanFileName, $mimeType, 'Client_'.$request->client);

                if (! $uploadedFile || ! isset($uploadedFile['id'])) {
                    $errors[] = "Failed to upload to Google Drive: {$canonicalName}";

                    continue;
                }

                $this->drive->makePublic($uploadedFile['id']);

                // *** IMPORTANT ***
                // Wait longer to let Google Drive finish video processing for playback
                // 10 seconds or more may be needed for large files
                sleep(10);

                $driveUrl = $this->drive->getViewUrl($uploadedFile['id']);

                $type = str_starts_with($mimeType, 'video/') ? 'video' : (str_starts_with($mimeType, 'image/') ? 'image' : 'file');

                Menu::create([
                    'client_id' => $request->client,
                    'created_by' => Auth::id(),
                    'name' => $canonicalName,
                    'type' => $type,
                    'local_path' => $fileInfo['location'],
                    'google_drive_id' => $uploadedFile['id'],
                    'google_drive_url' => $driveUrl,
                    'mime_type' => $mimeType,
                    'size' => $fileSize,
                    'description' => null,
                    'uploaded_at' => now(),
                ]);

                $uploadedFilesByPath[$path] = [
                    'original_name' => $canonicalName,
                    'stored_path' => $fileInfo['location'],
                    'full_path' => $fullPath,
                    'size' => $fileSize,
                    'mime_type' => $mimeType,
                    'local_url' => Storage::url($fileInfo['location']),
                    'google_drive_id' => $uploadedFile['id'],
                    'google_drive_name' => $uploadedFile['name'],
                    'google_drive_url' => $driveUrl,
                ];

                Log::info('Video processed and uploaded successfully', [
                    'original_name' => $canonicalName,
                    'drive_file_id' => $uploadedFile['id'],
                    'google_drive_url' => $driveUrl,
                ]);
            } catch (\Exception $e) {
                $errors[] = "Error processing video {$videosWithSamePath[0]['name']}: ".$e->getMessage();
                Log::error('Exception while processing video', [
                    'video_name' => $videosWithSamePath[0]['name'],
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        // Map uploads back to all videos (handle duplicates)
        $processedVideos = [];
        foreach ($videos as $video) {
            $path = trim($video['path']);
            if (! isset($uploadedFilesByPath[$path])) {
                continue;
            }
            $uploadData = $uploadedFilesByPath[$path];
            $uploadData['original_name'] = $video['name'];
            $processedVideos[] = $uploadData;
        }

        Log::info('Video upload summary', [
            'total_requested' => count($request->videos),
            'successfully_processed' => count($processedVideos),
            'errors_count' => count($errors),
            'errors' => $errors,
        ]);

        if (empty($processedVideos) && ! empty($errors)) {
            return back()->withErrors(['filepond' => 'No videos processed. Errors: '.implode(', ', $errors)]);
        }

        $total = count($request->videos);
        $success = count($processedVideos);
        $message = $success === $total
            ? "{$success} file(s) uploaded successfully."
            : "{$success} of {$total} file(s) uploaded. Errors: ".implode(', ', $errors);

        return back()->with('success', $message);
    }

    private function getMimeType(string $filePath, string $extension): string
    {
        $mimeType = mime_content_type($filePath);

        if (! $mimeType || $mimeType === 'application/octet-stream') {
            $mimeType = $this->getMimeTypeFromExtension($extension);
        }

        if (in_array($extension, self::SUPPORTED_VIDEO_FORMATS) && ! str_starts_with($mimeType, 'video/')) {
            $mimeType = $this->getMimeTypeFromExtension($extension);
        }

        return $mimeType;
    }

    private function getMimeTypeFromExtension(string $extension): string
    {
        $mimeTypes = [
            'mp4' => 'video/mp4',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'wmv' => 'video/x-ms-wmv',
            'flv' => 'video/x-flv',
            'webm' => 'video/webm',
            'mkv' => 'video/x-matroska',
            '3gp' => 'video/3gpp',
            'm4v' => 'video/x-m4v',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
        ];

        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    private function isValidVideoFormat(string $extension, string $mimeType): bool
    {
        return in_array($extension, self::SUPPORTED_VIDEO_FORMATS) &&
            in_array($mimeType, self::GOOGLE_DRIVE_VIDEO_MIMES);
    }

    private function cleanFileName(string $filename): string
    {
        $cleaned = preg_replace('/[<>:"\\/\\\\|?*]/', '_', $filename);
        $cleaned = preg_replace('/[\s_]+/', '_', $cleaned);
        $cleaned = trim($cleaned, ' _');

        if (empty($cleaned)) {
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $cleaned = 'video_'.time().($extension ? '.'.$extension : '');
        }

        return $cleaned;
    }
}
