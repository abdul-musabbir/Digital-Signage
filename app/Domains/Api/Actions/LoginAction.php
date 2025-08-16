<?php

declare(strict_types=1);

namespace App\Domains\Api\Actions;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class LoginAction
{
    use AsAction;

    /**
     * Handle the login action.
     *
     * @param  string  $email
     * @param  string  $password
     */
    public function handle(Request $request): JsonResponse
    {
        // ✅ Correct validation rules
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['required'], // fixed: was 'require'
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check password
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Return user token
        return response()->json([
            'token' => $user->createToken($request->device_name)->plainTextToken,
        ]);
    }
}
