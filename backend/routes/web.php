<?php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'PBTE Backend API',
        'version' => '1.0',
        'status' => 'running'
    ]);
});
