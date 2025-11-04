<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Productos extends Model
{
    protected $table = 'productos'; // opcional si el nombre ya coincide
    protected $primaryKey = 'idproducto'; // si tu PK no es "id"
    public $incrementing = false; // si tu PK no es auto-increment
    public $timestamps = false; // si la tabla no tiene created_at/updated_at

    protected $fillable = [
        'idproducto',
        'ARTICULO', //Cod de barra
        'idMarcas',
        'DESCRIPCION',
        'DESCRIPCION2',
        'idPRESENTACION',
        'PERFIL',
        'UNIDAD_PRODUCCION',
        'PRECIO1',
        'PRECIO2',
        'PRECIO3',
        'PRECIO4',
        'PRECIO5',
        'PRECIO6',
        'baja',
        'LLEVASSTOCK',
        'STOCK',
        'STOCKMINI',
        'STOCKDEP1',
        'STOCKEDEP2',
        'STOCKDEP3',
        'COSTO_COMPRA',
        'id_proveedores',
        'UNIDAD_COMPRA',
        'COSTOUNIDAD',
        'idPERFIL',
        'dumy',
        'DesCorta',
        'CodBarra',
        'idPrGrupos',
        'idGrupoSuma',
        'LisRod',
        'cardinalidad',
        'QuienProduce',
        'iva',

    ];

    public function listasPrecios()
    {
        return $this->hasMany(ListaPrecio::class, 'idproductos', 'idproducto');
    }
    public function detallesInventario()
    {
        return $this->hasMany(DetalleInventario::class, 'idprod_i', 'idproducto');
    }

}
