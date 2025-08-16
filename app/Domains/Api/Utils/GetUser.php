<?php

declare(strict_types=1);

namespace App\Domains\Api\Utils;

use App\Models\User;
use Illuminate\Http\Request;

class GetUser
{
    public function __invoke(Request $request): User
    {
        return $request->user();
    }
}
