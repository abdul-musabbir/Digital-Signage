<?php

declare(strict_types=1);

namespace App\Domains\Auth\Actions;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class LogoutAction
{
    use AsAction;

    public function handle(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function asController(Request $request): RedirectResponse
    {
        return $this->handle($request);
    }
}
