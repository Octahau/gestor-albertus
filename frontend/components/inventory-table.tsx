"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductItem {
  id: string
  codigo: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  importe: number
}

interface InventoryTableProps {
  productos: ProductItem[]
  onDelete: (id: string) => void
}

export default function InventoryTable({ productos, onDelete }: InventoryTableProps) {
  return (
    <>
      {/* Mobile view - Card layout */}
      <div className="sm:hidden space-y-3">
        {productos.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">No hay productos agregados</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-semibold text-gray-700 text-sm">{producto.codigo}</p>
                  <p className="text-xs text-gray-600">{producto.descripcion}</p>
                </div>
                <Button
                  onClick={() => onDelete(producto.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2 rounded">
                <div>
                  <p className="text-gray-600">Cantidad</p>
                  <p className="font-semibold text-gray-700">{producto.cantidad}</p>
                </div>
                <div>
                  <p className="text-gray-600">P. Unit.</p>
                  <p className="font-semibold text-gray-700">${producto.precioUnitario.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Importe</p>
                  <p className="font-semibold text-yellow-700">${producto.importe.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Código</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Cantidad</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">P. Unit.</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Importe</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                  No hay productos agregados
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id} className="border-b border-gray-200 hover:bg-yellow-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{producto.codigo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{producto.descripcion}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{producto.cantidad}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">${producto.precioUnitario.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-800">
                    ${producto.importe.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => onDelete(producto.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
