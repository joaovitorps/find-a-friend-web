import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
  error?: string;
}

export function PasswordField({
  id,
  label,
  placeholder = "***********",
  value,
  onChange,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 font-semibold text-[#0d3b66] text-base">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "h-16 rounded-[10px] border-[#d3e2e5] bg-[#f5f8fa] px-[18px] pr-12 font-semibold text-[#0d3b66] text-lg placeholder:text-[#0d3b66]/50",
            error && "border-red-500",
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-[17px] -translate-y-1/2 text-[#0d3b66]/50 hover:text-[#0d3b66]"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
        </Button>
      </div>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
