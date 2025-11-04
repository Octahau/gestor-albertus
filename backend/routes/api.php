<?php

use App\Http\Controllers\ProductosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\DetalleInventarioController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Ruta para obtener usuarios
Route::get('/usuario', action: [UserController::class, 'index']);
// Ruta para login
Route::post('/login', [UserController::class, 'login']);


// Ruta para filtrar sucursales
Route::get('/sucursales', [SucursalController::class, 'filtrar']);

// Ruta para filtrar productos
Route::get('/productos/filtrar', [ProductosController::class, 'filtrar']);

//Ruta para cargar los productos
Route::post('/detalle-inventario', [DetalleInventarioController::class, 'guardar']);
