"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectInput } from "@/components/select-input";
import { TextInput } from "@/components/text-input";
import api from "@/lib/axiosInstance";
import InventoryTable from "@/components/inventory-table";
import { AiOutlineCamera } from "react-icons/ai";
import dynamic from "next/dynamic"; // <-- CAMBIO 1: Importar dynamic

// Carga dinámica del componente BarcodeScanner
const BarcodeScanner = dynamic(() => import("@/components/BarcodeScanner"), {
  ssr: false, // ¡Muy importante! Desactiva el renderizado en servidor
  loading: () => <p>Cargando escáner...</p>, // Mensaje de carga
});

interface ProductItem {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}
interface Producto {
  idproducto: number;
  descripcion: string;
  codbarra: string;
  precio?: string | null;
  iva: string | null;
  codinterno?: string | null;
}
export default function InventoryPage() {
  const [productoOrigen, setProductoOrigen] = useState("");
  const [operacion, setOperacion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [sucursal, setSucursal] = useState<string>("");
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
  const [scanError, setScanError] = useState<string | null>(null);
  const [filteredSucursales, setFilteredSucursales] = useState<any[]>([]);
  const [productoQuery, setProductoQuery] = useState("");
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [idSucursal, setIdSucursal] = useState<string>("");


useEffect(() => {
  const precio = parseFloat(precioVenta) || 0;
  const cant = parseFloat(cantidad) || 0;
  setImporte((precio * cant).toFixed(2));
}, [precioVenta, cantidad]);

  useEffect(() => {
    if (productoQuery.length < 2 || !idSucursal) {
      setFilteredProductos([]);
      return;
    }

    const fetchProductos = async () => {
      try {
        const res = await api.get("/productos/filtrar", {
          params: {
            tipo: tipoCode,
            query: productoQuery,
            idSucursal,
          },
        });

        setFilteredProductos(res.data || []);
      } catch (error: any) {
        if (error.response) {
          console.error("Error del servidor:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta del servidor:", error.request);
        } else {
          console.error("Error configurando la petición:", error.message);
        }
      }
    };

    fetchProductos();
  }, [productoQuery, tipoCode, idSucursal]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (sucursal.trim().length === 0) {
        setFilteredSucursales([]);
        return;
      }

      try {
        const response = await api.get(`/sucursales`, {
          params: { query: sucursal },
        });
        setFilteredSucursales(response.data || []);
        console.log("Sucursales encontradas:", response.data);
      } catch (error) {
        console.error("Error buscando sucursales:", error);
      }
    }, 400); // espera 400ms después de escribir

    return () => clearTimeout(delayDebounce);
  }, [sucursal]);

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

  // <-- CAMBIO 4: Reemplazar 'startScanner' con los nuevos handlers

  // Esto se llama cuando el escáner tiene un resultado
  const handleScan = (result: string) => {
    if (result) {
      console.log("Código detectado:", result);
      setCodigo(result); // Pone el código en el input
      setShowScanner(false); // Cierra el overlay
      setScanError(null); // Limpia errores
    }
  };

  // Esto se llama si el escáner da un error (ej. permisos denegados)
  const handleError = (errorMsg: string) => {
    console.error(errorMsg);
    setScanError(errorMsg); // Muestra el error en el overlay
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
                { value: "INVENTARIO", label: "INVENTARIO" },
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
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Sucursal
              </label>
              <input
                type="text"
                placeholder="Ingresa sucursal"
                value={sucursal}
                onChange={(e) => setSucursal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
              />

              {/* Lista desplegable de coincidencias */}
              {(sucursal?.length ?? 0) > 0 &&
                (filteredSucursales?.length ?? 0) > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredSucursales.map((suc) => (
                      <li
                        key={suc.idSUCURSALES}
                        className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSucursal(suc.NOMBRE); // guarda el nombre
                          setFilteredSucursales([]);
                          setIdSucursal(suc.idSUCURSALES);
                        }}
                      >
                        <div className="font-semibold text-black">
                          {suc.NOMBRE}
                        </div>
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
                  { value: "sku", label: "Descripción" },
                  { value: "interno", label: "Código Interno" },
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
                      onClick={() => {
                        setShowScanner(true);
                        setScanError(null);
                      }}
                    >
                      <AiOutlineCamera className="w-5 h-5 mr-2" />
                      Escanear
                    </button>

                    {/* Overlay del escáner */}
                    {showScanner && (
                      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg relative">
                          <h3 className="text-lg font-semibold mb-2 text-gray-800">
                            Apuntar al código
                          </h3>

                          <BarcodeScanner
                            onScanResult={handleScan}
                            onError={handleError}
                          />

                          {scanError && (
                            <p className="text-red-500 text-sm mt-2">
                              {scanError}
                            </p>
                          )}

                          <button
                            className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            onClick={() => {
                              setShowScanner(false);
                              // detener cámara manualmente
                              const stream =
                                document.querySelector("video")?.srcObject;
                              if (stream instanceof MediaStream) {
                                stream.getTracks().forEach((t) => t.stop());
                              }
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    {/* --- Fin del Overlay --- */}
                  </div>
                ) : (
                  <div className="relative">
                    <TextInput
                      label={
                        tipoCode === "sku"
                          ? "Descripción"
                          : tipoCode === "interno"
                          ? "Código Interno"
                          : "Código de Barras"
                      }
                      placeholder={
                        tipoCode === "sku"
                          ? "Buscar por descripción"
                          : tipoCode === "interno"
                          ? "Buscar por código interno"
                          : "Buscar por código de barras"
                      }
                      value={productoQuery}
                      onChange={setProductoQuery}
                    />

                    {filteredProductos.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredProductos.map((prod) => (
                          <li
                            key={prod.idproducto}
                            className="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                            onClick={() => {
                              setCodigo(prod.codbarra);
                              setProductoQuery(prod.descripcion);
                              setPrecioVenta(prod.precio || "0.00");
                              setIva(prod.iva || "0.00");
                              setFilteredProductos([]);
                            }}
                          >
                            {/* Descripción */}
                            <div className="font-semibold text-black">
                              {prod.descripcion}
                            </div>

                            {/* Código Interno */}
                            <div className="text-xs text-gray-700">
                              <strong>Cód. Interno:</strong>{" "}
                              {prod.codinterno || "-"}
                            </div>

                            {/* Código de Barras */}
                            <div className="text-xs text-gray-700">
                              <strong>Cód. Barra:</strong>{" "}
                              {prod.codbarra || "-"}
                            </div>

                            {/* Precio */}
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
                {/* Cantidad e información del producto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3">
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
                      {productoQuery || "-"}
                    </p>
                  </div>
                </div>
                {/* Detalle de precios */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      P. Venta
                    </label>
                    <input
                      type="number"
                      value={precioVenta}
                      onChange={(e) => setPrecioVenta(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-yellow-100 text-center font-medium text-xs sm:text-sm"
                      readOnly
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
