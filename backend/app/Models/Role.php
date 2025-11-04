<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    // Si usás Spatie, no hace falta mucho más
    // Solo agregar relaciones personalizadas si tu DB tiene algo especial
}
