<?php

declare(strict_types=1);

namespace App\Domains\Clients\Data;

use Spatie\LaravelData\Data;

class ClientData extends Data
{
    public function __construct(
        readonly public string $name,
        readonly public string $phoneNumber,
        readonly public string $email,
        readonly public string $password,
        readonly public string $confirmPassword,
        readonly public string $address,
    ) {}
}
