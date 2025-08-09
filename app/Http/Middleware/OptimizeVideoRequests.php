<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class OptimizeVideoRequests
{
    /**
     * Ultra-optimized middleware for video requests
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Different handling for different request types
        $isStreaming = str_contains($request->path(), '/stream/');
        $isVideoView = str_contains($request->path(), '/view/');

        if ($isStreaming) {
            // For streaming: minimal processing, maximum speed
            return $this->handleStreaming($request, $next);
        }

        if ($isVideoView) {
            // For video pages: prevent duplicate loads
            return $this->handleVideoView($request, $next);
        }

        return $next($request);
    }

    private function handleStreaming(Request $request, Closure $next): Response
    {
        // No duplicate prevention for streaming - allow concurrent streams
        // Just optimize the response
        $response = $next($request);

        // Add streaming-optimized headers
        if ($response instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            $response->headers->set('X-Accel-Buffering', 'no');
            $response->headers->set('Connection', 'keep-alive');
        }

        return $response;
    }

    private function handleVideoView(Request $request, Closure $next): Response
    {
        // Prevent duplicate video page loads
        $videoId = $request->route('id');
        $lockKey = "video_load_{$videoId}_".$request->ip();

        if (Cache::has($lockKey)) {
            // Return cached response if available
            $cachedResponse = Cache::get("video_response_{$videoId}");
            if ($cachedResponse) {
                return response()->json($cachedResponse);
            }

            return response()->json([
                'message' => 'Video loading, please wait...',
                'video_id' => $videoId,
            ], 429);
        }

        // Lock for 15 seconds
        Cache::put($lockKey, true, 15);

        try {
            $response = $next($request);

            // Cache successful responses
            if ($response->getStatusCode() === 200) {
                Cache::put("video_response_{$videoId}", $response->getData(), 3600);
            }

            Cache::forget($lockKey);

            return $response;
        } catch (\Throwable $e) {
            Cache::forget($lockKey);
            throw $e;
        }
    }
}
