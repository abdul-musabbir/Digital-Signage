<?php

declare(strict_types=1);

use App\Domains\Api\Actions\LoginAction;
use App\Domains\Api\Actions\StreamVideo;
use App\Domains\Api\Utils\GetMenus;
use App\Domains\Api\Utils\GetUser;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    // get the user
    Route::get('/user', GetUser::class);

    // get menus
    Route::get('/menus', GetMenus::class);

    // stream video
    Route::get('/stream/{menu:google_drive_id}', StreamVideo::class);

    // CORS preflight for streaming
    Route::options('/stream/{menu:google_drive_id}', function () {
        return response('', 200, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => 'Range, If-Range, Cache-Control, Content-Type',
            'Access-Control-Expose-Headers' => 'Accept-Ranges, Content-Length, Content-Range',
            'Access-Control-Max-Age' => '86400',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    });
});

// login method
Route::post('/login', LoginAction::class);
