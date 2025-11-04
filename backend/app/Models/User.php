<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $connection = 'mysql_tercera'; // Usa la tercera base de datos
    protected $table = 'usuarios';
    protected $primaryKey = 'iduser';
    public $timestamps = false;

    protected $fillable = [
        'iduser',
        'usuario',
        'contra',
        'borra_usu',
        'idemp',
        'nombre',
        'apellido',
        'funcion',
        'segu',
        'clave_auto',
    ];

    /**
     * ⚙️ Laravel usa por defecto "email" como identificador.
     * Le indicamos que queremos usar "usuario" en su lugar.
     */
    public function getAuthIdentifierName()
    {
        return 'usuario';
    }

    /**
     * ⚙️ Le decimos a Laravel cuál es la columna de contraseña.
     */
    public function getAuthPassword()
    {
        return $this->contra;
    }

    // Si querés relaciones adicionales
    public function products()
    {
        return $this->hasMany(Productos::class);
    }
}
