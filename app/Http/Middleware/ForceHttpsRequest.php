<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceHttpsRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->server->set('HTTPS', 'on'); // ⬅️ Force HTTPS
        $request->server->set('HTTP_X_FORWARDED_PROTO', 'https'); // ⬅️ Ensure header exists

        return $next($request);
    }
}
