<?php

namespace App\Http\Controllers;

use App\Models\DetalleInventario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\ListaPrecio;
use App\Models\Sucursal;
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
            'DesCortaD')
            ->limit(100)->get();

        return response()->json($detalle);
    }
    public function guardar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'idproducto' => 'required|integer',
            'cantidad' => 'required|numeric|min:1',
            'idSucursal' => 'required|integer',
            'idinv_det' => 'nullable|integer' // opcional, si ya existe
        ]);

        $sucursal = Sucursal::find($validated['idSucursal']);
        if (!$sucursal) {
            return response()->json(['error' => 'Sucursal no encontrada'], 404);
        }

        $precioInfo = ListaPrecio::where('idlistas', $sucursal->idlistaprecio)
            ->where('idproductos', $validated['idproducto'])
            ->first();

        if (!$precioInfo) {
            return response()->json(['error' => 'No se encontró precio para el producto en esta lista'], 404);
        }

        // Determinar idinv_det
        $idinv_det = $validated['idinv_det'] ?? (DetalleInventario::max('idinv_det') + 1 ?? 1);

        $importe = $validated['cantidad'] * $precioInfo->precio;

        $detalle = DetalleInventario::create([
            'idinv_det' => $idinv_det,
            'idprod_i' => $validated['idproducto'],
            'cant' => $validated['cantidad'],
            'punit' => $precioInfo->precio,
            'importe' => $importe,
            'porcdesc' => 0,
            'DesCortaD' => $precioInfo->producto->DesCorta ?? null,
        ]);

        return response()->json([
            'message' => 'Producto agregado correctamente',
            'detalle' => $detalle,
            'idinv_det' => $idinv_det // retornamos para que el front lo use en la siguiente carga
        ]);
    }
}
