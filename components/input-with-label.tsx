import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  addon?: string;
  type?: string;
  containerClassName?: string;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, error, addon, type = "text", containerClassName, className, id, ...props }, ref) => {
    const inputId = id || `floating-input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = !!error;

    return (
      <div className={cn("group relative w-full", containerClassName)}>
        <Label
          htmlFor={inputId}
          className={cn(
            "absolute left-2 top-0 z-10 block -translate-y-1/2 bg-background px-1 text-xs transition-colors",
            hasError && "text-destructive"
          )}
          aria-invalid={hasError ? "true" : "false"}
        >
          {label}
        </Label>
        <Input
          type={type}
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 bg-background focus:outline-none focus-visible:border-input focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            hasError && "border-destructive ring-0",
            className
          )}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />
        {addon && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-sm peer-disabled:opacity-50">
            {addon}
          </span>
        )}
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";
