<?php

declare(strict_types=1);

namespace App\Domains\Clients\Actions;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use Throwable;

class DeleteClient
{
    use AsAction;

    public function handle(User $client): void
    {
        try {
            $client->delete();
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'error' => ['Failed to delete the client. Please try again later.'],
            ]);
        }
    }
}
