"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectWithLabelOption {
  value: string;
  label: string;
}

interface SelectWithLabelProps {
  label: string;
  options: SelectWithLabelOption[];
  error?: string;
  containerClassName?: string;
  triggerClassName?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function SelectWithLabel({
  label,
  options,
  error,
  containerClassName,
  triggerClassName,
  placeholder,
  value,
  onValueChange,
  disabled,
  id: idProp,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: SelectWithLabelProps) {
  const id = idProp || `floating-select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const hasError = !!error;

  return (
    <div className={cn("group relative w-full", containerClassName)}>
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-2 top-0 z-10 block -translate-y-1/2 bg-background px-1 text-xs transition-colors",
          hasError && "text-destructive"
        )}
        aria-invalid={hasError ? "true" : "false"}
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(
            "h-10 w-full bg-background focus:outline-none focus-visible:border-input focus-visible:ring-0 focus-visible:ring-offset-0",
            hasError && "border-destructive ring-0",
            triggerClassName
          )}
          aria-invalid={ariaInvalid ?? (hasError ? "true" : "false")}
          aria-describedby={ariaDescribedby ?? (hasError ? `${id}-error` : undefined)}
        >
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
