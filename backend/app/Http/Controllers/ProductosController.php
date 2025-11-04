<?php

namespace App\Http\Controllers;

use App\Models\Productos;
use App\Models\ListaPrecio;
use App\Models\Sucursal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class ProductosController extends Controller
{
    public function index(): JsonResponse
    {
        // Trae solo los campos idproducto, articulo y codbarra
        $productos = Productos::select('idproducto', 'ARTICULO', 'CodBarra')->get();

        return response()->json($productos);
    }

    public function filtrar(Request $request): JsonResponse
{
    $query = $request->query('query'); // texto ingresado por el usuario
    $idSucursal = $request->query('idSucursal'); // la sucursal seleccionada

    if (!$query || !$idSucursal) {
        return response()->json([]);
    }

    // Buscamos la sucursal
    $sucursal = Sucursal::find($idSucursal);

    if (!$sucursal) {
        return response()->json(['error' => 'Sucursal no encontrada'], 404);
    }

    // Obtenemos el id de la lista de precios asociada a la sucursal
    $idLista = $sucursal->idlistaprecio;

    if (!$idLista) {
        return response()->json(['error' => 'La sucursal no tiene lista de precios asociada'], 404);
    }

    // Buscamos productos cuyo código de barra contenga el texto ingresado
    $productos = Productos::where('CodBarra', 'LIKE', "%{$query}%")
        ->get(['idproducto', 'DesCorta', 'CodBarra']);

    // Relacionamos cada producto con su precio e IVA en esa lista
    $resultado = $productos->map(function ($producto) use ($idLista) {
        $precioInfo = ListaPrecio::where('idlistas', $idLista)
            ->where('idproductos', $producto->idproducto)
            ->first();

        return [
            'idproducto' => $producto->idproducto,
            'descripcion' => $producto->DesCorta,
            'codbarra' => $producto->CodBarra,
            'precio' => $precioInfo->precio ?? null,
            'iva' => $precioInfo->iva ?? null,
        ];
    });

    return response()->json($resultado);
}


}

