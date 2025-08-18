<?php

declare(strict_types=1);

namespace App\Domains\Api\Lib;

use App\Services\GoogleDriveService;

class ServeImage
{
    public function __construct(
        public readonly GoogleDriveService $drive
    ) {}
    /**
     * Serve Google Drive image
     */
    public function __invoke(string $fileId)
    {
        try {
            // Get the image content from Google Drive
            $imageContent = $this->drive->get($fileId);

            // Get file info to determine mime type
            $fileInfo = $this->drive->getFileInfo($fileId);
            $mimeType = $fileInfo ? $fileInfo->mimeType : 'image/jpeg';

            return response($imageContent)
                ->header('Content-Type', $mimeType)
                ->header('Cache-Control', 'public, max-age=86400'); // Cache for 1 hour

        } catch (\Exception $e) {
            // Return a 404 or placeholder image on error
            return response()->json(['error' => 'Image not found'], 404);
        }
    }
}
