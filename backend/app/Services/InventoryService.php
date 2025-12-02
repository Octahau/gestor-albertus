<?php

namespace App\Services;

use App\Models\Inventario;
use App\Models\DetalleInventario;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function createInventory(array $data, array $products)
    {
        return DB::transaction(function () use ($data, $products) {

            // 1. Calculamos IDs (manteniendo tu lógica actual)
            $inventoryId = (Inventario::max('idinv') ?? 0) + 1;
            $detailId = (DetalleInventario::max('idsid') ?? 0) + 1;

            $total = array_sum(array_column($products, 'importe'));

            // 2. Creamos la Cabecera
            $inventory = Inventario::create([
                'idinv' => $inventoryId,
                'idsuci' => $data['idSucursal'], // Ojo aquí, usaremos el nombre que definimos en el Request
                'fechai' => now(),
                'subtotal' => $total,
                'comision' => 0,
                'totalinv' => $total,
                'borra_inv' => 0,
                'observac' => $data['observac'] ?? 'Sin observaciones',
                'estado' => '0',
                'tipo' => 'P',
                'operac' => 'I',
            ]);

            // 3. Creamos los Detalles
            foreach ($products as $p) {
                DetalleInventario::create([
                    'idsid' => $detailId,
                    'idinv_det' => $inventoryId,
                    'idprod_i' => $p['idproducto'],
                    'cant' => floatval($p['cantidad']),
                    'punit' => floatval($p['punit']),
                    'importe' => floatval($p['importe']),
                    'porcdesc' => 0,
                    'DesCortaD' => $p['descripcion'] ?? null,
                ]);

                $detailId++;
            }

            return $inventory;
        });
    }
}
