import { forwardRef, ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type MotionButtonProps = ComponentProps<typeof motion.button>;

interface ButtonProps extends MotionButtonProps {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-mystic-gold text-mystic-dark hover:bg-yellow-500 shadow-[0_0_15px_rgba(212,175,55,0.3)]",
            secondary: "bg-mystic-purple text-mystic-text hover:bg-[#252540] border border-white/10",
            outline: "border border-mystic-gold/50 text-mystic-gold hover:bg-mystic-gold/10",
            ghost: "text-mystic-muted hover:text-mystic-text hover:bg-white/5",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
