<?php

declare(strict_types=1);

use App\Domains\Menu\Actions\UploadFiles;
use App\Domains\Menu\Pages\ManageMenuPage;
use App\Domains\Menu\Pages\View\ManageDynamicPage;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])
    ->prefix('dashboard/menu')
    ->name('menu.')
    ->group(function () {

        // Main menu management page
        Route::get('/', ManageMenuPage::class)->name('index');

        // Video view page
        Route::get('/view/{id}', [ManageDynamicPage::class, 'index'])
            ->name('view')
            ->where('id', '[a-zA-Z0-9_-]{10,50}');

        // File upload
        Route::post('/upload', UploadFiles::class)->name('upload');

        // SUPER FAST PROFESSIONAL STREAMING ENDPOINT
        Route::get('/stream/{id}', [ManageDynamicPage::class, 'stream'])
            ->name('video.stream')
            ->where('id', '[a-zA-Z0-9_-]{10,50}');

        // CORS preflight handler
        Route::options('/stream/{id}', function () {
            return response('', 200, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers' => 'Range, If-Range, Cache-Control, Content-Type',
                'Access-Control-Expose-Headers' => 'Accept-Ranges, Content-Length, Content-Range, Content-Type, Cache-Control',
                'Access-Control-Max-Age' => '86400',
            ]);
        })->where('id', '[a-zA-Z0-9_-]{10,50}');

        // Backward compatibility
        Route::get('/{id}', [ManageDynamicPage::class, 'index'])
            ->name('show')
            ->where('id', '[a-zA-Z0-9_-]{10,50}');
    });
