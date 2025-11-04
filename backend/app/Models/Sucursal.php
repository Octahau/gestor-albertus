<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    protected $table = 'sucursales'; // opcional si el nombre ya coincide
    protected $primaryKey = 'idSUCURSALES'; // si tu PK no es "id"
    public $incrementing = false; // si tu PK no es auto-increment
    public $timestamps = false; // si la tabla no tiene created_at/updated_at

    protected $fillable = [
        'idSUCURSALES',
        'NOMBRE' ,
        'DIRECCION' ,
        'TELEFONO',
        'FacA',
        'FacB' ,
        'CODPOSTAL',
        'idZONA',
        'CbteZ',
        'LiqProd',
        'idpreparador',
        'idrepartidor',
        'idlistaprecio',
        'CUIT',
        'descuento',
        'CELULAR',
        'letra',
        'alias',
    ];

     // Relación con la lista de precios asignada
    public function listaPrecio()
    {
        return $this->belongsTo(ListaPrecio::class, 'idlistaprecio', 'idlistas');
    }

}
