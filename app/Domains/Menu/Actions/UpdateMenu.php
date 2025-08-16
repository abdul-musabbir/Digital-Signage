<?php

declare(strict_types=1);

namespace App\Domains\Menu\Actions;

use App\Domains\Menu\Data\UpdateMenuData;
use App\Models\Menu;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use Throwable;

final class UpdateMenu
{
    use AsAction;

    public function rules(): array
    {
        return [
            'title' => ['required', 'min:1'],
        ];
    }

    /**
     * Update the given menu with provided data.
     *
     * @throws ValidationException
     */
    public function handle(UpdateMenuData $data, Menu $menu): void
    {
        try {
            $menu->fill([
                'name' => $data->title,
            ])->save();
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'error' => [__('Unable to update menu: :message', ['message' => $e->getMessage()])],
            ]);
        }
    }
}
