<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Finder\Finder;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        foreach ($this->domainRouteFile() as $file) {
            Route::middleware(['web'])->group($file->getPathname());
        }
    }

    protected function domainRouteFile(): Finder
    {
        return Finder::create()
            ->in(app_path('Domains'))
            ->name('routes.php')
            ->files();
    }
}
