<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use App\Domains\Auth\Data\RegisterUserData;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Lorisleiva\Actions\Concerns\AsAction;

class RegisterUserAction
{
    use AsAction;

    public function handle(RegisterUserData $registerData): RedirectResponse
    {
        // Create the new user
        $user = User::create([
            'name' => $registerData->name,
            'email' => $registerData->email,
            'password' => Hash::make($registerData->password),
        ]);

        // Fire the registered event
        event(new Registered($user));

        // Log the user in
        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    public function asController(RegisterUserData $registerData): RedirectResponse
    {
        return $this->handle($registerData);
    }
}
