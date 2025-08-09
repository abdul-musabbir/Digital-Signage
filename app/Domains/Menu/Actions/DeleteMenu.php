<?php

declare(strict_types=1);

namespace App\Domains\Menu\Actions;

use App\Models\Menu;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use Throwable;

class DeleteMenu
{
    use AsAction;

    public function handle(Menu $menu): void
    {
        try {
            $menu->delete();
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'error' => [$e->getMessage()],
            ]);
        }
    }
}
