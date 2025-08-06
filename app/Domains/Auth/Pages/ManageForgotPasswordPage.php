<?php

declare(strict_types=1);

namespace App\Domains\Auth\Pages;

use Inertia\Inertia;
use Inertia\Response;

class ManageForgotPasswordPage
{
    public function __invoke(): Response
    {
        return Inertia::render('auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }
}
