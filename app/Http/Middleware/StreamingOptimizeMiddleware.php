<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StreamingOptimizeMiddleware
{
    /**
     * Handle an incoming request for streaming optimization.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pre-processing optimizations for streaming
        $this->optimizeEnvironmentForStreaming();

        // Process the request
        $response = $next($request);

        // Post-processing optimizations
        $this->optimizeResponseForStreaming($response, $request);

        return $response;
    }

    /**
     * Optimize the environment for streaming
     */
    private function optimizeEnvironmentForStreaming(): void
    {
        // Disable compression for streaming to avoid buffering
        if (function_exists('apache_setenv')) {
            apache_setenv('no-gzip', '1');
        }

        // Set compression off for nginx
        if (function_exists('header')) {
            header('Content-Encoding: identity');
        }

        // Disable output buffering for real-time streaming
        while (ob_get_level()) {
            ob_end_clean();
        }

        // Set memory and time limits for large file streaming
        ini_set('memory_limit', '256M');
        set_time_limit(0); // No time limit for streaming

        // Optimize for streaming
        ignore_user_abort(false); // Stop streaming if user disconnects
    }

    /**
     * Optimize response for streaming
     */
    private function optimizeResponseForStreaming(Response $response, Request $request): void
    {
        // Only optimize StreamedResponse
        if (!$response instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return;
        }

        // Get request context for optimization
        $isRangeRequest = $request->hasHeader('Range');
        $playerState = $request->header('X-Player-State', 'unknown');
        $userAgent = $request->userAgent();

        // Set streaming-optimized headers
        $response->headers->set('X-Accel-Buffering', 'no'); // Nginx: disable buffering
        $response->headers->set('X-Sendfile-Type', 'X-Accel-Redirect'); // Enable sendfile

        // Connection optimization
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('Keep-Alive', 'timeout=300, max=100');

        // Prevent proxy caching for range requests
        if ($isRangeRequest) {
            $response->headers->set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            $response->headers->set('Pragma', 'no-cache');
        }

        // Mobile optimization
        if ($this->isMobileDevice($userAgent)) {
            $response->headers->set('X-Mobile-Optimized', 'true');
            $response->headers->set('Cache-Control', 'public, max-age=1800'); // 30 min for mobile
        }

        // Smart caching based on player state
        if ($playerState === 'paused') {
            $response->headers->set('X-Stream-Priority', 'low');
        } elseif ($playerState === 'playing') {
            $response->headers->set('X-Stream-Priority', 'high');
        }

        // Add performance monitoring headers
        $response->headers->set('X-Stream-Optimized', 'true');
        $response->headers->set('X-Optimization-Level', 'maximum');
        $response->headers->set('X-Server-Timing', 'streaming=0'); // Will be updated by actual timing
    }

    /**
     * Detect mobile devices for optimization
     */
    private function isMobileDevice(string $userAgent): bool
    {
        $mobileKeywords = [
            'Mobile',
            'Android',
            'iPhone',
            'iPad',
            'iPod',
            'BlackBerry',
            'Windows Phone',
            'Opera Mini'
        ];

        foreach ($mobileKeywords as $keyword) {
            if (stripos($userAgent, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }
}
