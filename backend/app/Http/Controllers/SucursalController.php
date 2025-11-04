<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Sucursal;

class SucursalController extends Controller
{
    public function index(): JsonResponse
    {
        // Trae solo los campos idproducto, articulo y codbarra
        $sucursales = Sucursal::select(
            'idSUCURSALES',
            'NOMBRE' ,
            'DIRECCION' ,        
            'idlistaprecio',
            )->get();

        return response()->json($sucursales);
    }
    public function filtrar(Request $request): JsonResponse
    {
        $query = $request->query(key: 'query'); // obtenemos el texto ingresado
        if (!$query) {
            return response()->json(data: []); // si no hay query, devolvemos lista vacía
        }

        // Buscamos coincidencias en el nombre
        $sucursales = Sucursal::where('NOMBRE', 'LIKE', "%{$query}%")
                ->get(['idSUCURSALES', 'NOMBRE', 'idlistaprecio']);
        return response()->json(data: $sucursales);
    }

}
