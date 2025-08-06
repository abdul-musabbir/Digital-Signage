<?php

declare(strict_types=1);

namespace App\Services;

use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;
use Google\Service\Exception as GoogleServiceException;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Google Drive Service for file management operations
 * 
 * Provides comprehensive file upload, download, update, and deletion functionality
 * with automatic folder management and public sharing capabilities.
 */
class GoogleDriveService
{
    private GoogleClient $client;
    private GoogleDrive $drive;
    private ?string $defaultFolderId;

    /**
     * Initialize Google Drive service with OAuth2 credentials
     * 
     * @throws RuntimeException When required credentials are missing
     */
    public function __construct()
    {
        $this->initializeCredentials();
        $this->setupGoogleClient();
        $this->drive = new GoogleDrive($this->client);
    }

    /**
     * Upload a file to Google Drive
     *
     * @param string      $filePath     Absolute path to the local file
     * @param string|null $fileName     Optional custom filename for Drive
     * @param string|null $mimeType     Optional MIME type (auto-detected if null)
     * @param string|null $parentFolder Folder name or ID (uses default if null)
     * 
     * @return array{id: string, name: string, url: string} File information
     * @throws InvalidArgumentException When file doesn't exist
     * @throws RuntimeException When upload fails
     */
    public function upload(
        string $filePath,
        ?string $fileName = null,
        ?string $mimeType = null,
        ?string $parentFolder = null
    ): array {
        $this->validateFilePath($filePath);

        // Increase memory limit only for this operation
        ini_set('memory_limit', '1024M'); // or higher, depending on your file size

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
                'Failed to upload file to Google Drive: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Download file content by ID with existence check
     *
     * @param string $fileId Google Drive file ID
     * @return string|null File content or null if file not found
     * @throws RuntimeException When download fails (excluding 404)
     */
    public function download(string $fileId): ?string
    {
        try {
            $response = $this->drive->files->get($fileId, ['alt' => 'media']);
            $content = $response->getBody()->getContents();

            Log::info('File downloaded from Google Drive', ['file_id' => $fileId]);

            return $content;
        } catch (GoogleServiceException $exception) {
            // Handle 404 (file not found) gracefully
            if ($exception->getCode() === 404) {
                Log::warning('File not found for download', [
                    'file_id' => $fileId,
                    'error' => $exception->getMessage(),
                ]);
                return null;
            }

            // Handle 403 (access denied)
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
                'Failed to download file from Google Drive: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Update an existing file with new content
     *
     * @param string      $fileId      Google Drive file ID
     * @param string      $newFilePath Path to the new file content
     * @param string|null $newFileName Optional new filename
     * @param string|null $mimeType    Optional MIME type
     * 
     * @return string Updated file ID
     * @throws InvalidArgumentException When file doesn't exist
     * @throws RuntimeException When update fails
     */
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
                'Failed to update file in Google Drive: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Delete a file from Google Drive
     *
     * @param string $fileId Google Drive file ID
     * @throws RuntimeException When deletion fails
     */
    public function delete(string $fileId): void
    {
        try {
            $this->drive->files->delete($fileId);

            Log::info('File deleted from Google Drive', ['file_id' => $fileId]);
        } catch (GoogleServiceException $exception) {
            Log::error('Google Drive deletion failed', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to delete file from Google Drive: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Get file metadata from Google Drive
     *
     * @param string $fileId Google Drive file ID
     * @return DriveFile|null File metadata object or null if not found
     * @throws RuntimeException When retrieval fails (excluding 404)
     */
    public function getFileInfo(string $fileId): ?DriveFile
    {
        try {
            return $this->drive->files->get($fileId, [
                'fields' => 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink'
            ]);
        } catch (GoogleServiceException $exception) {
            // Handle 404 (file not found) gracefully
            if ($exception->getCode() === 404) {
                Log::warning('File not found in Google Drive', [
                    'file_id' => $fileId,
                    'error' => $exception->getMessage(),
                ]);
                return null;
            }

            // Handle 403 (access denied) with helpful message
            if ($exception->getCode() === 403) {
                Log::error('Access denied to Google Drive file', [
                    'file_id' => $fileId,
                    'error' => $exception->getMessage(),
                ]);

                throw new RuntimeException(
                    'Access denied to file. Please check if the service account has permission to access this file.',
                    $exception->getCode(),
                    $exception
                );
            }

            Log::error('Failed to get file info from Google Drive', [
                'file_id' => $fileId,
                'error' => $exception->getMessage(),
                'code' => $exception->getCode(),
            ]);

            throw new RuntimeException(
                'Failed to retrieve file information: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Check if a file exists in Google Drive
     *
     * @param string $fileId Google Drive file ID
     * @return bool True if file exists and is accessible
     */
    public function fileExists(string $fileId): bool
    {
        return $this->getFileInfo($fileId) !== null;
    }

    /**
     * Validate file ID format
     *
     * @param string $fileId Google Drive file ID to validate
     * @return bool True if format is valid
     */
    public function isValidFileId(string $fileId): bool
    {
        // Google Drive file IDs are typically 25-44 characters long
        // and contain alphanumeric characters, hyphens, and underscores
        return preg_match('/^[a-zA-Z0-9_-]{25,44}$/', $fileId) === 1;
    }

    /**
     * Get file metadata with existence check
     *
     * @param string $fileId Google Drive file ID
     * @return array|null File information array or null if not found
     */
    public function getFileInfoSafe(string $fileId): ?array
    {
        if (!$this->isValidFileId($fileId)) {
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

    /**
     * Make a file publicly readable
     *
     * @param string $fileId Google Drive file ID
     * @throws RuntimeException When permission setting fails
     */
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
                'Failed to make file public: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Get public download URL for a file
     *
     * @param string $fileId Google Drive file ID
     * @return string Public download URL
     */
    public function getDownloadUrl(string $fileId): string
    {
        return "https://drive.google.com/uc?id={$fileId}&export=download";
    }

    /**
     * Get public download URL for a file (alternative method)
     *
     * @param string $fileId Google Drive file ID
     * @return string Public download URL
     */
    public function getPublicUrl(string $fileId): string
    {
        return $this->getDownloadUrl($fileId);
    }

    /**
     * Get public view URL for a file (ensures file is public)
     *
     * @param string $fileId Google Drive file ID
     * @return string Public view URL
     */
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
            throw new RuntimeException('Failed to get file: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Get streaming URL for video files
     *
     * @param string $fileId Google Drive file ID
     * @return string Streaming URL
     */
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

    /**
     * List files in a specific folder
     *
     * @param string|null $folderId Folder ID (null for root)
     * @param int         $maxResults Maximum number of results
     * @return array List of files
     */
    public function listFiles(?string $folderId = null, int $maxResults = 100): array
    {
        $query = "trashed = false";

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
                'Failed to list files: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Initialize Google OAuth2 credentials from configuration
     *
     * @throws RuntimeException When required credentials are missing
     */
    private function initializeCredentials(): void
    {
        $clientId = config('filesystems.disks.google.clientId');
        $clientSecret = config('filesystems.disks.google.clientSecret');
        $refreshToken = config('filesystems.disks.google.refreshToken');
        $this->defaultFolderId = config('filesystems.disks.google.folderId');

        if (empty($clientId) || empty($clientSecret) || empty($refreshToken)) {
            throw new RuntimeException(
                'Google Drive credentials are not properly configured. ' .
                    'Please check your filesystems.disks.google configuration.'
            );
        }
    }

    /**
     * Setup and authenticate Google client
     *
     * @throws RuntimeException When authentication fails
     */
    private function setupGoogleClient(): void
    {
        $clientId = config('filesystems.disks.google.clientId');
        $clientSecret = config('filesystems.disks.google.clientSecret');
        $refreshToken = config('filesystems.disks.google.refreshToken');

        $this->client = new GoogleClient();
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
                'Failed to authenticate with Google Drive: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Resolve folder ID from folder name or ID
     *
     * @param string|null $folderIdOrName Folder ID or name (null for default/root)
     * @return string|null Resolved folder ID
     */
    private function resolveFolder(?string $folderIdOrName): ?string
    {
        if ($folderIdOrName === null) {
            return $this->defaultFolderId;
        }

        // Check if it's already a folder ID (contains alphanumeric characters and dashes/underscores)
        if (preg_match('/^[a-zA-Z0-9_-]{25,}$/', $folderIdOrName)) {
            return $folderIdOrName;
        }

        // It's a folder name - find or create it
        return $this->getOrCreateFolder($folderIdOrName, $this->defaultFolderId);
    }

    /**
     * Find existing folder by name or create new one
     *
     * @param string      $folderName    Name of the folder
     * @param string|null $parentFolderId Parent folder ID (null for root)
     * @return string Folder ID
     * @throws RuntimeException When folder creation fails
     */
    private function getOrCreateFolder(string $folderName, ?string $parentFolderId = null): string
    {
        // Search for existing folder
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

            // Return existing folder ID if found
            if (!empty($response->files) && isset($response->files[0]->id)) {
                return $response->files[0]->id;
            }

            // Create new folder if not found
            return $this->createFolder($folderName, $parentFolderId);
        } catch (GoogleServiceException $exception) {
            Log::error('Failed to search for folder in Google Drive', [
                'folder_name' => $folderName,
                'parent_folder_id' => $parentFolderId,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Failed to search for folder: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Create a new folder in Google Drive
     *
     * @param string      $folderName    Name of the folder to create
     * @param string|null $parentFolderId Parent folder ID (null for root)
     * @return string Created folder ID
     * @throws RuntimeException When folder creation fails
     */
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
                'Failed to create folder: ' . $exception->getMessage(),
                $exception->getCode(),
                $exception
            );
        }
    }

    /**
     * Validate that a file path exists
     *
     * @param string $filePath File path to validate
     * @throws InvalidArgumentException When file doesn't exist
     */
    private function validateFilePath(string $filePath): void
    {
        if (!file_exists($filePath)) {
            throw new InvalidArgumentException("File not found: {$filePath}");
        }

        if (!is_readable($filePath)) {
            throw new InvalidArgumentException("File is not readable: {$filePath}");
        }
    }

    /**
     * Detect MIME type of a file
     *
     * @param string $filePath File path
     * @return string MIME type
     */
    private function detectMimeType(string $filePath): string
    {
        $mimeType = mime_content_type($filePath);

        return $mimeType ?: 'application/octet-stream';
    }
}
