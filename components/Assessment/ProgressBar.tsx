"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
    const progress = (current / total) * 100;

    return (
        <div className="w-full max-w-md mx-auto mb-6 px-4">
            <div className="flex justify-between text-xs text-mystic-muted mb-2 font-medium">
                <span>Progress</span>
                <span>{current} / {total}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-mystic-purple to-mystic-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
