<?php

declare(strict_types=1);

namespace App\Domains\Auth\Data;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class ForgotPasswordData extends Data
{
    public function __construct(
        // #[Required, Email]
        public string $email,
    ) {}
}
