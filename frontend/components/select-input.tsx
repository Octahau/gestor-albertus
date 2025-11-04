"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectInputProps {
  label?: string
  placeholder?: string
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function SelectInput({ label, placeholder, options, value, onChange, disabled }: SelectInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="rounded-lg border-gray-300">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
