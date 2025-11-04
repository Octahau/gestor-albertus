<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use function Dom\import_simplexml;

class DetalleInventario extends Model
{
    protected $connection = 'mysql_segunda';
    protected $table = 'sucu_invent_det'; // opcional si el nombre ya coincide
    protected $primaryKey = 'idsid'; // si tu PK no es "id"
    public $incrementing = false; // si tu PK no es auto-increment
    public $timestamps = false; // si la tabla no tiene created_at/updated_at

    protected $fillable = [
        'idsid',
        'idinv_det',
        'idprod_i',
        'cant',
        'punit',
        'importe',
        'porcdesc',
        'DesCortaD'
    ];
    // Relación con Productos
    public function producto()
    {
        return $this->belongsTo(Productos::class, 'idprod_i', 'idproducto');
    }
}

