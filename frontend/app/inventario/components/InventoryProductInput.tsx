"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/select-input";
import { useState, useEffect, useRef } from "react";

// Tipos que este componente necesita
interface Producto {
  idproducto: number;
  descripcion: string;
  codbarra: string;
  precio?: string | null;
  iva: string | null;
  codinterno?: string | null;
}

interface Props {
  // Estado
  tipoCode: string;
  productoQuery: string;
  cantidad: string;
  precioVenta: string;
  importe: string;
  iva: string;
  porc: string;
  filteredProductos: Producto[];

  // Handlers
  onFormChange: (field: string, value: string) => void;
  onProductoSelect: (prod: Producto) => void;
  onAgregarProducto: () => void;
  onShowScanner: () => void;
}

export function InventoryProductInput({
  tipoCode,
  productoQuery,
  cantidad,
  precioVenta,
  importe,
  iva,
  porc,
  filteredProductos,
  onFormChange,
  onProductoSelect,
  onAgregarProducto,
  onShowScanner,
}: Props) {
  // --- Lógica de navegación por teclado ---
  const [highlightIndex, setHighlightIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // 1. Resetear índice cuando cambia la lista
  useEffect(() => {
    setHighlightIndex(0);
  }, [filteredProductos]);

  // 2. Auto-scroll cuando cambia el índice seleccionado
  useEffect(() => {
    if (listRef.current && filteredProductos.length > 0) {
      const activeItem = listRef.current.children[highlightIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex, filteredProductos.length]);

  // --- NUEVA FUNCIÓN: Seleccionar producto y saltar a cantidad ---
  const selectAndFocusQuantity = (prod: Producto) => {
    onProductoSelect(prod);
    // Damos un pequeño respiro para que React actualice el estado y el input exista
    setTimeout(() => {
      const qtyInput = document.getElementById("inventory-quantity-input");
      if (qtyInput) {
        qtyInput.focus();
        // Opcional: selecciona el contenido por si quieres sobrescribir inmediatamente
        (qtyInput as HTMLInputElement).select();
      }
    }, 50);
  };

  // --- NUEVO HANDLER: Enter en cantidad salta al botón ---
  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const btn = document.getElementById("inventory-add-button");
      if (btn) {
        btn.focus();
      }
    }
  };

  // 3. Manejador de teclas para la lista de productos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredProductos.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 < filteredProductos.length ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case "Enter":
        e.preventDefault();
        const selected = filteredProductos[highlightIndex];
        if (selected) {
          selectAndFocusQuantity(selected); // <--- Usamos la función de salto
        }
        break;

      case "Escape":
        setHighlightIndex(0);
        break;
    }
  };

  return (
    <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
      <div className="space-y-3 sm:space-y-4">
        {/* Fila de Tipo de Código y Búsqueda */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <SelectInput
            label="Tipo de Código"
            placeholder="Selecciona tipo"
            options={[
              { value: "codigo", label: "Código de Barras" },
              { value: "descripcion", label: "Descripción" },
              { value: "interno", label: "Código Interno" },
            ]}
            value={tipoCode}
            onChange={(val) => onFormChange("tipoCode", val)}
          />

          <div className="sm:col-span-2">
            {tipoCode === "codigo" ? (
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Código de Barras
                </label>
                {/* Input nativo con ID específico para el foco automático */}
                <input
                  id="inventory-product-input"
                  type="text"
                  placeholder="Ingresar código manualmente"
                  value={productoQuery}
                  onChange={(e) => onFormChange("productoQuery", e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {filteredProductos.length > 0 && (
                  <ul
                    ref={listRef}
                    className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                  >
                    {filteredProductos.map((prod, index) => {
                      const isHighlighted = index === highlightIndex;
                      return (
                        <li
                          key={prod.idproducto}
                          className={`px-3 py-2 cursor-pointer text-sm ${
                            isHighlighted ? "bg-yellow-200" : "hover:bg-yellow-100"
                          }`}
                          onClick={() => selectAndFocusQuantity(prod)} // <--- Click también salta
                          onMouseEnter={() => setHighlightIndex(index)}
                        >
                          <div className="font-semibold text-black">
                            {prod.descripcion}
                          </div>
                          <div className="text-xs text-gray-700">
                            <strong>Cód. Barra:</strong> {prod.codbarra || "-"}
                          </div>
                          <div className="text-xs text-gray-700">
                            <strong>Cód. Interno:</strong>{" "}
                            {prod.codinterno || "-"}
                          </div>
                          <div className="text-xs text-gray-800 font-medium">
                            <strong>Precio:</strong> $
                            {parseFloat(prod.precio || "0").toFixed(2)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {tipoCode === "descripcion"
                    ? "Descripción"
                    : "Código Interno"}
                </label>
                {/* Input nativo con ID específico para el foco automático */}
                <input
                  id="inventory-product-input"
                  type="text"
                  placeholder={
                    tipoCode === "descripcion"
                      ? "Buscar por descripción"
                      : "Buscar por código interno"
                  }
                  value={productoQuery}
                  onChange={(e) => onFormChange("productoQuery", e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {filteredProductos.length > 0 && (
                  <ul
                    ref={listRef}
                    className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                  >
                    {filteredProductos.map((prod, index) => {
                      const isHighlighted = index === highlightIndex;
                      return (
                        <li
                          key={prod.idproducto}
                          className={`px-3 py-2 cursor-pointer text-sm ${
                            isHighlighted ? "bg-yellow-200" : "hover:bg-yellow-100"
                          }`}
                          onClick={() => selectAndFocusQuantity(prod)} // <--- Click también salta
                          onMouseEnter={() => setHighlightIndex(index)}
                        >
                          <div className="font-semibold text-black">
                            {prod.descripcion}
                          </div>
                          <div className="text-xs text-gray-700">
                            <strong>Cód. Interno:</strong>{" "}
                            {prod.codinterno || "-"}
                          </div>
                          <div className="text-xs text-gray-700">
                            <strong>Cód. Barra:</strong> {prod.codbarra || "-"}
                          </div>
                          <div className="text-xs text-gray-800 font-medium">
                            <strong>Precio:</strong> $
                            {parseFloat(prod.precio || "0").toFixed(2)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fila de Cantidad e Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {/* Reemplazo de TextInput por input nativo para controlar el foco y eventos */}
          <div className="space-y-2">
             <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
             <input
                id="inventory-quantity-input" // <--- ID para recibir el foco
                type="number"
                placeholder="0"
                value={cantidad}
                onChange={(e) => onFormChange("cantidad", e.target.value)}
                onKeyDown={handleQuantityKeyDown} // <--- Detectar Enter
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>

          <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300">
            <p className="text-xs font-medium text-gray-600">
              Datos del Producto
            </p>
            <p className="text-lg sm:text-2xl font-bold text-yellow-700 mt-2 truncate">
              {productoQuery || "-"}
            </p>
          </div>
        </div>

        {/* Fila de Precios e Ingreso */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* P. Venta */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              P. Venta
            </label>
            <input
              type="number"
              value={precioVenta}
              onChange={(e) => onFormChange("precioVenta", e.target.value)}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-yellow-100 text-center font-medium text-xs sm:text-sm"
              readOnly
            />
          </div>
          {/* Importe */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Importe
            </label>
            <input
              type="number"
              value={importe}
              readOnly
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-yellow-100 text-center font-medium text-xs sm:text-sm"
            />
          </div>
          {/* IVA */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              IVA
            </label>
            <input
              type="number"
              value={iva}
              readOnly
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-center text-xs sm:text-sm"
            />
          </div>
          {/* Porc */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Porc
            </label>
            <input
              type="number"
              value={porc}
              readOnly
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-center text-xs sm:text-sm"
            />
          </div>
          {/* Botón Ingresar */}
          <div className="col-span-2 sm:col-span-1 flex items-end">
            <Button
              id="inventory-add-button" // <--- ID para recibir el foco final
              onClick={onAgregarProducto}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ingresar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}