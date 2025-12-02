<?php

namespace App\Repositories;

use App\Models\Productos;

class ProductRepository
{
    public function searchWithPrice(int $priceListId, string $field, string $query)
    {
        return Productos::join('rlipr', 'productos.idproducto', '=', 'rlipr.idproductos')
            ->where('rlipr.idlistas', $priceListId)
            ->where('rlipr.precio', '>', 0)
            ->where("productos.$field", "LIKE", "%$query%")
            ->select([
                'productos.idproducto',
                'productos.DesCorta as descripcion',
                'productos.CodBarra as codbarra',
                'productos.ARTICULO as codinterno',
                'rlipr.precio',
                'rlipr.iva',
            ])
            ->get();

    }
}