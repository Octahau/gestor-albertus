"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface AlertMessageProps {
  type: "success" | "error" | "warning"
  message: string
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => setIsVisible(false), 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [message])

  if (!isVisible) return null

  const alertStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      text: "text-green-800",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      text: "text-red-800",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      text: "text-yellow-800",
    },
  }

  const styles = alertStyles[type]
  const icons = {
    success: <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />,
    error: <XCircle className="w-5 h-5 md:w-6 md:h-6" />,
    warning: <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />,
  }

  return (
    <div
      className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 transition-all duration-300 ${
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div
        className={`flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-lg border-2 shadow-lg ${styles.bg} ${styles.border}`}
      >
        <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>{icons[type]}</div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm md:text-base font-medium break-words ${styles.text}`}>{message}</p>
        </div>

        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => setIsVisible(false), 300)
          }}
          className={`flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors`}
          aria-label="Cerrar alerta"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
