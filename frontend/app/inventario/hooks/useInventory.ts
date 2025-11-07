// app/inventario/hooks/useInventory.ts
import { useState, useEffect } from "react";
import api from "@/lib/axiosInstance";
import { ProductItem, Producto, InventoryState, SearchState } from "../definitions"; 

export function useInventory() {
  // 1. Separamos estados: el formulario principal y los de búsqueda
  const [form, setForm] = useState<InventoryState>({
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

  const [search, setSearch] = useState<SearchState>({
    filteredSucursales: [],
    filteredProductos: [],
  });
  
  // 2. Todos los useEffects se mueven aquí
  // Efecto para calcular importe
  useEffect(() => {
    const precio = parseFloat(form.precioVenta) || 0;
    const cant = parseFloat(form.cantidad) || 0;
    setForm(prev => ({ ...prev, importe: (precio * cant).toFixed(2) }));
  }, [form.precioVenta, form.cantidad]);
  
  // Efecto para buscar sucursales (con debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (form.sucursal.trim().length === 0) {
        setSearch(prev => ({ ...prev, filteredSucursales: [] }));
        return;
      }
      try {
        const res = await api.get(`/sucursales`, { params: { query: form.sucursal } });
        setSearch(prev => ({ ...prev, filteredSucursales: res.data || [] }));
      } catch (error) {
        console.error("Error buscando sucursales:", error);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [form.sucursal]);

  // Efecto para buscar productos
  useEffect(() => {
    if (form.productoQuery.length < 2 || !form.idSucursal) {
      setSearch(prev => ({ ...prev, filteredProductos: [] }));
      return;
    }
    const fetchProductos = async () => {
      try {
        const res = await api.get("/productos/filtrar", {
          params: {
            tipo: form.tipoCode,
            query: form.productoQuery,
            idSucursal: form.idSucursal,
          },
        });
        setSearch(prev => ({ ...prev, filteredProductos: res.data || [] }));
      } catch (error) {
        console.error("Error buscando productos:", error);
      }
    };
    fetchProductos();
  }, [form.productoQuery, form.tipoCode, form.idSucursal]);
  
  // 3. Todos los Handlers de datos se mueven aquí
  
  // Handler genérico para campos simples del formulario
  const handleFormChange = (field: keyof InventoryState, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSucursalSelect = (suc: any) => {
    setForm(prev => ({
      ...prev,
      sucursal: suc.NOMBRE,
      idSucursal: suc.idSUCURSALES
    }));
    setSearch(prev => ({ ...prev, filteredSucursales: [] }));
  };

  const handleProductoSelect = (prod: Producto) => {
    setForm(prev => ({
      ...prev,
      codigo: prod.codbarra,
      productoQuery: prod.descripcion,
      precioVenta: prod.precio || "0.00",
      iva: prod.iva || "0.00",
    }));
    setSearch(prev => ({ ...prev, filteredProductos: [] }));
  };

  const handleAgregarProducto = () => {
    if (!form.codigo || !form.cantidad) {
      alert("Por favor completa los campos requeridos");
      return;
    }
    const nuevoProducto: ProductItem = {
      id: `${Date.now()}`,
      codigo: form.codigo,
      descripcion: form.productoQuery || `Producto ${form.codigo}`,
      cantidad: Number.parseFloat(form.cantidad),
      precioUnitario: Number.parseFloat(form.precioVenta),
      importe: Number.parseFloat(form.importe),
    };

    setForm(prev => ({
      ...prev,
      productos: [...prev.productos, nuevoProducto],
      total: prev.total + nuevoProducto.importe,
      // Limpiar campos de producto
      codigo: "",
      productoQuery: "",
      cantidad: "",
      precioVenta: "0.00",
      importe: "0.00",
      iva: "0.0",
      porc: "0.0",
    }));
  };

  const handleEliminarProducto = (id: string) => {
    const producto = form.productos.find(p => p.id === id);
    setForm(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== id),
      total: prev.total - (producto?.importe || 0)
    }));
  };
  
  const handleLimpiarCampos = () => {
    setForm({
      // ...resetear a estado inicial
      productoOrigen: "", operacion: "", 
      fecha: new Date().toISOString().split("T")[0],
      sucursal: "", idSucursal: "", tipoCode: "codigo",
      codigo: "", productoQuery: "", cantidad: "",
      precioVenta: "0.00", importe: "0.00", iva: "0.0", porc: "0.0",
      productos: [], observacion: "", total: 0,
    });
  };

  const handleGuardarDatos = async () => {
    try {
      const { filteredSucursales, filteredProductos, ...dataToSave } = { ...form, ...search };
      await api.post("/inventario", dataToSave);
      alert("Datos guardados exitosamente");
      handleLimpiarCampos();
    } catch (error) {
      console.error("Error guardando datos:", error);
      alert("Error al guardar los datos");
    }
  };

  // 4. Exponemos el estado y los handlers que la UI necesitará
  return {
    form,
    search,
    actions: {
      handleFormChange,
      handleSucursalSelect,
      handleProductoSelect,
      handleAgregarProducto,
      handleEliminarProducto,
      handleLimpiarCampos,
      handleGuardarDatos,
      setCodigo: (codigo: string) => setForm(prev => ({...prev, codigo}))
    }
  };
}