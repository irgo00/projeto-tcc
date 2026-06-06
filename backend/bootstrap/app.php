<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\{Exceptions, Middleware};

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        apiPrefix: env('API_PREFIX', 'api'),
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\HttpMethodOverride::class,
        ]);
        $middleware->alias(['auth' => \App\Http\Middleware\Authenticate::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) { })
    ->create();
