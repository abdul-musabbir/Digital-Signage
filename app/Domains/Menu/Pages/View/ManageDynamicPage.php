<?php

declare(strict_types=1);

namespace App\Domains\Menu\Pages\View;

use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ManageDynamicPage
{
    private GoogleDriveService $drive;

    // Constants for buffer sizes (tweakable)
    private const INITIAL_BUFFER_SIZE = 512 * 1024;    // 512 KB start buffer
    private const MAX_CHUNK_SIZE = 2 * 1024 * 1024;    // 2 MB maximum chunk for streaming

    // Cache duration in seconds
    private const CACHE_DURATION = 300;

    public function __construct(GoogleDriveService $drive)
    {
        $this->drive = $drive;
    }

    /**
     * Video page display (basic info)
     */
    public function index(string $id)
    {
        try {
            if (!$this->drive->isValidFileId($id)) {
                return inertia('menu/view/index', [
                    'video' => null,
                    'title' => 'Error',
                    'error' => 'Invalid file ID format',
                ]);
            }

            $cacheKey = "video_info_{$id}";
            $fileInfo = Cache::remember($cacheKey, self::CACHE_DURATION, fn() => $this->drive->getFileInfo($id));

            if ($fileInfo === null) {
                return inertia('menu/view/index', [
                    'video' => null,
                    'title' => 'File Not Found',
                    'error' => 'The requested file was not found or you do not have permission to access it.',
                ]);
            }

            $fileSize = (int)($fileInfo->size ?? 0);

            $videoData = [
                'id' => $id,
                'name' => $fileInfo->name ?? 'Unknown',
                'mimeType' => $fileInfo->mimeType ?? 'video/mp4',
                'size' => $fileSize,
                'streamingUrl' => route('menu.video.stream', ['id' => $id]),
                'publicUrl' => $this->drive->getPublicUrl($id),
                'downloadUrl' => $this->drive->getDownloadUrl($id),
                'viewUrl' => $this->drive->getViewUrl($id),
                'createdTime' => $fileInfo->createdTime ?? null,
                'modifiedTime' => $fileInfo->modifiedTime ?? null,
                'streaming' => [
                    'initialBufferSize' => self::INITIAL_BUFFER_SIZE,
                    'maxChunkSize' => self::MAX_CHUNK_SIZE,
                    'isLargeFile' => $fileSize > 100 * 1024 * 1024,
                ],
            ];

            return inertia('menu/view/index', [
                'video' => $videoData,
                'title' => $fileInfo->name ?? 'Video Player',
                'error' => null,
            ]);
        } catch (RuntimeException $e) {
            $message = 'Unable to load the requested file.';
            if ($e->getCode() === 403) {
                $message = 'Access denied. Please check permissions.';
            }
            return inertia('menu/view/index', [
                'video' => null,
                'title' => 'Error',
                'error' => $message,
            ]);
        }
    }

    /**
     * The professional streaming endpoint
     * Streams video in chunks with full HTTP range support and flushes output
     */
    public function stream(string $id, Request $request): StreamedResponse
    {
        // Fetch file metadata from cache or API
        $cacheKey = "video_info_{$id}";
        $fileInfo = Cache::get($cacheKey) ?? $this->drive->getFileInfo($id);

        if (!$fileInfo) {
            Log::error("File not found for streaming: {$id}");
            abort(404, 'File not found');
        }

        // Cache file info if needed
        if (!Cache::has($cacheKey)) {
            Cache::put($cacheKey, $fileInfo, self::CACHE_DURATION);
        }

        $fileSize = (int)($fileInfo->size ?? 0);
        $mimeType = $fileInfo->mimeType ?? 'video/mp4';

        // Parse HTTP Range header
        $range = $request->header('Range');
        $start = 0;
        $end = $fileSize - 1;

        if ($range !== null) {
            if (!preg_match('/bytes=(\d+)-(\d*)/', $range, $matches)) {
                return response('Invalid Range', 416, ['Content-Range' => "bytes */{$fileSize}"]);
            }
            $start = (int)$matches[1];
            if (isset($matches[2]) && $matches[2] !== '') {
                $end = (int)$matches[2];
            }

            if ($start > $end || $end >= $fileSize) {
                return response('Range Not Satisfiable', 416, ['Content-Range' => "bytes */{$fileSize}"]);
            }
        }

        $contentLength = $end - $start + 1;

        Log::info("Streaming request for {$id} bytes {$start}-{$end}");

        // Prepare headers for streaming
        $headers = [
            'Content-Type' => $mimeType,
            'Content-Length' => (string)$contentLength,
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'public, max-age=3600, must-revalidate',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 3600),
            'Last-Modified' => gmdate('D, d M Y H:i:s \G\M\T', strtotime($fileInfo->modifiedTime ?? '-1 hour')),
            'ETag' => '"' . md5($mimeType . $fileSize . $start . $end) . '"',
            'X-Accel-Buffering' => 'no',       // Nginx: disable buffering
            'Connection' => 'keep-alive',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => 'Range, If-Range, Cache-Control, Content-Type',
            'Access-Control-Expose-Headers' => 'Accept-Ranges, Content-Length, Content-Range, Content-Type, Cache-Control',
            'Access-Control-Max-Age' => '86400',
            'Vary' => 'Accept-Encoding',
            'X-Content-Type-Options' => 'nosniff',
        ];

        if ($range !== null) {
            $headers['Content-Range'] = "bytes {$start}-{$end}/{$fileSize}";
            $status = 206;
        } else {
            $status = 200;
        }

        // Use Laravel's StreamedResponse to stream data chunk-by-chunk
        return new StreamedResponse(function () use ($id, $start, $end, $contentLength) {
            $this->streamFileRange($id, $start, $contentLength);
        }, $status, $headers);
    }

    /**
     * Stream file contents from backend in chunks between start and length
     * Ensures efficient memory and network use by streaming chunk-wise, flushing output each time
     */
    private function streamFileRange(string $id, int $start, int $length): void
    {
        $position = 0;
        $chunkSize = self::MAX_CHUNK_SIZE;
        $remaining = $length;

        while ($remaining > 0 && !connection_aborted()) {
            $readLength = min($chunkSize, $remaining);

            // Fetch the chunk from backend (use byte-range request)
            $data = $this->getFileChunk($id, $start + $position, $readLength);

            if ($data === '') {
                // No data returned, either eof or error
                break;
            }

            echo $data;
            if (ob_get_level()) {
                ob_flush();
            }
            flush();

            $dataLength = strlen($data);
            $position += $dataLength;
            $remaining -= $dataLength;

            if ($dataLength < $readLength) {
                // Less data than requested: end of file reached
                break;
            }
        }
    }

    /**
     * Fetches a chunk of the file from Google Drive backend using range requests (ideal)
     * IMPORTANT: Your GoogleDriveService should implement native byte-range fetching from Google Drive API.
     *
     * @param string $id File ID on Google Drive
     * @param int $start Start byte position
     * @param int $length Length of bytes to fetch
     * @return string Binary data chunk of video
     */
    private function getFileChunk(string $id, int $start, int $length): string
    {
        if (method_exists($this->drive, 'getRange')) {
            try {
                return $this->drive->getRange($id, $start, $length);
            } catch (\Exception $e) {
                Log::error("GoogleDriveService range read failed: {$e->getMessage()}");
                throw $e;
            }
        }

        // Fallback (not recommended for large files): Load the full file into memory once and substring
        static $cachedFileId = null;
        static $cachedFileContent = null;

        if ($cachedFileId !== $id) {
            $cachedFileContent = $this->drive->get($id);
            $cachedFileId = $id;
        }

        return substr($cachedFileContent, $start, $length) ?: '';
    }
}
