<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lorisleiva\Actions\Concerns\AsAction;

class ShowResetPasswordFormAction
{
    use AsAction;

    public function handle(Request $request): Response
    {
        return Inertia::render('auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function asController(Request $request): Response
    {
        return $this->handle($request);
    }
}
