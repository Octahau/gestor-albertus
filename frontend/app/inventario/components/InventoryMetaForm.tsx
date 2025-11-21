"use client";

import { Card } from "@/components/ui/card";
import { TextInput } from "@/components/text-input";
import { useState, useEffect, useRef } from "react";

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
  const [highlightIndex, setHighlightIndex] = useState(0);
  
  // Ref para hacer scroll automático si la lista es muy larga
  const listRef = useRef<HTMLUListElement>(null);

  // Resetear el índice a 0 cuando cambie la lista de resultados
  useEffect(() => {
    setHighlightIndex(0);
  }, [sucursalesList]);

  // Efecto para mantener el scroll visible cuando navegas con flechas
  useEffect(() => {
    if (listRef.current && sucursalesList.length > 0) {
      const activeItem = listRef.current.children[highlightIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex, sucursalesList.length]);

  // --- Función auxiliar para seleccionar y mover el foco ---
  const selectAndFocus = (suc: Sucursal) => {
    // 1. Ejecutar la lógica de selección original
    onSucursalSelect(suc);
    
    // 2. Mover el foco al input de productos
    // Usamos setTimeout para asegurar que el DOM esté listo
    setTimeout(() => {
      const productInput = document.getElementById("inventory-product-input");
      if (productInput) {
        productInput.focus();
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Si no hay lista, no hacemos nada
    if (!sucursalesList.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 < sucursalesList.length ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case "Enter":
        e.preventDefault();
        const selected = sucursalesList[highlightIndex];
        if (selected) {
          selectAndFocus(selected);
        }
        break;

      case "Escape":
        setHighlightIndex(0);
        break;
    }
  };

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
            onKeyDown={handleKeyDown} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Lista desplegable de coincidencias */}
          {sucursalQuery.length > 0 && sucursalesList.length > 0 && (
            <ul 
                ref={listRef}
                className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto"
            >
              {sucursalesList.map((suc, index) => {
                const isHighlighted = index === highlightIndex;
                
                return (
                  <li
                    key={suc.idSUCURSALES}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      isHighlighted ? "bg-yellow-200" : "hover:bg-yellow-100"
                    }`}
                    onClick={() => selectAndFocus(suc)}
                    onMouseEnter={() => setHighlightIndex(index)}
                  >
                    <div className="font-semibold text-black">{suc.NOMBRE}</div>
                    <div className="text-xs text-gray-600">
                      {suc.DIRECCION}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}