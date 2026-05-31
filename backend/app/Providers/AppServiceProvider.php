<?php
namespace App\Providers;

use App\Models\Rota;
use App\Observers\RotaObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Rota::observe(RotaObserver::class);
    }
}
