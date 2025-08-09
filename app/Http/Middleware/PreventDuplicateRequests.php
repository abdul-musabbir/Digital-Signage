<?php

declare(strict_types=1);

// 1. CREATE MIDDLEWARE
// Run: php artisan make:middleware PreventDuplicateRequests

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class PreventDuplicateRequests
{
    /**
     * Handle an incoming request - SUPER FAST duplicate prevention
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Create unique key for this request
        $key = 'req_lock_'.md5(
            $request->fullUrl().
                $request->ip().
                ($request->user()->id ?? 'guest')
        );

        // Check if request is already processing
        if (Cache::has($key)) {
            return response()->json([
                'message' => 'Request already processing, please wait...',
                'status' => 'processing',
            ], 429); // Too Many Requests
        }

        // Lock this request for 10 seconds
        Cache::put($key, true, 10);

        try {
            // Process the request
            $response = $next($request);

            // Release lock immediately after success
            Cache::forget($key);

            return $response;
        } catch (\Throwable $e) {
            // Release lock on error too
            Cache::forget($key);
            throw $e;
        }
    }
}
