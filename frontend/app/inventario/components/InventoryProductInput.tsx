// app/inventario/components/InventoryProductInput.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/select-input";
import { TextInput } from "@/components/text-input";
import { AiOutlineCamera } from "react-icons/ai";

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
                <TextInput
                  label="Código de Barras"
                  placeholder="Ingresar código manualmente"
                  value={productoQuery}
                  onChange={(val) => onFormChange("productoQuery", val)}
                />

                {filteredProductos.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredProductos.map((prod) => (
                      <li
                        key={prod.idproducto}
                        className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                        onClick={() => onProductoSelect(prod)}
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
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="relative">
                <TextInput
                  label={
                    tipoCode === "descripcion"
                      ? "Descripción"
                      : "Código Interno"
                  }
                  placeholder={
                    tipoCode === "descripcion"
                      ? "Buscar por descripción"
                      : "Buscar por código interno"
                  }
                  value={productoQuery}
                  onChange={(val) => onFormChange("productoQuery", val)}
                />

                {filteredProductos.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredProductos.map((prod) => (
                      <li
                        key={prod.idproducto}
                        className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                        onClick={() => onProductoSelect(prod)}
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
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fila de Cantidad e Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <TextInput
            label="Cantidad"
            type="number"
            placeholder="0"
            value={cantidad}
            onChange={(val) => onFormChange("cantidad", val)}
          />
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
              onClick={onAgregarProducto}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-xs sm:text-sm"
            >
              Ingresar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
