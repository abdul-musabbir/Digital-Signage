<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ManageResetPasswordPage
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }
}
