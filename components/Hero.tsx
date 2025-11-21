"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";

export function Hero() {
    const setView = useAppStore((state) => state.setView);

    return (
        <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
        >
            <div className="space-y-4">
                <h1 className="text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-b from-mystic-gold to-white tracking-tight">
                    KUNDLI
                </h1>
                <p className="text-mystic-muted text-lg max-w-xs mx-auto leading-relaxed">
                    Discover your inner architecture through ancient wisdom and modern psychology.
                </p>
            </div>

            <Button
                size="lg"
                onClick={() => setView("onboarding")}
                className="w-full max-w-xs mx-auto"
            >
                Begin Introspection
            </Button>

            <p className="text-xs text-mystic-muted/50 uppercase tracking-widest">
                Not a prediction tool
            </p>
        </motion.div>
    );
}
