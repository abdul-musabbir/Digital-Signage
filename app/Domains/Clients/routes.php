<?php

declare(strict_types=1);

use App\Domains\Clients\Actions\CreateClient;
use App\Domains\Clients\Actions\DeleteClient;
use App\Domains\Clients\Actions\UpdateClient;
use App\Domains\Clients\Pages\ManageClientsPage;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])
    ->prefix('/dashboard/clients')
    ->group(function () {

        Route::get('/', ManageClientsPage::class);

        //
        Route::post('/store', CreateClient::class);

        //
        Route::put('/update/{client}', UpdateClient::class);

        // delete client
        Route::delete('/destroy/{client}', DeleteClient::class);
    });
