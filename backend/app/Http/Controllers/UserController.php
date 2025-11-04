<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
class UserController extends Controller
{
    public function index(): JsonResponse
    {
        // Trae solo los campos idproducto, articulo y codbarra
        $usuarios = User::select(
            'iduser',
            'usuario',
            'contra',
            'borra_usu',
            'idemp',
            'nombre',
            'apellido',
            'funcion',
            'segu',
            'clave_auto'
            )->get();

        return response()->json($usuarios);
    }

    public function login(Request $request)
    {
        // Validar datos enviados desde el front
        $request->validate([
            'usuario' => 'required|string',
            'contra' => 'required|string',
        ]);

        // Buscar usuario por nombre
        $user = User::where('usuario', $request->usuario)->first();

        // Si no existe el usuario
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado o nomre incorrecto',
            ], 404);
        }

        // Verificar contraseña (tu campo es texto plano, sin hash)
        if ($user->contra !== $request->contra) {
            return response()->json([
                'success' => false,
                'message' => 'Contraseña incorrecta',
            ], 401);
        }

        // Si todo coincide, devolver éxito
        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'user' => [
                'iduser' => $user->iduser,
                'usuario' => $user->usuario,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'funcion' => $user->funcion,
            ]
        ]);
    }
}
