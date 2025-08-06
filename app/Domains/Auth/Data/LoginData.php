<?php

declare(strict_types=1);

namespace App\Domains\Auth\Data;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class LoginData extends Data
{
    public function __construct(
        // #[Required, Email]
        public string $email,

        // #[Required, Min(8)]
        public string $password,

        public bool $remember = false,
    ) {}
}
