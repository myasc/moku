"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CardData } from "@/lib/types";
import { FlipCard } from "./FlipCard";
import { ProgressBar } from "./ProgressBar";

interface CardStackProps {
    cards: CardData[];
    onComplete: (scores: Record<string, number>) => void;
}

export function CardStack({ cards, onComplete }: CardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allScores, setAllScores] = useState<Record<string, number>>({});

    const handleCardRate = (scores: number[]) => {
        const currentCard = cards[currentIndex];
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        const newAllScores = { ...allScores, [currentCard.id]: averageScore };
        setAllScores(newAllScores);

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newAllScores);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <ProgressBar current={currentIndex + 1} total={cards.length} />

            <div className="relative h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0, rotate: 5 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        exit={{ x: -300, opacity: 0, rotate: -5 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute inset-0"
                    >
                        <FlipCard
                            data={cards[currentIndex]}
                            onRate={handleCardRate}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
