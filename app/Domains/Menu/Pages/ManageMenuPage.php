<?php

declare(strict_types=1);

namespace App\Domains\Menu\Pages;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Response;

class ManageMenuPage extends Controller
{
    public function __invoke(): Response
    {
        return inertia('menu/index', [
            'clients' => $this->getClients(),
            'menus' => $this->getMenus(),
        ]);
    }

    protected function getClients(): mixed
    {
        return User::role('customer')
            ->select('id', 'name')
            ->latest()
            ->get()
            ->map(function ($client): array {
                return [
                    'id' => (string) $client->id,
                    'name' => $client->name,
                ];
            })->toBase();
    }

    protected function getMenus()
    {
        return User::select('id', 'name') // only necessary fields
            ->role('customer')
            ->with([
                'menus' => function ($query) {
                    $query->select(
                        'id',
                        'client_id',
                        'name',
                        'type',
                        'local_path',
                        'google_drive_id',
                        'google_drive_url',
                        'mime_type',
                        'size',
                        'thumbnail',
                        'description',
                        'created_at'
                    )->orderBy('name', 'asc'); // ✅ sort menus A→Z
                },
            ])
            ->get()
            ->toArray();
    }
}
