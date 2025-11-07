export interface ProductItem {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}
export interface Producto {
  idproducto: number;
  descripcion: string;
  codbarra: string;
  precio?: string | null;
  iva: string | null;
  codinterno?: string | null;
}

export interface InventoryState {
  productoOrigen: string;
  operacion: string;
  fecha: string;
  sucursal: string; // Query de búsqueda
  idSucursal: string; // ID seleccionado
  tipoCode: string;
  codigo: string;     // Código de barras del producto
  productoQuery: string; // Query de búsqueda de producto
  cantidad: string;
  precioVenta: string;
  importe: string;
  iva: string;
  porc: string;
  productos: ProductItem[]; // La lista de productos agregados
  observacion: string;
  total: number;
}

export interface SearchState {
  filteredSucursales: any[];
  filteredProductos: Producto[];
}