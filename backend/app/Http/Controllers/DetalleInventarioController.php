<?php

namespace App\Http\Controllers;

use App\Models\DetalleInventario;
use App\Models\Inventario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DetalleInventarioController extends Controller
{
    public function index(): JsonResponse
    {
        // Trae solo los campos idproducto, articulo y codbarra
        $detalle = DetalleInventario::select(
            'idsid',
            'idinv_det',
            'idprod_i',
            'cant',
            'punit',
            'importe',
            'porcdesc',
            'DesCortaD'
        )
            ->limit(100)->get();

        $inventario = Inventario::select(
            'idinv',
            'idsuci',
            'fechai',
            'subtotal',
            'comision',
            'totalinv',
            'borra_inv',
            'observac',
            'estado',
            'tipo',
            'operac'
        )
            ->limit(100)->get();

        return response()->json([$detalle, $inventario]);
    }
    public function guardar(Request $request): JsonResponse
    {
        $productos = $request->input('productos', []);

        if (empty($productos)) {
            return response()->json(['error' => 'No hay productos'], 400);
        }

        $idsid = (DetalleInventario::max('idsid') ?? 0) + 1;
        $idinv = (Inventario::max('idinv') ?? 0) + 1;

        $detalles = [];
        foreach ($productos as $p) {
            $detalle = DetalleInventario::create([
                'idsid' => $idsid,
                'idinv_det' => $idinv,
                'idprod_i' => $p['idproducto'] ?? 0,
                'cant' => floatval($p['cantidad'] ?? 0),
                'punit' => floatval($p['punit'] ?? 0),
                'importe' => floatval($p['importe'] ?? 0),
                'porcdesc' => 0,
                'DesCortaD' => $p['descripcion'] ?? null,
            ]);

            $detalles[] = $detalle;
            $idsid++;
        }
        $inventario = Inventario::create([
            'idinv' => $idinv,
            'idsuci' => $request->input('idSucursal', 1),
            'fechai' => now(),
            'subtotal' => array_sum(array_column($productos, 'importe')),
            'comision' => 0,
            'totalinv' => array_sum(array_column($productos, 'importe')),
            'borra_inv' => 0,
            'observac' => $request->input('observacion', ''),
            'estado' => '0',
            'tipo' => 'P',
            'operac' => 'I',
        ]);

        return response()->json([
            'message' => 'Productos guardados correctamente',
            'detalles' => $detalles,
            'idinv_det' => $idinv,
        ]);
    }
}
