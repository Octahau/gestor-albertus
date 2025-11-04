<?php

use App\Http\Controllers\DetalleInventarioController;
use App\Http\Controllers\ListaPrecioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductosController;
use App\Http\Controllers\SucursalController;


Route::get('/', function () {
    return view('welcome');
});
Route::get(uri: '/productos', action: [ProductosController::class, 'index']);
Route::get(uri: '/lista-precio', action: [ListaPrecioController::class, 'index']);
Route::get(uri: '/detalle-inventario', action: [DetalleInventarioController::class, 'index']);
//Route::get(uri: '/sucursal', action: [SucursalController::class, 'filtrar']);

