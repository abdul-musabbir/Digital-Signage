<?php

declare(strict_types=1);

namespace App\Domains\Auth\Pages;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class ManageEmailVerificationPromptPage
{
    public function __invoke(Request $request): RedirectResponse|Response
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route('dashboard', absolute: false))
            : Inertia::render('auth/VerifyEmail', ['status' => session('status')]);
    }
}
