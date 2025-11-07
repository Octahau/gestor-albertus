// app/inventario/components/InventoryActions.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  onClear: () => void;
  onSave: () => void;
}

export function InventoryActions({ onClear, onSave }: Props) {
  return (
    <Card className="p-3 sm:p-6 border-0 shadow-md">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Button onClick={onClear} className="bg-gray-500 ...">
          Limpiar (F8)
        </Button>
        <Button onClick={onSave} className="bg-green-500 ...">
          Guardar (F5)
        </Button>
      </div>
    </Card>
  );
}