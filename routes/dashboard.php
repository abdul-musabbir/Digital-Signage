<?php

declare(strict_types=1);

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('dashboard/index'))->name('dashboard');

Route::group(['prefix' => '/settings'], function () {
    Route::get('/', fn () => Inertia::render('settings/profile/index'))->name('dashboard.contacts.index');
    Route::get('/account', fn () => Inertia::render('settings/account/index'))->name('dashboard.contacts.accoubt');
    Route::get('/appearance', fn () => Inertia::render('settings/appearance/index'))->name('dashboard.file-manager.index');
    Route::get('/display', fn () => Inertia::render('settings/display/index'))->name('dashboard.notes.index');
    Route::get('/notifications', fn () => Inertia::render('settings/notifications/index'))->name('dashboard.scrumboard.index');
    Route::get('/profile', fn () => Inertia::render('settings/profile/index'))->name('dashboard.todo.index');
});

Route::get('/apps', fn () => Inertia::render('apps/index'))->name('dashboard.apps');

// Route::get('/clients', fn () => Inertia::render('clients/index'))->name('dashboard.clients');

Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
Route::get('/help-center', fn () => Inertia::render('coming-soon/index'))->name('dashboard.coming-soon');
