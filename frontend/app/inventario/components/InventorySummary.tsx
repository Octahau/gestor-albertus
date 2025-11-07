// app/inventario/components/InventorySummary.tsx
"use client";

import { Card } from "@/components/ui/card";
import { TextInput } from "@/components/text-input";

interface Props {
  observacion: string;
  onObservacionChange: (value: string) => void;
  total: number;
}

export function InventorySummary({
  observacion,
  onObservacionChange,
  total,
}: Props) {
  return (
    <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-end">
        <TextInput
          label="Observación"
          placeholder="Ingresa observaciones"
          value={observacion}
          onChange={onObservacionChange}
        />
        <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg border-2 border-yellow-300">
          <p className="text-xs font-medium text-gray-600">Total</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-700 mt-1 sm:mt-2">
            {total.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}