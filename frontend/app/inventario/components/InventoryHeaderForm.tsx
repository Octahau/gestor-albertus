// app/inventario/components/InventoryHeaderForm.tsx
"use client";

import { Card } from "@/components/ui/card";
import { SelectInput } from "@/components/select-input";

// 1. CAMBIAMOS LA INTERFAZ
// Ya no pasamos un handler genérico, sino uno para cada input.
interface Props {
  productoOrigen: string;
  operacion: string;
  onProductoOrigenChange: (value: string) => void;
  onOperacionChange: (value: string) => void;
}

export function InventoryHeaderForm({
  productoOrigen,
  operacion,
  onProductoOrigenChange,
  onOperacionChange,
}: Props) {
  return (
    <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <SelectInput
          label="Productos de"
          placeholder="Selecciona origen"
          options={[
            { value: "PANADERÍA", label: "PANADERÍA" },
            { value: "REVENTA", label: "REVENTA" },
          ]}
          value={productoOrigen}
          // 2. USAMOS EL HANDLER ESPECÍFICO
          onChange={onProductoOrigenChange}
        />
        <SelectInput
          label="Operación"
          placeholder="Selecciona operación"
          options={[
            { value: "INVENTARIO", label: "INVENTARIO" },
            { value: "DEVOLUCION", label: "DEVOLUCION" },
          ]}
          value={operacion}
          // 3. USAMOS EL HANDLER ESPECÍFICO
          onChange={onOperacionChange}
        />
      </div>
    </Card>
  );
}