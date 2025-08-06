<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use App\Domains\Auth\Data\ResetPasswordData;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class ResetPasswordAction
{
    use AsAction;

    public function handle(ResetPasswordData $resetData): RedirectResponse
    {
        // Attempt to reset the user's password
        $status = Password::reset(
            $resetData->toArray(),
            function ($user) use ($resetData) {
                $user->forceFill([
                    'password' => Hash::make($resetData->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, redirect to login
        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', __($status));
        }

        // If there was an error, throw validation exception
        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function asController(ResetPasswordData $resetData): RedirectResponse
    {
        return $this->handle($resetData);
    }
}
