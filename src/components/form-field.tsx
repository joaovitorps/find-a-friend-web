import { type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "id" | "type" | "value" | "onChange" | "className"
  > {
  id: string;
  label: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: string;
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
  error?: string;
  className?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 font-semibold text-[#0d3b66] text-base">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        className={cn(
          "h-16 rounded-[10px] border-[#d3e2e5] bg-[#f5f8fa] px-[18px] font-semibold text-[#0d3b66] text-lg placeholder:text-[#0d3b66]/50",
          error && "border-red-500",
          className,
        )}
      />
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
