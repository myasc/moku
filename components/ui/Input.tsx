import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="text-sm text-mystic-muted font-medium ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "bg-mystic-purple/50 border border-white/10 rounded-xl px-4 py-3 text-mystic-text placeholder:text-white/20 focus:outline-none focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/50 transition-all duration-200",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
