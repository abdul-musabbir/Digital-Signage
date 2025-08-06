<?php

declare(strict_types=1);

namespace App\Domains\Clients\Actions;

use App\Domains\Clients\Data\ClientData;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use Throwable;

class CreateClient
{
    use AsAction;

    /**
     * Define validation rules for creating a client.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phoneNumber' => ['required', 'string', 'min:7', 'max:15'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique(User::class, 'email'),
            ],
            'password' => ['required', 'string', 'min:8'],
            'confirmPassword' => ['required', 'same:password'],
            'address' => ['required', 'string', 'max:500'],
        ];
    }

    /**
     * Handle the creation of a client user.
     *
     * @throws ValidationException
     */
    public function handle(ClientData $data): void
    {
        try {
            DB::transaction(function () use ($data): void {
                $user = User::create([
                    'name' => $data->name,
                    'phone' => $data->phoneNumber,
                    'email' => $data->email,
                    'password' => Hash::make($data->password),
                    'address' => $data->address,
                ]);

                $user->assignRole('customer');
            });
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'error' => ['An unexpected error occurred. Please try again later.'],
            ]);
        }
    }
}
