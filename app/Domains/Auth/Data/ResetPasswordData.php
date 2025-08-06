<?php

declare(strict_types=1);

namespace App\Domains\Auth\Data;

use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class ResetPasswordData extends Data
{
    public function __construct(
        // #[Required]
        public string $token,

        // #[Required, Email]
        public string $email,

        // #[Required, Confirmed, Rule(Password::defaults())]
        public string $password,

        // #[Required]
        public string $password_confirmation,
    ) {}
}
