<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use App\Domains\Auth\Data\ConfirmPasswordData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class ConfirmPasswordAction
{
    use AsAction;

    public function handle(ConfirmPasswordData $passwordData): RedirectResponse
    {
        $user = Auth::user();

        if (! Auth::guard('web')->validate([
            'email' => $user->email,
            'password' => $passwordData->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        request()->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
