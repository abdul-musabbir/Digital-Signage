<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use App\Domains\Auth\Data\UpdatePasswordData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdatePasswordAction
{
    use AsAction;

    public function handle(UpdatePasswordData $passwordData): RedirectResponse
    {
        $user = Auth::user();

        $user->update([
            'password' => Hash::make($passwordData->password),
        ]);

        return back();
    }

    public function asController(UpdatePasswordData $passwordData): RedirectResponse
    {
        return $this->handle($passwordData);
    }
}
