<?php

declare(strict_types=1);

namespace App\Domains\Auth\Pages;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class ManageLoginPage
{
    public function __invoke(): Response
    {
        return Inertia::render('auth/sign-in/index', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }
}
