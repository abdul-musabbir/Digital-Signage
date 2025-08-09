<?php

declare(strict_types=1);

use App\Domains\Menu\Actions\DeleteMenu;
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

        // File upload
        Route::post('/upload', UploadFiles::class)->name('upload');

        // Backward compatibility
        Route::get('/{menu:google_drive_id}', ManageDynamicPage::class)
            ->name('show')
            ->where('id', '[a-zA-Z0-9_-]{10,50}');

        // delete menu

        Route::delete('/destroy/{menu}', DeleteMenu::class);
    });
