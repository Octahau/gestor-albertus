"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (email && password) {
        localStorage.setItem("auth_token", "demo_token")
        router.push("/inventario")
      } else {
        setError("Por favor completa todos los campos")
      }
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-yellow-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Inventario</h1>
            <p className="text-sm sm:text-base text-yellow-600 font-semibold">Sistema de Gestión</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <Input
                type="email"
                placeholder="correo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border-gray-300 text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

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
  )
}
