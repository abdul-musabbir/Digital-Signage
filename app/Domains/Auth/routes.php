<?php

declare(strict_types=1);

use App\Domains\Auth\Actions\ConfirmPasswordAction;
use App\Domains\Auth\Actions\LoginAction;
use App\Domains\Auth\Actions\LogoutAction;
use App\Domains\Auth\Actions\RegisterUserAction;
use App\Domains\Auth\Actions\ResetPasswordAction;
use App\Domains\Auth\Actions\SendEmailVerificationAction;
use App\Domains\Auth\Actions\SendPasswordResetLinkAction;
use App\Domains\Auth\Actions\ShowResetPasswordFormAction;
use App\Domains\Auth\Actions\UpdatePasswordAction;
use App\Domains\Auth\Pages\ManageConfirmPasswordFormPage;
use App\Domains\Auth\Pages\ManageEmailVerificationPromptPage;
use App\Domains\Auth\Pages\ManageForgotPasswordPage;
use App\Domains\Auth\Pages\ManageLoginPage;
use App\Domains\Auth\Pages\ManageRegisterPage;
use App\Domains\Auth\Pages\ManageVerifyEmailPage;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Here are the authentication routes for your application using Laravel
| Actions. These routes are loaded by the RouteServiceProvider within
| a group which contains the "web" middleware group.
|
*/

// Guest routes (unauthenticated users only)
Route::middleware('guest')->group(function () {
    // User Registration
    Route::get('register', ManageRegisterPage::class)
        ->name('register');
    Route::post('register', RegisterUserAction::class);

    // User Login
    Route::get('login', ManageLoginPage::class)
        ->name('login');
    Route::post('login', LoginAction::class);

    // Password Reset Request
    Route::get('forgot-password', ManageForgotPasswordPage::class)
        ->name('password.request');
    Route::post('forgot-password', SendPasswordResetLinkAction::class)
        ->middleware('throttle:6,1')
        ->name('password.email');

    // Password Reset
    Route::get('reset-password/{token}', ShowResetPasswordFormAction::class)
        ->name('password.reset');
    Route::post('reset-password', ResetPasswordAction::class)
        ->name('password.store');
});

// Authenticated routes (authenticated users only)
Route::middleware('auth')->group(function () {
    // Email Verification
    Route::get('verify-email', ManageEmailVerificationPromptPage::class)
        ->name('verification.notice');
    Route::post('email/verification-notification', SendEmailVerificationAction::class)
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Password Confirmation
    Route::get('confirm-password', ManageConfirmPasswordFormPage::class)
        ->name('password.confirm');
    Route::post('confirm-password', ConfirmPasswordAction::class);

    // Password Update
    Route::put('password', UpdatePasswordAction::class)
        ->name('password.update');

    // Logout
    Route::post('logout', LogoutAction::class)
        ->name('logout');
});

// Email Verification (requires signed URL)
Route::middleware(['auth', 'signed', 'throttle:6,1'])->group(function () {
    Route::get('verify-email/{id}/{hash}', ManageVerifyEmailPage::class)
        ->name('verification.verify');
});
