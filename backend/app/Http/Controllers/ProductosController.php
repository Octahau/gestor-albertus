<?php

namespace App\Http\Controllers;

use App\Models\Productos;
use App\Models\ListaPrecio;
use App\Models\Sucursal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Repositories\ProductRepository;

class ProductosController extends Controller
{
    protected $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }
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

        $resultados = $this->productRepository->searchWithPrice($idLista, $campo, $query);

        return response()->json($resultados);
    }
}
