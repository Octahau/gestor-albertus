"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface InventoryRecord {
    id: string;
    fecha: string;
    hora: string;
    tipo: string;
    total: number;
    estado: string;
    usuario: string;
    sucursal: string; // Added for filtering
    observacion: string; // Added for details
    productos: any[]; // For details
}

interface Props {
    records: InventoryRecord[];
    onViewDetail: (record: InventoryRecord) => void;
}

export function InventoryListTable({ records, onViewDetail }: Props) {
    return (
        <>
            {/* Mobile View - Cards */}
            <div className="sm:hidden space-y-4">
                {records.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-8 bg-white rounded-lg border border-gray-200">
                        No se encontraron registros
                    </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">ID</span>
                                    <p className="text-sm font-medium text-gray-900">#{record.id}</p>
                                </div>
                                <Button
                                    onClick={() => onViewDetail(record)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 -mt-1 -mr-2"
                                >
                                    <Eye className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Sucursal</span>
                                    <p className="text-sm text-gray-700">{record.sucursal}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Fecha</span>
                                    <p className="text-sm text-gray-700">{record.fecha}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                                    <span className="text-lg font-bold text-gray-900">${record.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sucursal</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                                    No se encontraron registros
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id} className="hover:bg-yellow-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{record.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{record.sucursal}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">${record.total.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{record.fecha}</td>
                                    <td className="px-4 py-3 text-center">
                                        <Button
                                            onClick={() => onViewDetail(record)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
