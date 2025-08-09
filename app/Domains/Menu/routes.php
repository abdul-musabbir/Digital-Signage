<?php

declare(strict_types=1);

use App\Domains\Menu\Actions\DeleteMenu;
use App\Domains\Menu\Actions\UploadFiles;
use App\Domains\Menu\Pages\ManageMenuPage;
use App\Domains\Menu\Pages\View\ManageDynamicPage;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'optimize.video'])
    ->prefix('dashboard/menu')
    ->name('menu.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Menu Management Routes
        |--------------------------------------------------------------------------
        */

        // Main Menu Page - instant load
        Route::get('/', ManageMenuPage::class)
            ->name('index')
            ->middleware('prevent.duplicate');

        // Video View Page - ZERO reload protection
        Route::get('/{menu:google_drive_id}', [ManageDynamicPage::class, 'index'])
            ->name('view')
            ->middleware(['prevent.duplicate', 'throttle:60,1']);

        /*
        |--------------------------------------------------------------------------
        | Video Streaming Routes
        |--------------------------------------------------------------------------
        */

        // Ultra-fast streaming endpoint
        Route::get('/stream/{menu:google_drive_id}', [ManageDynamicPage::class, 'stream'])
            ->name('stream');

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

        /*
        |--------------------------------------------------------------------------
        | File Management Routes
        |--------------------------------------------------------------------------
        */

        // File upload
        Route::post('/upload', UploadFiles::class)
            ->name('upload')
            ->middleware('prevent.duplicate');

        // Delete menu
        Route::delete('/destroy/{menu}', DeleteMenu::class)
            ->name('destroy');
    });
