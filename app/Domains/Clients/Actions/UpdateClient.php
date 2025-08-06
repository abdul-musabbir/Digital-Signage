<?php

declare(strict_types=1);

namespace App\Domains\Clients\Actions;

use App\Domains\Clients\Data\ClientFormData;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use Throwable;

class UpdateClient
{
    use AsAction;

    /**
     * Validation rules for updating a client.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phoneNumber' => ['required', 'numeric', 'digits_between:7,15'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore(request()->route('client'))],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Handles the update logic for a client.
     *
     * @throws ValidationException
     */
    public function handle(ClientFormData $data, User $client): void
    {
        try {
            $client->update([
                'name' => $data->name,
                'email' => $data->email,
                'phone' => $data->phoneNumber,
                'address' => $data->address,
            ]);
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }
}
