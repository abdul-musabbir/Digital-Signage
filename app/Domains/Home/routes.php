<?php

declare(strict_types=1);

use App\Domains\Home\Actions\Create;
use Illuminate\Support\Facades\Route;

Route::post('/create', Create::class);
