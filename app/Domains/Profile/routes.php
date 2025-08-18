<?php

declare(strict_types=1);

use App\Domains\Menu\Actions\DeleteMenu;
use App\Domains\Menu\Actions\UpdateMenu;
use App\Domains\Menu\Actions\UploadFiles;
use App\Domains\Menu\Pages\ManageMenuPage;
use App\Domains\Menu\Pages\View\ManageDynamicPage;
use App\Domains\Profile\Actions\UpdateProfile;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    // Route::middleware(['auth'])
    ->prefix('dashboard/settings')
    ->name('settings.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Profile Management Routes
        |--------------------------------------------------------------------------
        */

        Route::put('/profile/update', UpdateProfile::class);
    });
