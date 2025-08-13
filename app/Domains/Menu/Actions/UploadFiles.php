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
        'm4v'
    ];

    private const SUPPORTED_IMAGE_FORMATS = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'tiff',
        'svg',
        'ico',
        'heic',
        'heif'
    ];

    private const SUPPORTED_DOCUMENT_FORMATS = [
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'txt',
        'rtf',
        'csv'
    ];

    private const GOOGLE_DRIVE_MIMES = [
        // Video formats
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-ms-wmv',
        'video/x-flv',
        'video/webm',
        'video/x-matroska',
        'video/3gpp',
        'video/x-m4v',

        // Image formats
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/tiff',
        'image/svg+xml',
        'image/x-icon',
        'image/heic',
        'image/heif',

        // Document formats
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/rtf',
        'text/csv'
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
        $batchId = time() . '_' . uniqid();
        $files = $request->videos; // Keep original name for compatibility

        // Group files by unique Filepond path to avoid duplicates
        $filesByPath = [];
        foreach ($files as $file) {
            // Handle both array and string formats
            if (is_string($file)) {
                $path = trim($file);
                $filesByPath[$path][] = ['path' => $path, 'name' => basename($file)];
            } else if (is_array($file) && isset($file['path'])) {
                $path = trim($file['path']);
                $filesByPath[$path][] = $file;
            } else {
                Log::warning('Invalid file format in request', ['file' => $file]);
                $errors[] = "Invalid file format detected";
            }
        }

        Log::info('Processing filepond paths', [
            'paths' => array_keys($filesByPath),
            'total_files' => count($files),
        ]);

        $uploadedFilesByPath = [];

        foreach ($filesByPath as $path => $filesWithSamePath) {
            try {
                $canonicalName = $filesWithSamePath[0]['name'] ?? basename($path);
                $uniqueId = uniqid();
                $targetDirectory = "uploads_{$batchId}/{$uniqueId}";

                Log::info('Moving Filepond temp file', [
                    'path' => $path,
                    'target_directory' => $targetDirectory,
                    'filename' => $canonicalName
                ]);

                $filepondField = Filepond::field($path);
                if (! $filepondField) {
                    $errors[] = "Filepond temporary file not found or expired: {$canonicalName} (Path: {$path})";
                    Log::error('Filepond field not found', ['path' => $path, 'name' => $canonicalName]);
                    continue;
                }

                $fileInfo = $filepondField->moveTo($targetDirectory);

                if (empty($fileInfo['location'])) {
                    $errors[] = "Failed to process file: {$canonicalName} (FilePond processing failed)";
                    Log::error('Filepond moveTo failed', ['path' => $path, 'file_info' => $fileInfo]);
                    continue;
                }

                Log::info('Filepond file moved successfully', ['location' => $fileInfo['location']]);

                $storagePath = storage_path('app/public/');
                $originalExtension = strtolower(pathinfo($canonicalName, PATHINFO_EXTENSION));

                // Find the actual file full path
                $possiblePaths = [
                    $storagePath . $fileInfo['location'],
                    $storagePath . $fileInfo['location'] . '.' . $originalExtension,
                    $storagePath . dirname($fileInfo['location']) . '/' . basename($fileInfo['location']) . '.' . $originalExtension,
                ];

                $directoryPath = $storagePath . dirname($fileInfo['location']);
                if (is_dir($directoryPath)) {
                    $files = glob($directoryPath . '/*');
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
                    $errors[] = "File not found after upload: {$canonicalName}";
                    continue;
                }

                $fileSize = filesize($fullPath);
                if ($fileSize === 0) {
                    $errors[] = "File is empty: {$canonicalName}";
                    continue;
                }

                $mimeType = $this->getMimeType($fullPath, $originalExtension);
                $fileType = $this->determineFileType($originalExtension, $mimeType);

                if (! $this->isValidFileFormat($originalExtension, $mimeType)) {
                    $errors[] = "Unsupported file format: {$canonicalName} (Extension: {$originalExtension})";
                    continue;
                }

                $cleanFileName = $this->cleanFileName($canonicalName);

                Log::info('Uploading to Google Drive', [
                    'original_name' => $canonicalName,
                    'clean_name' => $cleanFileName,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'extension' => $originalExtension,
                    'file_type' => $fileType,
                ]);

                // Upload file to Google Drive
                $uploadedFile = $this->drive->upload($fullPath, $cleanFileName, $mimeType, 'Client_' . $request->client);

                if (! $uploadedFile || ! isset($uploadedFile['id'])) {
                    $errors[] = "Failed to upload to Google Drive: {$canonicalName}";
                    continue;
                }

                $this->drive->makePublic($uploadedFile['id']);

                // Wait for Google Drive processing (longer for videos)
                $waitTime = $fileType === 'video' ? 10 : 3;
                sleep($waitTime);

                $driveUrl = $this->drive->getViewUrl($uploadedFile['id']);

                Menu::create([
                    'client_id' => $request->client,
                    'created_by' => Auth::id(),
                    'name' => $canonicalName,
                    'type' => $fileType,
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
                    'file_type' => $fileType,
                    'local_url' => Storage::url($fileInfo['location']),
                    'google_drive_id' => $uploadedFile['id'],
                    'google_drive_name' => $uploadedFile['name'],
                    'google_drive_url' => $driveUrl,
                ];

                Log::info('File processed and uploaded successfully', [
                    'original_name' => $canonicalName,
                    'file_type' => $fileType,
                    'drive_file_id' => $uploadedFile['id'],
                    'google_drive_url' => $driveUrl,
                ]);
            } catch (\Exception $e) {
                $fileName = $filesWithSamePath[0]['name'] ?? 'unknown_file';
                $errors[] = "Error processing file {$fileName}: " . $e->getMessage();
                Log::error('Exception while processing file', [
                    'file_name' => $fileName,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        // Map uploads back to all files (handle duplicates)
        $processedFiles = [];
        foreach ($files as $file) {
            // Handle both array and string formats
            if (is_string($file)) {
                // If $file is a string, it might be just the path
                $path = trim($file);
                $fileName = basename($file);
            } else if (is_array($file)) {
                // Normal array format
                $path = trim($file['path'] ?? '');
                $fileName = $file['name'] ?? basename($path);
            } else {
                Log::warning('Unexpected file format', ['file' => $file]);
                continue;
            }

            if (! isset($uploadedFilesByPath[$path])) {
                continue;
            }
            $uploadData = $uploadedFilesByPath[$path];
            $uploadData['original_name'] = $fileName;
            $processedFiles[] = $uploadData;
        }

        Log::info('File upload summary', [
            'total_requested' => count($request->videos),
            'successfully_processed' => count($processedFiles),
            'errors_count' => count($errors),
            'errors' => $errors,
        ]);

        if (empty($processedFiles) && ! empty($errors)) {
            return back()->withErrors(['filepond' => 'No files processed. Errors: ' . implode(', ', $errors)]);
        }

        $total = count($request->videos);
        $success = count($processedFiles);
        $message = $success === $total
            ? "{$success} file(s) uploaded successfully."
            : "{$success} of {$total} file(s) uploaded. Errors: " . implode(', ', $errors);

        return back()->with('success', $message);
    }

    private function getMimeType(string $filePath, string $extension): string
    {
        $mimeType = mime_content_type($filePath);

        if (! $mimeType || $mimeType === 'application/octet-stream') {
            $mimeType = $this->getMimeTypeFromExtension($extension);
        }

        // Ensure correct mime type for supported formats
        $supportedFormats = array_merge(
            self::SUPPORTED_VIDEO_FORMATS,
            self::SUPPORTED_IMAGE_FORMATS,
            self::SUPPORTED_DOCUMENT_FORMATS
        );

        if (in_array($extension, $supportedFormats)) {
            $expectedMime = $this->getMimeTypeFromExtension($extension);
            if ($expectedMime !== 'application/octet-stream') {
                $mimeType = $expectedMime;
            }
        }

        return $mimeType;
    }

    private function getMimeTypeFromExtension(string $extension): string
    {
        $mimeTypes = [
            // Video formats
            'mp4' => 'video/mp4',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'wmv' => 'video/x-ms-wmv',
            'flv' => 'video/x-flv',
            'webm' => 'video/webm',
            'mkv' => 'video/x-matroska',
            '3gp' => 'video/3gpp',
            'm4v' => 'video/x-m4v',

            // Image formats
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'webp' => 'image/webp',
            'tiff' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'heic' => 'image/heic',
            'heif' => 'image/heif',

            // Document formats
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain',
            'rtf' => 'application/rtf',
            'csv' => 'text/csv',
        ];

        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    private function determineFileType(string $extension, string $mimeType): string
    {
        if (in_array($extension, self::SUPPORTED_VIDEO_FORMATS) || str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        if (in_array($extension, self::SUPPORTED_IMAGE_FORMATS) || str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (in_array($extension, self::SUPPORTED_DOCUMENT_FORMATS)) {
            return 'document';
        }

        return 'file';
    }

    private function isValidFileFormat(string $extension, string $mimeType): bool
    {
        $allSupportedFormats = array_merge(
            self::SUPPORTED_VIDEO_FORMATS,
            self::SUPPORTED_IMAGE_FORMATS,
            self::SUPPORTED_DOCUMENT_FORMATS
        );

        return in_array($extension, $allSupportedFormats) &&
            in_array($mimeType, self::GOOGLE_DRIVE_MIMES);
    }

    private function cleanFileName(string $filename): string
    {
        $cleaned = preg_replace('/[<>:"\\/\\\\|?*]/', '_', $filename);
        $cleaned = preg_replace('/[\s_]+/', '_', $cleaned);
        $cleaned = trim($cleaned, ' _');

        if (empty($cleaned)) {
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $cleaned = 'file_' . time() . ($extension ? '.' . $extension : '');
        }

        return $cleaned;
    }
}
