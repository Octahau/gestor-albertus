"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InventoryListTable, InventoryRecord } from "@/components/inventory-list-table";
import { InventoryDetailModal } from "@/components/inventory-detail-modal";
import { ArrowLeft } from "lucide-react";

// Mock Data
const MOCK_DATA: InventoryRecord[] = [
    {
        id: "1001",
        fecha: "2023-11-28",
        hora: "10:30",
        tipo: "Inventario General",
        total: 1500.50,
        estado: "Completado",
        usuario: "admin",
        sucursal: "Central",
        observacion: "Inventario mensual regular.",
        productos: [
            { codigo: "P001", descripcion: "Producto A", cantidad: 10, precioUnitario: 50, importe: 500 },
            { codigo: "P002", descripcion: "Producto B", cantidad: 20, precioUnitario: 25, importe: 500 },
            { codigo: "P003", descripcion: "Producto C", cantidad: 5, precioUnitario: 100.10, importe: 500.50 },
        ]
    },
    {
        id: "1002",
        fecha: "2023-11-27",
        hora: "15:45",
        tipo: "Ajuste",
        total: 300.00,
        estado: "Pendiente",
        usuario: "vendedor1",
        sucursal: "Norte",
        observacion: "Ajuste por merma.",
        productos: [
            { codigo: "P005", descripcion: "Producto X", cantidad: 3, precioUnitario: 100, importe: 300 },
        ]
    },
    {
        id: "1003",
        fecha: "2023-11-26",
        hora: "09:00",
        tipo: "Inventario General",
        total: 2500.00,
        estado: "Completado",
        usuario: "admin",
        sucursal: "Central",
        observacion: "Inventario de fin de semana.",
        productos: [
            { codigo: "P010", descripcion: "Producto Z", cantidad: 50, precioUnitario: 50, importe: 2500 },
        ]
    }
];

export default function InventoryListPage() {
    const router = useRouter();
    const [sucursalFilter, setSucursalFilter] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter logic
    const filteredRecords = MOCK_DATA.filter(record => {
        const matchesSucursal = sucursalFilter ? record.sucursal.toLowerCase().includes(sucursalFilter.toLowerCase()) : true;

        let matchesFecha = true;
        if (fechaDesde && fechaHasta) {
            matchesFecha = record.fecha >= fechaDesde && record.fecha <= fechaHasta;
        } else if (fechaDesde) {
            matchesFecha = record.fecha >= fechaDesde;
        } else if (fechaHasta) {
            matchesFecha = record.fecha <= fechaHasta;
        }

        return matchesSucursal && matchesFecha;
    });

    const handleViewDetail = (record: InventoryRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-yellow-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Button
                        onClick={() => router.back()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>

                    <Card className="p-6 border-0 shadow-md">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">VER PEDIDOS</h1>
                            <p className="text-gray-600 text-sm">
                                Aquí podrás ver todos los pedidos realizados. Puedes gestionar y revisar cada uno de ellos desde esta sección.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione Sucursal:</label>
                                <Input
                                    placeholder="Filtrar por sucursal..."
                                    value={sucursalFilter}
                                    onChange={(e) => setSucursalFilter(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Desde:</label>
                                <Input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta:</label>
                                <Input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <InventoryListTable
                            records={filteredRecords}
                            onViewDetail={handleViewDetail}
                        />
                    </Card>
                </div>
            </div>

            <InventoryDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                record={selectedRecord}
            />
        </div>
    );
}
