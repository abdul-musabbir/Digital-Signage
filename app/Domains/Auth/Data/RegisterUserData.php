<?php

declare(strict_types=1);

namespace App\Domains\Auth\Data;

use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class RegisterUserData extends Data
{
    public function __construct(
        // #[Required, StringType, Max(255)]
        public string $name,

        // #[Required, StringType, Email, Max(255), Unique(User::class)]
        public string $email,

        // #[Required, Confirmed, Rule(Password::defaults())]
        public string $password,

        // #[Required]
        public string $password_confirmation,
    ) {}
}
