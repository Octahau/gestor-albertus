"use client"

import { Input } from "@/components/ui/input"

interface TextInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: string
  disabled?: boolean
  readOnly?: boolean
}

export function TextInput({ label, placeholder, value, onChange, type = "text", disabled, readOnly }: TextInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        className="rounded-lg border-gray-300"
      />
    </div>
  )
}
