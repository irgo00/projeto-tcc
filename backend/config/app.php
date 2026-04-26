<?php
use Illuminate\Support\Facades\Facade;

return [
    'name' => env('APP_NAME', 'PBTE Backend'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'America/Sao_Paulo',
    'locale' => 'pt_BR',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
    'min_age' => env('MIN_AGE', 13),
    'aliases' => Facade::defaultAliases()->merge([
        'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,
        'File' => Illuminate\Support\Facades\File::class,
    ])->toArray(),
];
