<?php

declare(strict_types=1);

namespace App\Services;

use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;
use Google\Service\Exception as GoogleServiceException;
use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Google Drive Service with Super Fast Video Streaming
 *
 * Implements YouTube-style chunk-by-chunk streaming for large video files
 * with intelligent buffering and range request optimization.
 */
class GoogleDriveService
{
    private GoogleClient $client;

    private GoogleDrive $drive;

    private HttpClient $httpClient;

    private ?string $defaultFolderId;

    // Streaming optimization constants
    private const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for optimal streaming

    private const ACCESS_TOKEN_CACHE_KEY = 'google_drive_access_token';

    private const TOKEN_CACHE_DURATION = 3300; // 55 minutes (tokens expire in 1 hour)

    /**
     * Initialize Google Drive service with optimized HTTP client
     */
    public function __construct()
    {
        $this->initializeCredentials();
        $this->setupGoogleClient();
        $this->drive = new GoogleDrive($this->client);

        // Initialize optimized HTTP client for streaming
        $this->httpClient = new HttpClient([
            'timeout' => 30,
            'connect_timeout' => 5,
            'read_timeout' => 30,
            'verify' => true,
            'http_errors' => false, // Handle errors manually
            'stream' => true, // Enable streaming
        ]);
    }

    /**
     * PUBLIC METHOD: Get access token for external streaming
     * This allows ManageDynamicPage to authenticate with Google Drive API
     */
    public function getAccessToken(): string
    {
        return $this->getCachedAccessToken();
    }

    /**
     * CRITICAL METHOD: Get byte range from Google Drive file - YouTube-style streaming
     * This method enables super fast chunk-by-chunk loading
     *
     * @param  string  $fileId  Google Drive file ID
     * @param  int  $start  Starting byte position
     * @param  int  $length  Number of bytes to fetch
     * @return string Binary chunk data
     *
     * @throws RuntimeException When range request fails
     */
    public function getRange(string $fileId, int $start, int $length): string
    {
        $accessToken = $this->getCachedAccessToken();
        $end = $start + $length - 1;

        $url = "https://www.googleapis.com/drive/v3/files/{$fileId}?alt=media";

        Log::debug("Fetching range for {$fileId}: bytes {$start}-{$end}");

        try {
            $response = $this->httpClient->get($url, [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Range' => "bytes={$start}-{$end}",
                    'Accept-Encoding' => 'identity', // Disable compression for streaming
                ],
                'stream' => true,
            ]);

            $statusCode = $response->getStatusCode();

            if ($statusCode === 206 || $statusCode === 200) {
                $body = $response->getBody();
                $content = '';

                // Read the stream in small chunks to avoid memory issues
                while (! $body->eof()) {
                    $chunk = $body->read(8192); // 8KB read buffer
                    if ($chunk === '') {
                        break;
                    }
                    $content .= $chunk;
                }

                Log::debug('Successfully fetched '.strlen($content).' bytes');

                return $content;
            }

            if ($statusCode === 401) {
                // Token expired, refresh and retry
                Log::info('Access token expired, refreshing...');
                $this->refreshAccessToken();

                return $this->getRange($fileId, $start, $length); // Recursive retry
            }

            $errorBody = $response->getBody()->getContents();
            Log::error('Range request failed', [
                'file_id' => $fileId,
                'status_code' => $statusCode,
                'range' => "bytes={$start}-{$end}",
                'error' => $errorBody,
            ]);

            throw new RuntimeException("Range request failed with status {$statusCode}: {$errorBody}");
        } catch (RequestException $e) {
            Log::error('HTTP request failed for range fetch', [
                'file_id' => $fileId,
                'range' => "bytes={$start}-{$end}",
                'error' => $e->getMessage(),
            ]);

            throw new RuntimeException('Failed to fetch file range: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Get optimized access token with caching
     * Reduces API calls and improves streaming performance
     */
    private function getCachedAccessToken(): string
    {
        return Cache::remember(self::ACCESS_TOKEN_CACHE_KEY, self::TOKEN_CACHE_DURATION, function () {
            $token = $this->client->getAccessToken();
            if (is_array($token) && isset($token['access_token'])) {
                return $token['access_token'];
            }

            // Refresh token if needed
            $this->refreshAccessToken();
            $token = $this->client->getAccessToken();

            return is_array($token) ? $token['access_token'] : $token;
        });
    }

    /**
     * Refresh access token and update cache
     */
    private function refreshAccessToken(): void
    {
        try {
            $refreshToken = config('filesystems.disks.google.refreshToken');
            $this->client->fetchAccessTokenWithRefreshToken($refreshToken);

            // Update cache with new token
            $token = $this->client->getAccessToken();
            $accessToken = is_array($token) ? $token['access_token'] : $token;
            Cache::put(self::ACCESS_TOKEN_CACHE_KEY, $accessToken, self::TOKEN_CACHE_DURATION);

            Log::info('Access token refreshed successfully');
        } catch (\Exception $e) {
            Cache::forget(self::ACCESS_TOKEN_CACHE_KEY);
            throw new RuntimeException('Failed to refresh access token: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Get file info with enhanced caching for streaming metadata
     */
    public function getFileInfo(string $fileId): ?DriveFile
    {
        $cacheKey = "drive_file_info_{$fileId}";

        return Cache::remember($cacheKey, 600, function () use ($fileId) { // 10 minutes cache
            try {
                return $this->drive->files->get($fileId, [
                    'fields' => 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink',
                ]);
            } catch (GoogleServiceException $exception) {
                if (in_array($exception->getCode(), [404, 403])) {
                    return null;
                }

                Log::error('Failed to get file info from Google Drive', [
                    'file_id' => $fileId,
                    'error' => $exception->getMessage(),
                    'code' => $exception->getCode(),
                ]);

                throw new RuntimeException(
                    'Failed to retrieve file information: '.$exception->getMessage(),
                    $exception->getCode(),
                    $exception
                );
            }
        });
    }

    /**
     * Enhanced streaming URL with direct access optimization
     */
    public function getDirectStreamingUrl(string $fileId): string
    {
        $accessToken = $this->getCachedAccessToken();

        return "https://www.googleapis.com/drive/v3/files/{$fileId}?alt=media&access_token={$accessToken}";
    }

    // Keep all your existing methods below...

    public function upload(
        string $filePath,
        ?string $fileName = null,
        ?string $mimeType = null,
        ?string $parentFolder = null
    ): array {
        $this->validateFilePath($filePath);

        // ini_set('memory_limit', '1024M');
        ini_set('memory_limit', '3G');

        $targetFolderId = $this->resolveFolder($parentFolder);
        $fileName = $fileName ?? basename($filePath);
        $mimeType = $mimeType ?? $this->detectMimeType($filePath);

        $fileMetadata = new DriveFile([
            'name' => $fileName,
            'parents' => $targetFolderId ? [$targetFolderId] : [],
        ]);

        try {
            $fileContent = file_get_contents($filePath);

            $uploadedFile = $this->drive->files->create($fileMetadata, [
                'data' => $fileContent,
                'mimeType' => $mimeType,
                'uploadType' => 'multipart',
                'fields' => 'id, name, webViewLink',
            ]);

            Log::info('File uploaded to Google Drive', [
                'file_id' => $uploadedFile->id,
                'file_name' => $uploadedFile->name,
                'local_path' => $filePath,
            ]);

            return [
                'id' => $uploadedFile->id,
                'name' => $uploadedFile->name,
                'url' => $this->getViewUrl($uploadedFile->id),
            ];
        } catch (GoogleServiceException $exception) {
            Log::error('Google Drive upload failed', [
                'file_path' => $filePath,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to upload file to Google Drive: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    public function download(string $fileId): ?string
    {
        try {
            $response = $this->drive->files->get($fileId, ['alt' => 'media']);
            $content = $response->getBody()->getContents();

            Log::info('File downloaded from Google Drive', ['file_id' => $fileId]);

            return $content;
        } catch (GoogleServiceException $exception) {
            if ($exception->getCode() === 404) {
                Log::warning('File not found for download', [
                    'file_id' => $fileId,
                    'error' => $exception->getMessage(),
                ]);

                return null;
            }

            if ($exception->getCode() === 403) {
                Log::error('Access denied for file download', [
                    'file_id' => $fileId,
                    'error' => $exception->getMessage(),
                ]);

                throw new RuntimeException(
                    'Access denied to download file. Please check permissions.',
                    $exception->getCode(),
                    $exception
                );
            }

            Log::error('Google Drive download failed', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
                'code' => $exception->getCode(),
            ]);

            throw new RuntimeException(
                'Failed to download file from Google Drive: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    public function update(
        string $fileId,
        string $newFilePath,
        ?string $newFileName = null,
        ?string $mimeType = null
    ): string {
        $this->validateFilePath($newFilePath);

        $fileMetadata = new DriveFile([
            'name' => $newFileName ?? basename($newFilePath),
        ]);

        $mimeType = $mimeType ?? $this->detectMimeType($newFilePath);
        $fileContent = file_get_contents($newFilePath);

        try {
            $updatedFile = $this->drive->files->update($fileId, $fileMetadata, [
                'data' => $fileContent,
                'mimeType' => $mimeType,
                'uploadType' => 'multipart',
                'fields' => 'id',
            ]);

            Log::info('File updated in Google Drive', [
                'file_id' => $fileId,
                'new_file_path' => $newFilePath,
            ]);

            return $updatedFile->id;
        } catch (GoogleServiceException $exception) {
            Log::error('Google Drive update failed', [
                'file_id' => $fileId,
                'new_file_path' => $newFilePath,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to update file in Google Drive: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    public function delete(string $fileId): void
    {
        try {
            $this->drive->files->delete($fileId);

            // Clear cache
            Cache::forget("drive_file_info_{$fileId}");
            Cache::forget("video_info_{$fileId}");

            Log::info('File deleted from Google Drive', ['file_id' => $fileId]);
        } catch (GoogleServiceException $exception) {
            Log::error('Google Drive deletion failed', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to delete file from Google Drive: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    public function fileExists(string $fileId): bool
    {
        return $this->getFileInfo($fileId) !== null;
    }

    public function isValidFileId(string $fileId): bool
    {
        return preg_match('/^[a-zA-Z0-9_-]{25,44}$/', $fileId) === 1;
    }

    public function getFileInfoSafe(string $fileId): ?array
    {
        if (! $this->isValidFileId($fileId)) {
            Log::warning('Invalid Google Drive file ID format', ['file_id' => $fileId]);

            return null;
        }

        $fileInfo = $this->getFileInfo($fileId);

        if ($fileInfo === null) {
            return null;
        }

        return [
            'id' => $fileInfo->id,
            'name' => $fileInfo->name,
            'mimeType' => $fileInfo->mimeType,
            'size' => $fileInfo->size,
            'createdTime' => $fileInfo->createdTime,
            'modifiedTime' => $fileInfo->modifiedTime,
            'webViewLink' => $fileInfo->webViewLink,
            'downloadUrl' => $this->getDownloadUrl($fileInfo->id),
            'viewUrl' => $this->getViewUrl($fileInfo->id),
        ];
    }

    public function makePublic(string $fileId): void
    {
        $permission = new Permission([
            'type' => 'anyone',
            'role' => 'reader',
        ]);

        try {
            $this->drive->permissions->create($fileId, $permission);

            Log::info('File made public in Google Drive', ['file_id' => $fileId]);
        } catch (GoogleServiceException $exception) {
            Log::error('Failed to make file public in Google Drive', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to make file public: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    public function getDownloadUrl(string $fileId): string
    {
        return "https://drive.google.com/uc?id={$fileId}&export=download";
    }

    public function getPublicUrl(string $fileId): string
    {
        return $this->getDownloadUrl($fileId);
    }

    public function getViewUrl(string $fileId): string
    {
        try {
            $this->makePublic($fileId);
        } catch (RuntimeException $exception) {
            Log::warning('Could not make file public', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
            ]);
        }

        return "https://drive.google.com/file/d/{$fileId}/view?usp=sharing";
    }

    public function get(string $fileId): string
    {
        try {
            $response = $this->drive->files->get($fileId, ['alt' => 'media']);

            return $response->getBody()->getContents();
        } catch (GoogleServiceException $e) {
            throw new RuntimeException('Failed to get file: '.$e->getMessage(), $e->getCode(), $e);
        }
    }

    public function getStreamingUrl(string $fileId): string
    {
        try {
            $this->makePublic($fileId);
        } catch (RuntimeException $exception) {
            Log::warning('Could not make file public for streaming', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
            ]);
        }

        return "https://drive.google.com/uc?id={$fileId}";
    }

    public function listFiles(?string $folderId = null, int $maxResults = 100): array
    {
        $query = 'trashed = false';

        if ($folderId) {
            $query .= " and '{$folderId}' in parents";
        }

        try {
            $response = $this->drive->files->listFiles([
                'q' => $query,
                'pageSize' => $maxResults,
                'fields' => 'files(id, name, mimeType, size, createdTime, modifiedTime)',
                'orderBy' => 'name',
            ]);

            return array_map(function ($file) {
                return [
                    'id' => $file->id,
                    'name' => $file->name,
                    'mimeType' => $file->mimeType,
                    'size' => $file->size,
                    'createdTime' => $file->createdTime,
                    'modifiedTime' => $file->modifiedTime,
                ];
            }, $response->files);
        } catch (GoogleServiceException $exception) {
            Log::error('Failed to list files from Google Drive', [
                'folder_id' => $folderId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to list files: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    private function initializeCredentials(): void
    {
        $clientId = config('filesystems.disks.google.clientId');
        $clientSecret = config('filesystems.disks.google.clientSecret');
        $refreshToken = config('filesystems.disks.google.refreshToken');
        $this->defaultFolderId = config('filesystems.disks.google.folderId');

        if (empty($clientId) || empty($clientSecret) || empty($refreshToken)) {
            throw new RuntimeException(
                'Google Drive credentials are not properly configured. '.
                    'Please check your filesystems.disks.google configuration.'
            );
        }
    }

    private function setupGoogleClient(): void
    {
        $clientId = config('filesystems.disks.google.clientId');
        $clientSecret = config('filesystems.disks.google.clientSecret');
        $refreshToken = config('filesystems.disks.google.refreshToken');

        $this->client = new GoogleClient;
        $this->client->setClientId($clientId);
        $this->client->setClientSecret($clientSecret);
        $this->client->setAccessType('offline');
        $this->client->setApprovalPrompt('force');

        try {
            if ($this->client->isAccessTokenExpired()) {
                $this->client->fetchAccessTokenWithRefreshToken($refreshToken);
            } else {
                $this->client->refreshToken($refreshToken);
            }
        } catch (\Exception $exception) {
            throw new RuntimeException(
                'Failed to authenticate with Google Drive: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    private function resolveFolder(?string $folderIdOrName): ?string
    {
        if ($folderIdOrName === null) {
            return $this->defaultFolderId;
        }

        if (preg_match('/^[a-zA-Z0-9_-]{25,}$/', $folderIdOrName)) {
            return $folderIdOrName;
        }

        return $this->getOrCreateFolder($folderIdOrName, $this->defaultFolderId);
    }

    private function getOrCreateFolder(string $folderName, ?string $parentFolderId = null): string
    {
        $escapedName = addcslashes($folderName, "'\\");
        $query = "name = '{$escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";

        if ($parentFolderId) {
            $query .= " and '{$parentFolderId}' in parents";
        }

        try {
            $response = $this->drive->files->listFiles([
                'q' => $query,
                'fields' => 'files(id, name)',
                'spaces' => 'drive',
            ]);

            if (! empty($response->files) && isset($response->files[0]->id)) {
                return $response->files[0]->id;
            }

            return $this->createFolder($folderName, $parentFolderId);
        } catch (GoogleServiceException $exception) {
            Log::error('Failed to search for folder in Google Drive', [
                'folder_name' => $folderName,
                'parent_folder_id' => $parentFolderId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to search for folder: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    private function createFolder(string $folderName, ?string $parentFolderId = null): string
    {
        $folderMetadata = new DriveFile([
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => $parentFolderId ? [$parentFolderId] : [],
        ]);

        try {
            $folder = $this->drive->files->create($folderMetadata, [
                'fields' => 'id, name',
            ]);

            if (empty($folder->id)) {
                throw new RuntimeException("Failed to create folder '{$folderName}' - no ID returned");
            }

            Log::info('Folder created in Google Drive', [
                'folder_id' => $folder->id,
                'folder_name' => $folderName,
                'parent_folder_id' => $parentFolderId,
            ]);

            return $folder->id;
        } catch (GoogleServiceException $exception) {
            Log::error('Failed to create folder in Google Drive', [
                'folder_name' => $folderName,
                'parent_folder_id' => $parentFolderId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to create folder: '.$exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    private function validateFilePath(string $filePath): void
    {
        if (! file_exists($filePath)) {
            throw new InvalidArgumentException("File not found: {$filePath}");
        }

        if (! is_readable($filePath)) {
            throw new InvalidArgumentException("File is not readable: {$filePath}");
        }
    }

    private function detectMimeType(string $filePath): string
    {
        $mimeType = mime_content_type($filePath);

        return $mimeType ?: 'application/octet-stream';
    }

    /**
     * Check if uploaded video is ready to play (FIXED VERSION)
     *
     * @param  string  $fileId  Google Drive file ID
     * @return string 'ready' if video can play, 'processing' if still being processed
     */
    public function checkVideoReadyStatus(string $fileId): string
    {
        try {
            // Get file information with video metadata
            $fileInfo = $this->drive->files->get($fileId, [
                'fields' => 'id, name, mimeType, size, videoMediaMetadata',
            ]);

            if (! $fileInfo) {
                return 'processing';
            }

            // Check if it's a video file
            if (! str_starts_with($fileInfo->mimeType ?? '', 'video/')) {
                return 'ready';
            }

            // Check if video has metadata (indicates processing is complete)
            $videoMetadata = $fileInfo->videoMediaMetadata ?? null;

            if (! $videoMetadata) {
                return 'processing'; // No video metadata means still processing
            }

            // Check if video has proper dimensions (another indicator)
            if (! isset($videoMetadata->width) || ! isset($videoMetadata->height)) {
                return 'processing';
            }

            // Test actual streaming capability with range request
            $accessToken = $this->getCachedAccessToken();
            $url = "https://www.googleapis.com/drive/v3/files/{$fileId}?alt=media";

            $response = $this->httpClient->get($url, [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Range' => 'bytes=0-1023', // First 1KB
                ],
                'timeout' => 10,
                'stream' => true,
            ]);

            $statusCode = $response->getStatusCode();

            // Video is ready if we get partial content (206) or full content (200)
            if ($statusCode === 206 || $statusCode === 200) {
                $content = $response->getBody()->read(100); // Read small amount

                return ! empty($content) ? 'ready' : 'processing';
            }

            return 'processing';
        } catch (\Exception $e) {
            // If we get a 403 or 416 error, video might still be processing
            if (
                strpos($e->getMessage(), '403') !== false ||
                strpos($e->getMessage(), '416') !== false
            ) {
                return 'processing';
            }

            Log::debug('Video status check failed', [
                'file_id' => $fileId,
                'error' => $e->getMessage(),
            ]);

            return 'processing';
        }
    }
}
