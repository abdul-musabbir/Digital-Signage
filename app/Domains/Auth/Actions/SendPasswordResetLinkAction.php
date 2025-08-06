<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use App\Domains\Auth\Data\ForgotPasswordData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class SendPasswordResetLinkAction
{
    use AsAction;

    public function handle(ForgotPasswordData $forgotPasswordData): RedirectResponse
    {
        // Send the password reset link to the user
        $status = Password::sendResetLink(
            $forgotPasswordData->toArray()
        );

        // If the reset link was successfully sent, return with status
        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        // If there was an error, throw validation exception
        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function asController(ForgotPasswordData $forgotPasswordData): RedirectResponse
    {
        return $this->handle($forgotPasswordData);
    }
}
