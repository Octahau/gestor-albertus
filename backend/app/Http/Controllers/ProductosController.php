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
        $tipo = $request->query('tipo'); // tipo de búsqueda (codigo, descripcion, interno)

        if (!$query || !$idSucursal) {
            return response()->json([]);
        }

        // Buscamos la sucursal
        $sucursal = Sucursal::find($idSucursal);
        if (!$sucursal) {
            return response()->json(['error' => 'Sucursal no encontrada'], 404);
        }

        $idLista = $sucursal->idlistaprecio;
        if (!$idLista) {
            return response()->json(['error' => 'La sucursal no tiene lista de precios asociada'], 404);
        }

        // Determinar campo de búsqueda según el tipo seleccionado
        $campo = match ($tipo) {
            'codigo' => 'CodBarra',
            'descripcion' => 'DesCorta',
            'interno' => 'ARTICULO', // o el campo que uses en tu tabla
            default => 'CodBarra',
        };

        // Buscar productos según el campo
        $productos = Productos::where($campo, 'LIKE', "%{$query}%")
            ->get(['idproducto', 'DesCorta', 'CodBarra', 'ARTICULO']);

        // Vincular con su precio e IVA
        $resultado = $productos->map(function ($producto) use ($idLista) {
            $precioInfo = ListaPrecio::where('idlistas', $idLista)
                ->where('idproductos', $producto->idproducto)
                ->first();

            return [
                'idproducto' => $producto->idproducto,
                'descripcion' => $producto->DesCorta,
                'codbarra' => $producto->CodBarra,
                'codinterno' => $producto->ARTICULO ?? null,
                'precio' => $precioInfo->precio ?? null,
                'iva' => $precioInfo->iva ?? null,
            ];
        });

        return response()->json($resultado);
    }

}

