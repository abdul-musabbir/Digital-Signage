<?php

declare(strict_types=1);

namespace App\Domains\Auth\Data;

use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\CurrentPassword;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdatePasswordData extends Data
{
    public function __construct(
        // #[Required, CurrentPassword]
        public string $current_password,

        // #[Required, Rule(Password::defaults()), Confirmed]
        public string $password,

        // #[Required]
        public string $password_confirmation,
    ) {}
}
