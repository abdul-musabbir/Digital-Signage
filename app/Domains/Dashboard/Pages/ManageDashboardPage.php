<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\Pages;

class ManageDashboardPage
{
    public function __invoke()
    {
        return inertia('dashboard/index');
    }
}
