// app/inventario/components/InventoryMetaForm.tsx
"use client";

import { Card } from "@/components/ui/card";
import { TextInput } from "@/components/text-input";

// Tipos que este componente necesita
interface Sucursal {
  idSUCURSALES: string;
  NOMBRE: string;
  DIRECCION: string;
}

interface Props {
  fecha: string;
  onFechaChange: (value: string) => void;
  sucursalQuery: string;
  onSucursalChange: (value: string) => void;
  sucursalesList: Sucursal[];
  onSucursalSelect: (suc: Sucursal) => void;
}

export function InventoryMetaForm({
  fecha,
  onFechaChange,
  sucursalQuery,
  onSucursalChange,
  sucursalesList,
  onSucursalSelect,
}: Props) {
  return (
    <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <TextInput
          label="Fecha"
          type="date"
          value={fecha}
          onChange={onFechaChange}
        />
        
        <div className="relative">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Sucursal
          </label>
          <input
            type="text"
            placeholder="Ingresa sucursal"
            value={sucursalQuery}
            onChange={(e) => onSucursalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
          />

          {/* Lista desplegable de coincidencias */}
          {sucursalQuery.length > 0 && sucursalesList.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {sucursalesList.map((suc) => (
                <li
                  key={suc.idSUCURSALES}
                  className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                  onClick={() => onSucursalSelect(suc)}
                >
                  <div className="font-semibold text-black">{suc.NOMBRE}</div>
                  <div className="text-xs text-gray-600">
                    {suc.DIRECCION}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}