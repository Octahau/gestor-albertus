<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $connection = 'mysql_segunda';
    protected $table = 'sucu_invent'; // opcional si el nombre ya coincide
    protected $primaryKey = 'idinv'; // si tu PK no es "id"
    public $incrementing = false; // si tu PK no es auto-increment
    public $timestamps = false; // si la tabla no tiene created_at/updated_at

    protected $fillable = [
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
    ];
}
