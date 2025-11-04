<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListaPrecio extends Model
{
    protected $table = 'rlipr'; // opcional si el nombre ya coincide
    protected $primaryKey = 'idRLiPr'; // si tu PK no es "id"
    public $incrementing = false; // si tu PK no es auto-increment
    public $timestamps = false; // si la tabla no tiene created_at/updated_at

    protected $fillable = [
        'idRLiPr',
        'idproductos',
        'idlistas',
        'precio',
        'iva',
        'OBS',
        'minimo', 
        'EmplMinimo'
        ] ;
    public function producto()
    {
        return $this->belongsTo(Productos::class, 'idproductos', 'idproducto');
    }
}
