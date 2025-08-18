<?php

namespace App\Domains\Profile\Actions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateProfile
{
    use AsAction;

    public function handle(Request $request): void
    {
        dd($request->all());
        // Validate the request
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . Auth::id()
            ],
            'profile_image' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120' // 5MB in KB
            ]
        ]);

        $user = Auth::user();

        if (!$user) {
            throw ValidationException::withMessages([
                'user' => ['User not authenticated.']
            ]);
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old profile image if it exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new profile image
            $imagePath = $request->file('profile_image')->store('profile-images', 'public');
            $user->avatar = $imagePath;
        }

        // Update user email
        $user->email = $validated['email'];

        // Save the changes
        $user->save();
    }
}
