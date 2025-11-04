"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectInput } from "@/components/select-input";
import { TextInput } from "@/components/text-input";
import api from "@/lib/axiosInstance";
import InventoryTable from "@/components/inventory-table";
import { AiOutlineCamera } from "react-icons/ai";

interface ProductItem {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}

export default function InventoryPage() {
  const [productoOrigen, setProductoOrigen] = useState("");
  const [operacion, setOperacion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [sucursal, setSucursal] = useState("");
  const [tipoCode, setTipoCode] = useState("codigo");
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioVenta, setPrecioVenta] = useState("0.00");
  const [importe, setImporte] = useState("0.00");
  const [iva, setIva] = useState("0.0");
  const [porc, setPorc] = useState("0.0");
  const [productos, setProductos] = useState<ProductItem[]>([]);
  const [observacion, setObservacion] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const total = productos.reduce((sum, item) => sum + item.importe, 0);

  const handleAgregarProducto = async () => {
    if (!codigo || !cantidad) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      const nuevoProducto: ProductItem = {
        id: `${Date.now()}`,
        codigo,
        descripcion: `Producto ${codigo}`,
        cantidad: Number.parseFloat(cantidad),
        precioUnitario: Number.parseFloat(precioVenta),
        importe: Number.parseFloat(cantidad) * Number.parseFloat(precioVenta),
      };

      setProductos([...productos, nuevoProducto]);
      setCodigo("");
      setCantidad("");
      setPrecioVenta("0.00");
    } catch (error) {
      console.error("Error agregando producto:", error);
    }
  };

  const handleEliminarProducto = (id: string) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const handleLimpiarCampos = () => {
    setProductoOrigen("");
    setOperacion("");
    setSucursal("");
    setCodigo("");
    setCantidad("");
    setPrecioVenta("0.00");
    setProductos([]);
    setObservacion("");
  };

  const handleGuardarDatos = async () => {
    try {
      const data = {
        productoOrigen,
        operacion,
        fecha,
        sucursal,
        productos,
        observacion,
        total,
      };

      await api.post("/inventario", data);
      alert("Datos guardados exitosamente");
      handleLimpiarCampos();
    } catch (error) {
      console.error("Error guardando datos:", error);
      alert("Error al guardar los datos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
          Carga de Inventario Móvil
        </h1>
        <p className="text-xs sm:text-sm text-yellow-600 mb-4 sm:mb-6 font-semibold">
          Sistema de Gestión de Inventario
        </p>

        {/* Section 1: Dropdowns - Responsive grid 1 col mobile, 2 cols tablet/desktop */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <SelectInput
              label="Productos de"
              placeholder="Selecciona origen"
              options={[
                { value: "panaderia", label: "PANADERÍA" },
                { value: "reventa", label: "REVENTA" },
              ]}
              value={productoOrigen}
              onChange={setProductoOrigen}
            />
            <SelectInput
              label="Operación"
              placeholder="Selecciona operación"
              options={[
                { value: "inventario", label: "INVENTARIO" },
                { value: "DEVOLUCION", label: "DEVOLUCION" },
              ]}
              value={operacion}
              onChange={setOperacion}
            />
          </div>
        </Card>

        {/* Section 2: Date and Sucursal - Responsive grid 1 col mobile, 2 cols desktop */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <TextInput
              label="Fecha"
              type="date"
              value={fecha}
              onChange={setFecha}
            />
            <TextInput
              label="Sucursal"
              placeholder="Ingresa sucursal"
              value={sucursal}
              onChange={setSucursal}
            />
          </div>
        </Card>

        {/* Section 3: Product Input - Fully responsive product entry section */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
          <div className="space-y-3 sm:space-y-4">
            {/* Type and Code Row - 1 col mobile, 2 cols tablet, 3 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <SelectInput
                label="Tipo de Código"
                placeholder="Selecciona tipo"
                options={[
                  { value: "codigo", label: "Código de Barras" },
                  { value: "sku", label: "Descripcion" },
                  { value: "interno", label: "Código" },
                ]}
                value={tipoCode}
                onChange={setTipoCode}
              />

              <div className="sm:col-span-2">
                {tipoCode === "codigo" ? (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Código
                    </label>
                    <button
                      type="button"
                      className="w-full py-2 px-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-gray-800 rounded-lg text-sm sm:text-base"
                      onClick={() => setShowScanner(true)}
                    >
                      <AiOutlineCamera className="w-5 h-5 mr-2" />
                      Escanear
                    </button>
                  </div>
                ) : (
                  <TextInput
                    label="Código"
                    placeholder="Ingresa código"
                    value={codigo}
                    onChange={setCodigo}
                  />
                )}
              </div>

              {/* Overlay para el escáner */}
              {showScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div id="scanner" className="w-full max-w-md"></div>
                </div>
              )}
            </div>

            {/* Quantity and Product Info Row - 1 col mobile, 2 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <TextInput
                label="Cantidad"
                type="number"
                placeholder="0"
                value={cantidad}
                onChange={setCantidad}
              />
              <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300">
                <p className="text-xs font-medium text-gray-600">
                  Datos del Producto
                </p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-700 mt-2">
                  -
                </p>
              </div>
            </div>

            {/* Price Details Row - Responsive grid stacks on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  P. Venta
                </label>
                <input
                  type="number"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-yellow-100 text-center font-medium text-xs sm:text-sm"
                />
              </div>
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
              <div className="col-span-2 sm:col-span-1 flex items-end">
                <Button
                  onClick={handleAgregarProducto}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-xs sm:text-sm"
                >
                  Ingresar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 4: Products Table - Scrollable table on mobile */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
          <div className="mb-4">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Lista de Productos ({productos.length})
            </h3>
            <InventoryTable
              productos={productos}
              onDelete={handleEliminarProducto}
            />
          </div>
        </Card>

        {/* Section 5: Observations and Total - Responsive grid stacks on mobile */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 border-0 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-end">
            <TextInput
              label="Observación"
              placeholder="Ingresa observaciones"
              value={observacion}
              onChange={setObservacion}
            />
            <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg border-2 border-yellow-300">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-700 mt-1 sm:mt-2">
                {total.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons - Full width buttons on mobile, side by side on larger screens */}
        <Card className="p-3 sm:p-6 border-0 shadow-md">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <Button
              onClick={handleLimpiarCampos}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 sm:py-3 rounded-lg text-xs sm:text-sm"
            >
              Limpiar (F8)
            </Button>
            <Button
              onClick={handleGuardarDatos}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 rounded-lg text-xs sm:text-sm"
            >
              Guardar (F5)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
