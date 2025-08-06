<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class SendEmailVerificationAction
{
    use AsAction;

    public function handle(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
