"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import InventoryTable from "@/components/inventory-table";
import { AlertMessage } from "@/components/alert-message";

// 1. Importar el hook de lógica
import { useInventory } from "./hooks/useInventory";

// 2. Importar TODOS los nuevos componentes de UI
import { InventoryHeaderForm } from "./components/InventoryHeaderForm";
import { InventoryMetaForm } from "./components/InventoryMetaForm";
import { InventoryProductInput } from "./components/InventoryProductInput";
import { InventorySummary } from "./components/InventorySummary";
import { InventoryActions } from "./components/InventoryActions";
import { ScannerModal } from "./components/ScannerModal";

// 3. Las interfaces ahora deberían estar en un archivo global (ej. lib/definitions.ts)
// y ser importadas por el hook 'useInventory'
// interface ProductItem { ... }
// interface Producto { ... }

export default function InventoryPage() {
  // 4. Obtener toda la lógica de datos y acciones desde el hook
  const { form, search, alert, setAlert, actions } = useInventory();

  // 5. El ÚNICO estado que se queda en la página es el estado de la UI (el modal)
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // 6. Los handlers del modal también se quedan aquí, pero son más simples
  const handleScan = (result: string) => {
    actions.setCodigo(result); // Llama a la acción del hook
    setShowScanner(false);
    setScanError(null);
  };

  const handleError = (errorMsg: string) => {
    console.error(errorMsg);
    setScanError(errorMsg);
  };

  // 7. El JSX ahora es solo un "ensamblador" de componentes
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-50 p-4 sm:p-6">
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
          Carga de Inventario Móvil
        </h1>
        <p className="text-xs sm:text-sm text-yellow-600 mb-4 sm:mb-6 font-semibold">
          Sistema de Gestión de Inventario
        </p>

        {/* Componente 1: Encabezado */}
        <InventoryHeaderForm
          {...({
            productoOrigen: form.productoOrigen,
            operacion: form.operacion,
            onFormChange: actions.handleFormChange,
          } as any)}
        />

        {/* Componente 2: Meta-datos (Fecha y Sucursal) */}
        <InventoryMetaForm
          fecha={form.fecha}
          onFechaChange={(val) => actions.handleFormChange("fecha", val)}
          sucursalQuery={form.sucursal}
          onSucursalChange={(val) => actions.handleFormChange("sucursal", val)}
          sucursalesList={search.filteredSucursales}
          onSucursalSelect={actions.handleSucursalSelect}
        />

        {/* Componente 3: Input de Producto (el más complejo) */}
        <InventoryProductInput
          // Pasamos el estado del formulario y búsqueda
          tipoCode={form.tipoCode}
          productoQuery={form.productoQuery}
          cantidad={form.cantidad}
          precioVenta={form.precioVenta}
          importe={form.importe}
          iva={form.iva}
          porc={form.porc}
          filteredProductos={search.filteredProductos}
          // Pasamos las acciones que necesita
          onFormChange={(field: string, value: string) =>
            // adaptar la firma (field: string) => actions espera keyof InventoryState
            actions.handleFormChange(field as any, value)
          }
          onProductoSelect={actions.handleProductoSelect}
          onAgregarProducto={actions.handleAgregarProducto}
          onShowScanner={() => {
            setShowScanner(true);
            setScanError(null);
          }}
        />

        {/* Componente 4: Tabla de Productos */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
          <div className="mb-4">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Lista de Productos ({form.productos.length})
            </h3>
            <InventoryTable
              productos={form.productos}
              onDelete={actions.handleEliminarProducto}
            />
          </div>
        </Card>

        {/* Componente 5: Resumen (Observación y Total) */}
        <InventorySummary
          observacion={form.observacion}
          onObservacionChange={(val) =>
            actions.handleFormChange("observacion", val)
          }
          total={form.total}
        />

        {/* Componente 6: Botones de Acción */}
        <InventoryActions
          onClear={actions.handleLimpiarCampos}
          onSave={actions.handleGuardarDatos}
        />
      </div>

      {/* Componente 7: El Modal del Escáner */}
      <ScannerModal
        show={showScanner}
        error={scanError}
        onScan={handleScan}
        onError={handleError}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
}
