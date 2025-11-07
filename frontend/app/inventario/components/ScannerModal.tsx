// app/inventario/components/ScannerModal.tsx
"use client";

import dynamic from "next/dynamic";

// Carga dinámica del componente BarcodeScanner
// Lo definimos AQUÍ, dentro del modal, para encapsularlo.
const BarcodeScanner = dynamic(
  () => import("@/components/BarcodeScanner"), // Asume que BarcodeScanner.tsx está en components/
  {
    ssr: false,
    loading: () => <p>Cargando escáner...</p>,
  }
);

interface Props {
  show: boolean;
  error: string | null;
  onScan: (result: string) => void;
  onError: (errorMsg: string) => void;
  onClose: () => void;
}

export function ScannerModal({
  show,
  error,
  onScan,
  onError,
  onClose,
}: Props) {
  // Si no se debe mostrar, no renderiza nada.
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg relative">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Apuntar al código
        </h3>

        {/* El escáner solo se renderiza cuando show es true */}
        <BarcodeScanner onScanResult={onScan} onError={onError} />

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <button
          className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          onClick={onClose} // El cleanup del stream lo hace BarcodeScanner.tsx al desmontarse
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}