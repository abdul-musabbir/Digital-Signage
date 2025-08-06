<?php

declare(strict_types=1);

namespace App\Domains\Clients\Pages;

use App\Helpers\QueryBuilderHelper;
use App\Models\User;
use Inertia\Response;

class ManageClientsPage
{
    public function __invoke(): Response
    {
        return inertia('clients/index', [
            'clients' => $this->getClients(request()),
        ]);
    }

    protected function getClients($request): array
    {
        $query = User::query()
            ->role('customer');

        QueryBuilderHelper::apply(
            $query,
            $request,
            searchable: ['name'],
            filterable: ['role'],
            sortable: ['created_at', 'updated_at']
        );

        $clients = $query
            ->with('roles')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString()
            ->through(function (User $client) {
                $role = $client->roles->first();

                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'phoneNumber' => $client->phone,
                    'email' => $client->email,
                    'address' => $client->address,
                    'role' => $role?->name,
                ];
            });

        return [
            'paginatedResults' => $clients,
            'activeFilters' => QueryBuilderHelper::getFilters($request),
        ];
    }
}
