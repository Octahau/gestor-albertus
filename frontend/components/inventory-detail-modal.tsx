"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryRecord } from "./inventory-list-table";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    record: InventoryRecord | null;
}

export function InventoryDetailModal({ isOpen, onClose, record }: Props) {
    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        Detalle del Inventario #{record.id}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">ID</p>
                        <p className="text-sm font-medium text-gray-900">#{record.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Sucursal</p>
                        <p className="text-sm font-medium text-gray-900">{record.sucursal}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                        <p className="text-sm font-medium text-gray-900">${record.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Fecha</p>
                        <p className="text-sm font-medium text-gray-900">{record.fecha}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-4 mt-2 border-t border-yellow-200 pt-2">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Observación</p>
                        <p className="text-sm font-medium text-gray-900 italic">{record.observacion || "Sin observaciones"}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Productos</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Código</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Descripción</th>
                                    <th className="px-3 py-2 text-right font-medium text-gray-600">Cant.</th>
                                    <th className="px-3 py-2 text-right font-medium text-gray-600">P. Unit</th>
                                    <th className="px-3 py-2 text-right font-medium text-gray-600">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {record.productos.map((prod, idx) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-2 text-gray-700">{prod.codigo}</td>
                                        <td className="px-3 py-2 text-gray-700">{prod.descripcion}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">{prod.cantidad}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">${prod.precioUnitario.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-right font-medium text-gray-900">${prod.importe.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-200">
                                    <td colSpan={4} className="px-3 py-3 text-right font-bold text-gray-800">Total General:</td>
                                    <td className="px-3 py-3 text-right font-bold text-yellow-600 text-lg">${record.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
