"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {AlertMessage} from "@/components/alert-message"; 
import axios from "axios";
import api from "@/lib/axiosInstance";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [contra, setContra] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  // Si ya hay un usuario logueado, redirigir al inventario
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/inventario");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await api.post("login", {
        usuario,
        contra,
      });

      if (response.data.success) {
        // Mensaje de éxito
        setAlert({ type: "success", message: "Inicio de sesión exitoso" });

        // Guarda usuario en localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirige al inventario después de unos segundos
        setTimeout(() => router.push("/inventario"), 1500);
      } else {
        // Mensaje de error del backend
        setAlert({
          type: "error",
          message: response.data.message || "Error al iniciar sesión",
        });
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message ?? "Error de conexión con el servidor";
        setAlert({ type: "error", message: msg });
      } else {
        setAlert({ type: "error", message: "Error desconocido" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-yellow-50 p-4 relative">
      {/* Componente de alerta dinámica */}
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      <Card className="w-full max-w-md shadow-lg border-0 z-10">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Inventario</h1>
            <p className="text-sm sm:text-base text-yellow-600 font-semibold">Sistema de Gestión</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <Input
                type="text"
                placeholder="Ingrese su usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="rounded-lg border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={contra}
                onChange={(e) => setContra(e.target.value)}
                className="rounded-lg border-gray-300 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-2 sm:py-2.5 rounded-lg text-sm sm:text-base"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Versión 1.0</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
