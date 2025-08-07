<?php

declare(strict_types=1);

namespace App\Domains\Menu\Pages\View;

use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ManageDynamicPage
{
    private GoogleDriveService $drive;

    // YouTube-style intelligent buffering constants
    private const INITIAL_BUFFER_SIZE = 512 * 1024;      // 512 KB for instant start
    private const SMALL_CHUNK_SIZE = 256 * 1024;         // 256 KB for seeking
    private const OPTIMAL_CHUNK_SIZE = 1024 * 1024;      // 1 MB for continuous
    private const LARGE_CHUNK_SIZE = 2 * 1024 * 1024;    // 2 MB for large files
    private const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50 MB threshold
    private const CACHE_DURATION = 3600; // 1 hour cache

    public function __construct(GoogleDriveService $drive)
    {
        $this->drive = $drive;
    }

    /**
     * Video page display - UNCHANGED from your original
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

            $cacheKey = "video_metadata_{$id}";
            $fileInfo = Cache::remember($cacheKey, self::CACHE_DURATION, fn() => $this->drive->getFileInfo($id));

            if ($fileInfo === null) {
                return inertia('menu/view/index', [
                    'video' => null,
                    'title' => 'File Not Found',
                    'error' => 'The requested file was not found or you do not have permission to access it.',
                ]);
            }

            $fileSize = (int)($fileInfo->size ?? 0);
            $isLargeFile = $fileSize > self::LARGE_FILE_THRESHOLD;

            // Keep your existing video data structure
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

                // Add intelligent buffering metadata (won't affect your existing frontend)
                'streaming' => [
                    'initialBufferSize' => self::INITIAL_BUFFER_SIZE,
                    'optimalChunkSize' => self::OPTIMAL_CHUNK_SIZE,
                    'isLargeFile' => $isLargeFile,
                    'supportsRangeRequests' => true,
                    'intelligentBuffering' => true,
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
     * ENHANCED streaming with YouTube-style intelligent buffering
     * This detects when the video is paused and adjusts buffering accordingly
     */
    public function stream(string $id, Request $request): StreamedResponse
    {
        DB::disconnect();
        session()->save();
        session_write_close();

        // Get cached file metadata
        $cacheKey = "video_metadata_{$id}";
        $fileInfo = Cache::get($cacheKey) ?? $this->drive->getFileInfo($id);

        if (!$fileInfo) {
            Log::error("File not found for streaming: {$id}");
            abort(404, 'File not found');
        }

        // Cache file info for future requests
        if (!Cache::has($cacheKey)) {
            Cache::put($cacheKey, $fileInfo, self::CACHE_DURATION);
        }

        $fileSize = (int)($fileInfo->size ?? 0);
        $mimeType = $fileInfo->mimeType ?? 'video/mp4';
        $isLargeFile = $fileSize > self::LARGE_FILE_THRESHOLD;

        // Detect intelligent buffering context from headers
        $playerState = $request->header('X-Player-State', 'unknown');
        $bufferState = $request->header('X-Buffer-State', 'standard');
        $isIntelligentRequest = $bufferState === 'intelligent';

        // Enhanced range parsing
        $range = $request->header('Range');
        $start = 0;
        $end = $fileSize - 1;

        if ($range !== null) {
            if (!preg_match('/bytes=(\d+)-(\d*)/', $range, $matches)) {
                Log::warning("Invalid range header: {$range}");
                return response('Invalid Range', 416, [
                    'Content-Range' => "bytes */{$fileSize}",
                    'Accept-Ranges' => 'bytes'
                ]);
            }

            $start = (int)$matches[1];
            if (isset($matches[2]) && $matches[2] !== '') {
                $end = (int)$matches[2];
            }

            // Validate range bounds
            if ($start > $end || $start >= $fileSize || $end >= $fileSize) {
                Log::warning("Range not satisfiable: {$range} for file size {$fileSize}");
                return response('Range Not Satisfiable', 416, [
                    'Content-Range' => "bytes */{$fileSize}",
                    'Accept-Ranges' => 'bytes'
                ]);
            }
        }

        $contentLength = $end - $start + 1;

        // INTELLIGENT CHUNK SIZING based on player state
        $chunkSize = $this->getIntelligentChunkSize($contentLength, $isLargeFile, $playerState, $start, $fileSize);

        // Detect if this is a paused buffering request (should be served slower)
        $isPausedBuffering = $playerState === 'paused' && $isIntelligentRequest;

        // Detect request type for logging
        $requestType = $this->detectRequestType($contentLength, $start, $fileSize, $playerState);

        Log::info("Intelligent streaming request", [
            'file_id' => $id,
            'range' => "bytes {$start}-{$end}",
            'content_length' => $contentLength,
            'chunk_size' => $chunkSize,
            'player_state' => $playerState,
            'buffer_state' => $bufferState,
            'request_type' => $requestType,
            'is_paused_buffering' => $isPausedBuffering,
        ]);

        // Enhanced headers for intelligent buffering
        $headers = [
            'Content-Type' => $mimeType,
            'Content-Length' => (string)$contentLength,
            'Accept-Ranges' => 'bytes',

            // Intelligent caching based on player state
            'Cache-Control' => $this->getIntelligentCacheControl($playerState, $requestType),
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + $this->getCacheExpiry($requestType)),
            'Last-Modified' => gmdate('D, d M Y H:i:s \G\M\T', strtotime($fileInfo->modifiedTime ?? '-1 hour')),
            'ETag' => '"' . md5($id . $fileSize . $start . $end) . '"',

            // Streaming optimization
            'X-Accel-Buffering' => 'no',
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'SAMEORIGIN',
            'Connection' => 'keep-alive',

            // CORS headers
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => 'Range, If-Range, Cache-Control, Content-Type, X-Player-State, X-Buffer-State',
            'Access-Control-Expose-Headers' => 'Accept-Ranges, Content-Length, Content-Range, Content-Type, Cache-Control, X-Stream-Type',
            'Access-Control-Max-Age' => '86400',

            // Custom headers for intelligent buffering
            'X-Stream-Type' => $requestType,
            'X-Intelligent-Buffering' => $isIntelligentRequest ? 'true' : 'false',
            'X-Player-State-Detected' => $playerState,

            // Vary header
            'Vary' => 'Range, X-Player-State, X-Buffer-State',
        ];

        // Set status code
        if ($range !== null) {
            $headers['Content-Range'] = "bytes {$start}-{$end}/{$fileSize}";
            $status = 206; // Partial Content
        } else {
            $status = 200; // OK
        }

        // Return intelligently optimized streamed response
        return new StreamedResponse(function () use ($id, $start, $contentLength, $chunkSize, $isPausedBuffering, $requestType, $playerState) {
            $this->streamWithIntelligentBuffering($id, $start, $contentLength, $chunkSize, $isPausedBuffering, $requestType, $playerState);
        }, $status, $headers);
    }

    /**
     * YouTube-style intelligent streaming that respects player state
     */
    private function streamWithIntelligentBuffering(
        string $id,
        int $start,
        int $length,
        int $chunkSize,
        bool $isPausedBuffering,
        string $requestType,
        string $playerState
    ): void {
        $position = 0;
        $remaining = $length;
        $retryCount = 0;
        $maxRetries = 3;

        // Set timeout based on request type
        set_time_limit($length > self::LARGE_FILE_THRESHOLD ? 0 : 300);

        // INTELLIGENT STREAMING: Adjust behavior based on player state
        $streamDelay = 0; // microseconds between chunks
        $flushFrequency = 512 * 1024; // How often to flush (512KB default)

        if ($isPausedBuffering) {
            // Video is PAUSED - stream slower to save bandwidth
            $streamDelay = 50000; // 50ms delay between chunks
            $flushFrequency = 256 * 1024; // Flush more frequently (256KB)
            Log::debug("Streaming in PAUSED mode - throttled delivery", ['file_id' => $id]);
        } elseif ($playerState === 'playing') {
            // Video is PLAYING - stream at full speed
            $streamDelay = 0; // No delay
            $flushFrequency = 1024 * 1024; // Flush less frequently (1MB)
            Log::debug("Streaming in PLAYING mode - full speed delivery", ['file_id' => $id]);
        } elseif ($requestType === 'seek') {
            // SEEKING - prioritize speed
            $streamDelay = 0;
            $flushFrequency = 128 * 1024; // Very frequent flushing (128KB)
            Log::debug("Streaming in SEEK mode - priority delivery", ['file_id' => $id]);
        }

        while ($remaining > 0 && !connection_aborted()) {
            try {
                $readLength = min($chunkSize, $remaining);
                $currentStart = $start + $position;

                // Fetch chunk
                $data = $this->drive->getRange($id, $currentStart, $readLength);

                if ($data === '') {
                    Log::warning("Empty chunk received", [
                        'file_id' => $id,
                        'position' => $position,
                        'player_state' => $playerState,
                    ]);
                    break;
                }

                // Output chunk
                echo $data;

                // INTELLIGENT FLUSHING based on player state
                if ($position % $flushFrequency === 0 || $requestType === 'seek') {
                    if (ob_get_level()) ob_flush();
                    flush();
                }

                $dataLength = strlen($data);
                $position += $dataLength;
                $remaining -= $dataLength;

                // INTELLIGENT DELAY for paused buffering
                if ($streamDelay > 0) {
                    usleep($streamDelay);
                }

                // Progressive logging for large requests
                if ($this->shouldLogProgress($length, $position, $requestType)) {
                    Log::debug("Intelligent streaming progress", [
                        'file_id' => $id,
                        'progress' => round(($position / $length) * 100, 2) . '%',
                        'bytes_sent' => $position,
                        'player_state' => $playerState,
                        'request_type' => $requestType,
                    ]);
                }

                // Break if we received less data than requested (EOF)
                if ($dataLength < $readLength) {
                    break;
                }

                $retryCount = 0; // Reset on success

            } catch (\Exception $e) {
                Log::error("Intelligent streaming error", [
                    'file_id' => $id,
                    'position' => $position,
                    'player_state' => $playerState,
                    'error' => $e->getMessage(),
                    'retry_count' => $retryCount
                ]);

                if ($retryCount >= $maxRetries) {
                    Log::error("Max retries exceeded", ['file_id' => $id]);
                    break;
                }

                $retryCount++;
                usleep(100000 * $retryCount); // Progressive delay
            }
        }

        if (connection_aborted()) {
            Log::info("Client disconnected during intelligent streaming", [
                'file_id' => $id,
                'position' => $position,
                'player_state' => $playerState
            ]);
        }
    }

    /**
     * Get intelligent chunk size based on context
     */
    private function getIntelligentChunkSize(int $contentLength, bool $isLargeFile, string $playerState, int $start, int $fileSize): int
    {
        // For paused videos, use smaller chunks to save bandwidth
        if ($playerState === 'paused') {
            return min(self::SMALL_CHUNK_SIZE, $contentLength);
        }

        // For seeks (small requests), use small chunks for speed
        if ($contentLength <= self::INITIAL_BUFFER_SIZE) {
            return min(self::SMALL_CHUNK_SIZE, $contentLength);
        }

        // For playing videos with large files, use optimal chunks
        if ($isLargeFile && $playerState === 'playing') {
            return min(self::LARGE_CHUNK_SIZE, $contentLength);
        }

        // Default optimal size
        return min(self::OPTIMAL_CHUNK_SIZE, $contentLength);
    }

    /**
     * Detect request type for intelligent handling
     */
    private function detectRequestType(int $contentLength, int $start, int $fileSize, string $playerState): string
    {
        // Small request at beginning = initial load
        if ($start === 0 && $contentLength <= self::INITIAL_BUFFER_SIZE) {
            return 'initial';
        }

        // Small request not at beginning = seek
        if ($contentLength <= self::INITIAL_BUFFER_SIZE) {
            return 'seek';
        }

        // Large request = continuous playback
        return 'continuous';
    }

    /**
     * Get intelligent cache control
     */
    private function getIntelligentCacheControl(string $playerState, string $requestType): string
    {
        if ($playerState === 'paused') {
            return 'public, max-age=300'; // 5 minutes for paused
        }

        if ($requestType === 'seek') {
            return 'public, max-age=60'; // 1 minute for seeks
        }

        return 'public, max-age=3600'; // 1 hour for normal playback
    }

    /**
     * Get cache expiry time
     */
    private function getCacheExpiry(string $requestType): int
    {
        switch ($requestType) {
            case 'seek':
                return 300; // 5 minutes
            case 'initial':
                return 1800; // 30 minutes
            default:
                return 3600; // 1 hour
        }
    }

    /**
     * Should we log progress?
     */
    private function shouldLogProgress(int $totalLength, int $position, string $requestType): bool
    {
        if ($totalLength <= self::LARGE_FILE_THRESHOLD) return false;
        if ($requestType === 'seek') return false;
        return $position % (5 * 1024 * 1024) === 0; // Every 5MB
    }
}
