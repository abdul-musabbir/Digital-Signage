<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class VideoStreamingMiddleware
{
    /**
     * Handle an incoming request for video streaming.
     */
    public function handle(Request $request, Closure $next): SymfonyResponse
    {
        // Rate limiting
        if ($this->isRateLimited($request)) {
            return response()->json([
                'error' => 'Too many requests. Please try again later.'
            ], 429);
        }

        // IP whitelist check
        if (!$this->isAllowedIP($request)) {
            return response()->json([
                'error' => 'Access denied from this IP address.'
            ], 403);
        }

        // Validate video ID format
        $videoId = $request->route('id');
        if (!$this->isValidVideoId($videoId)) {
            return response()->json([
                'error' => 'Invalid video ID format.'
            ], 400);
        }

        // Log access if enabled
        if (config('video.security.enable_logging', true)) {
            $this->logAccess($request);
        }

        $response = $next($request);

        // Add CORS headers if enabled
        if (config('video.security.enable_cors', true)) {
            $response = $this->addCorsHeaders($response, $request);
        }

        // Add security headers
        $response = $this->addSecurityHeaders($response);

        // Add performance headers
        $response = $this->addPerformanceHeaders($response, $request);

        return $response;
    }

    /**
     * Check if request is rate limited
     */
    private function isRateLimited(Request $request): bool
    {
        $rateLimit = config('video.security.rate_limit', 60);
        $key = $this->getRateLimitKey($request);

        return RateLimiter::tooManyAttempts($key, $rateLimit);
    }

    /**
     * Get rate limit key for the request
     */
    private function getRateLimitKey(Request $request): string
    {
        return 'video_streaming:' . $request->ip() . ':' . ($request->user()?->id ?? 'guest');
    }

    /**
     * Check if IP is allowed
     */
    private function isAllowedIP(Request $request): bool
    {
        $whitelist = config('video.security.ip_whitelist');

        if (empty($whitelist) || $whitelist === '*') {
            return true;
        }

        $allowedIPs = is_string($whitelist) ? explode(',', $whitelist) : $whitelist;
        $clientIP = $request->ip();

        foreach ($allowedIPs as $allowedIP) {
            if (trim($allowedIP) === $clientIP) {
                return true;
            }

            // Support CIDR notation
            if (str_contains($allowedIP, '/') && $this->ipInRange($clientIP, trim($allowedIP))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if IP is in CIDR range
     */
    private function ipInRange(string $ip, string $range): bool
    {
        [$subnet, $mask] = explode('/', $range);

        return (ip2long($ip) & ~((1 << (32 - $mask)) - 1)) === ip2long($subnet);
    }

    /**
     * Validate video ID format
     */
    private function isValidVideoId(string $videoId): bool
    {
        // Google Drive file IDs are typically alphanumeric with hyphens and underscores
        return preg_match('/^[a-zA-Z0-9_-]{10,}$/', $videoId);
    }

    /**
     * Log video access
     */
    private function logAccess(Request $request): void
    {
        $logData = [
            'video_id' => $request->route('id'),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => $request->user()?->id,
            'timestamp' => now()->toISOString(),
            'range_request' => $request->hasHeader('Range'),
            'range_header' => $request->header('Range'),
        ];

        Log::channel('video_access')->info('Video access', $logData);
    }

    /**
     * Add CORS headers
     */
    private function addCorsHeaders(SymfonyResponse $response, Request $request): SymfonyResponse
    {
        $allowedOrigins = config('video.security.cors_origins', '*');
        $origin = $request->header('Origin');

        if ($allowedOrigins === '*') {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        } elseif ($origin && in_array($origin, explode(',', $allowedOrigins))) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
        $response->headers->set('Access-Control-Max-Age', '3600');

        return $response;
    }

    /**
     * Add security headers
     */
    private function addSecurityHeaders(SymfonyResponse $response): SymfonyResponse
    {
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy for video content
        $csp = "default-src 'self'; media-src 'self' data: blob:; style-src 'self' 'unsafe-inline';";
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }

    /**
     * Add performance headers
     */
    private function addPerformanceHeaders(SymfonyResponse $response, Request $request): SymfonyResponse
    {
        // Enable compression for metadata responses
        if (
            config('video.performance.enable_compression', true) &&
            !str_contains($request->getRequestUri(), '/stream')
        ) {
            $response->headers->set('Vary', 'Accept-Encoding');
        }

        // Add ETag for caching
        if ($response instanceof Response && $response->getContent()) {
            $etag = md5($response->getContent());
            $response->headers->set('ETag', '"' . $etag . '"');

            // Check if client has cached version
            if ($request->header('If-None-Match') === '"' . $etag . '"') {
                return response('', 304)->withHeaders($response->headers->all());
            }
        }

        return $response;
    }

    /**
     * Handle preflight OPTIONS requests
     */
    public function handleOptions(Request $request): SymfonyResponse
    {
        $response = response('', 200);

        if (config('video.security.enable_cors', true)) {
            $response = $this->addCorsHeaders($response, $request);
        }

        return $response;
    }
}
