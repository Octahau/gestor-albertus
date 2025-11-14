"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function SelectInput({ label, placeholder, value, onChange, options }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
