<?php

declare(strict_types=1);

namespace App\Domains\Clients\Data;

use Spatie\LaravelData\Data;

class ClientFormData extends Data
{
    public function __construct(
        readonly public string $name,
        readonly public int $phoneNumber,
        readonly public string $email,
        readonly public string $address,
    ) {}
}
