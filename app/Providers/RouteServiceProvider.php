<?php

namespace App\Providers;

use Illuminate\Foundation\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckPermission;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::aliasMiddleware('permission', CheckPermission::class);
    }
}
