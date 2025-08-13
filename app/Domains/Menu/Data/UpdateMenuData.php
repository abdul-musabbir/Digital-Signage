<?php

declare(strict_types=1);

namespace App\Domains\Menu\Data;

use Spatie\LaravelData\Data;

class UpdateMenuData extends Data
{
    public function __construct(
        public readonly string $title
    ) {}
}
