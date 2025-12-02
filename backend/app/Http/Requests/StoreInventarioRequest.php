<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Permitimos que cualquiera use este endpoint por ahora
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'productos' => 'required|array|min:1',
            'productos.*.idproducto' => 'required|integer',
            'productos.*.cantidad' => 'required|numeric|min:0',
            'productos.*.punit' => 'required|numeric|min:0',
            'productos.*.importe' => 'required|numeric|min:0',
            'productos.*.descripcion' => 'nullable|string',
            'idSucursal' => 'required|integer', // Verifica si existe en tu tabla sucursales: |exists:sucursales,idsuci
            'observac' => 'nullable|string'
        ];
    }

}
