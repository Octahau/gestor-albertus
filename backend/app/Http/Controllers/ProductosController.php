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
        $query = $request->query('query');
        $idSucursal = $request->query('idSucursal');
        $tipo = $request->query('tipo');

        if (!$query || !$idSucursal) {
            return response()->json([]);
        }

        // 1. Buscamos la sucursal y su lista de precios
        $sucursal = Sucursal::find($idSucursal);
        if (!$sucursal) {
            return response()->json(['error' => 'Sucursal no encontrada'], 404);
        }

        $idLista = $sucursal->idlistaprecio;
        if (!$idLista) {
            return response()->json(['error' => 'La sucursal no tiene lista de precios asociada'], 404);
        }

        // 2. Determinar campo de búsqueda
        $campo = match ($tipo) {
            'codigo' => 'CodBarra',
            'descripcion' => 'DesCorta',
            'interno' => 'ARTICULO',
            default => 'CodBarra',
        };

        // 3. Consulta con JOIN (Optimización clave)
        // Unimos la tabla productos con la tabla de precios (rlipr)
        $resultados = Productos::join('rlipr', 'productos.idproducto', '=', 'rlipr.idproductos')
            ->where('rlipr.idlistas', $idLista) // Filtramos por la lista de la sucursal
            ->where('rlipr.precio', '>', 0)      // CONDICIÓN CLAVE: Precio mayor a 0
            ->where("productos.$campo", 'LIKE', "%{$query}%") // Filtro de búsqueda del usuario
            ->select([
                'productos.idproducto',
                'productos.DesCorta as descripcion',
                'productos.CodBarra as codbarra',
                'productos.ARTICULO as codinterno',
                'rlipr.precio',
                'rlipr.iva'
            ])
            ->get();

        return response()->json($resultados);
    }
}
