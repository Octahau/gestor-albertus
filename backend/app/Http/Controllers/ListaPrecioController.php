<?php

namespace App\Http\Controllers;

use App\Models\ListaPrecio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
class ListaPrecioController extends Controller
{
    public function index(): JsonResponse
    {
        // Trae solo los campos idproducto, articulo y codbarra
        $productos = ListaPrecio::select(
            'idRLiPr',
            'idproductos',
            'idlistas',
            'precio',
            'iva',
            'OBS',
            'minimo', 
            'EmplMinimo')->get();

        return response()->json($productos);
    }
}
