<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use App\Domains\Auth\Data\LoginData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class LoginAction
{
    use AsAction;

    public function handle(LoginData $loginData): RedirectResponse
    {
        $credentials = [
            'email' => $loginData->email,
            'password' => $loginData->password,
        ];

        if (! Auth::attempt($credentials, $loginData->remember)) {
            $validator = validator([], []);
            $validator->errors()->add('email', __('auth.failed'));

            throw new ValidationException($validator);
        }

        request()->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
