<?php

declare(strict_types=1);

namespace App\Domains\Auth\Data;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class ConfirmPasswordData extends Data
{
    public function __construct(
        // #[Required, Min(8)]
        public string $password,
    ) {}
}
