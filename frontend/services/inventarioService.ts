import api from "@/lib/axiosInstance";

export const inventoryService = {
  // Buscar sucursales
  searchSucursales: async (query: string) => {
    return await api.get("/sucursales", {
      params: { query },
    });
  },

  // Buscar productos
  searchProductos: async (tipo: string, query: string, idSucursal: number) => {
    const res = await api.get("/productos/filtrar", {
      params: {
        tipo,
        query,
        idSucursal,
      },
    });
    return res.data;
  },

  // Guardar inventario
  saveInventario: async (payload: any) => {
    return await api.post("/detalle-inventario", payload);
  },
};
