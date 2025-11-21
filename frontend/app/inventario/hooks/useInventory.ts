// app/inventario/hooks/useInventory.ts
import { useState, useEffect } from "react";
import api from "@/lib/axiosInstance";
import { inventoryService } from "@/services/inventarioService";
import {
  ProductItem,
  Producto,
  InventoryState,
  SearchState,
} from "../definitions";

export function useInventory() {
  // 1. Separamos estados: el formulario principal y los de búsqueda
  const [form, setForm] = useState<InventoryState>({
    selectedIdProducto: undefined,
    productoOrigen: "",
    operacion: "",
    fecha: new Date().toISOString().split("T")[0],
    sucursal: "",
    idSucursal: "",
    tipoCode: "codigo",
    codigo: "",
    productoQuery: "",
    cantidad: "",
    precioVenta: "0.00",
    importe: "0.00",
    iva: "0.0",
    porc: "0.0",
    productos: [],
    observacion: "",
    total: 0,
  });
  const [skipNextSearch, setSkipNextSearch] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const [search, setSearch] = useState<SearchState>({
    filteredSucursales: [],
    filteredProductos: [],
  });

  // 2. Todos los useEffects se mueven aquí
  // Efecto para calcular importe
  useEffect(() => {
    const precio = parseFloat(form.precioVenta) || 0;
    const cant = parseFloat(form.cantidad) || 0;
    setForm((prev) => ({ ...prev, importe: (precio * cant).toFixed(2) }));
  }, [form.precioVenta, form.cantidad]);

  // Efecto para buscar sucursales (con debounce)
  useEffect(() => {
    if (skipNextSearch) {
      setSkipNextSearch(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const query = form.sucursal?.trim() || "";

      if (query.length === 0) {
        setSearch((prev) => ({ ...prev, filteredSucursales: [] }));
        return;
      }

      try {
        const res = await inventoryService.searchSucursales(form.sucursal);

        const sucursales = Array.isArray(res.data) ? res.data : [];

        setSearch((prev) => ({
          ...prev,
          filteredSucursales: sucursales,
        }));
      } catch (error) {
        console.error("Error buscando sucursales:", error);
        setSearch((prev) => ({ ...prev, filteredSucursales: [] }));
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [form.sucursal]);

  // Efecto para buscar productos
  useEffect(() => {
    if (skipNextSearch) {
      setSkipNextSearch(false);
      return; // ⬅️ Bloqueamos la búsqueda
    }

    if (form.productoQuery.length < 2 || !form.idSucursal) {
      setSearch((prev) => ({ ...prev, filteredProductos: [] }));
      return;
    }
    const fetchProductos = async () => {
      try {
        const productos = await inventoryService.searchProductos(
          form.tipoCode,
          form.productoQuery,
          form.idSucursal
        );

        setSearch((prev) => ({ ...prev, filteredProductos: productos }));
      } catch (error) {
        console.error("Error buscando productos:", error);
      }
    };
    fetchProductos();
  }, [form.productoQuery, form.tipoCode, form.idSucursal]);

  // 3. Todos los Handlers de datos se mueven aquí

  // Handler genérico para campos simples del formulario
  const handleFormChange = (field: keyof InventoryState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSucursalSelect = (suc: any) => {
    setSkipNextSearch(true);

    setForm((prev) => ({
      ...prev,
      sucursal: suc.NOMBRE,
      idSucursal: suc.idSUCURSALES,
    }));
    setSearch((prev) => ({ ...prev, filteredSucursales: [] }));
  };

  const handleProductoSelect = (prod: Producto) => {
    setSkipNextSearch(true);
    setForm((prev) => ({
      ...prev,
      codigo: prod.codbarra,
      productoQuery: prod.descripcion,
      precioVenta: prod.precio || "0.00",
      iva: prod.iva || "0.00",
      selectedIdProducto: prod.idproducto,
    }));
    setSearch((prev) => ({ ...prev, filteredProductos: [] }));
  };

  const handleAgregarProducto = () => {
    if (!form.codigo || !form.cantidad) {
      setAlert({
        type: "warning",
        message: "Por favor completar los campos requeridos",
      });
      return;
    }
    const nuevoProducto: ProductItem = {
      id: `${Date.now()}`,
      idproducto: form.selectedIdProducto, // <-- aquí el ID real
      codigo: form.codigo,
      descripcion: form.productoQuery || `Producto ${form.codigo}`,
      cantidad: Number.parseFloat(form.cantidad),
      precioUnitario: Number.parseFloat(form.precioVenta),
      importe: Number.parseFloat(form.importe),
    };

    setForm((prev) => ({
      ...prev,
      productos: [...prev.productos, nuevoProducto],
      total: prev.total + nuevoProducto.importe,
      codigo: "",
      productoQuery: "",
      cantidad: "",
      precioVenta: "0.00",
      importe: "0.00",
      iva: "0.0",
      porc: "0.0",
      selectedIdProducto: undefined, // reset
    }));
  };

  const handleEliminarProducto = (id: string) => {
    const producto = form.productos.find((p) => p.id === id);
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== id),
      total: prev.total - (producto?.importe || 0),
    }));
  };

  const handleLimpiarCampos = () => {
    setForm({
      // ...resetear a estado inicial
      productoOrigen: "",
      operacion: "",
      fecha: new Date().toISOString().split("T")[0],
      sucursal: "",
      idSucursal: "",
      tipoCode: "codigo",
      codigo: "",
      productoQuery: "",
      cantidad: "",
      precioVenta: "0.00",
      importe: "0.00",
      iva: "0.0",
      porc: "0.0",
      productos: [],
      observacion: "",
      total: 0,
    });
  };

  const handleGuardarDatos = async () => {
    try {
      if (!form.idSucursal || form.productos.length === 0) {
        setAlert({
          type: "warning",
          message:
            "Debes seleccionar una sucursal y agregar al menos un producto",
        });
        return;
      }

      // Preparar payload listo para backend
      const dataToSend = {
        idSucursal: form.idSucursal,
        fecha: form.fecha,
        total: form.total,
        observac: form.observacion,
        productos: form.productos.map((p) => ({
          idproducto: p.idproducto, // el ID real del producto
          cantidad: p.cantidad,
          punit: p.precioUnitario,
          importe: p.importe,
          descripcion: p.descripcion, // opcional, para DesCortaD
        })),
      };

      console.log("Enviando al backend:", dataToSend);

      const res = await inventoryService.saveInventario(dataToSend);
      if (res.data.success) {
        setAlert({ type: "error", message: "Error al guardar los productos" });
      } else {
        setAlert({
          type: "success",
          message: res.data.message || "Error al guardar los datos",
        });

        console.log("Respuesta del backend:", res.data);

        // Limpiar formulario
        handleLimpiarCampos();
      }
    } catch (error: any) {
      console.error("Error guardando datos:", error);
      setAlert({
        type: "error",
        message: "Error al guardar los datos. Revisa la consola.",
      });
    }
  };

  // 4. Exponemos el estado y los handlers que la UI necesitará
  return {
    form,
    search,
    alert,
    setAlert,
    actions: {
      handleFormChange,
      handleSucursalSelect,
      handleProductoSelect,
      handleAgregarProducto,
      handleEliminarProducto,
      handleLimpiarCampos,
      handleGuardarDatos,
      setCodigo: (codigo: string) => setForm((prev) => ({ ...prev, codigo })),
    },
  };
}
