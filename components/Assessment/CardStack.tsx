"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CardData } from "@/lib/types";
import { FlipCard } from "./FlipCard";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface CardStackProps {
    cards: CardData[];
    onComplete: (scores: Record<string, number>) => void;
}

export function CardStack({ cards, onComplete }: CardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allScores, setAllScores] = useState<Record<string, number>>({});
    const [rawScores, setRawScores] = useState<Record<string, number[]>>({});

    // Toggle this to show/hide the debug button
    const SHOW_DEBUG_CONTROLS = true;

    const handleCardRate = (scores: number[]) => {
        const currentCard = cards[currentIndex];
        // Sum the scores (range 3-15)
        const totalScore = scores.reduce((a, b) => a + b, 0);

        const newAllScores = { ...allScores, [currentCard.id]: totalScore };
        setAllScores(newAllScores);

        const newRawScores = { ...rawScores, [currentCard.id]: scores };
        setRawScores(newRawScores);

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newAllScores);
        }
    };

    const handleRandomFill = () => {
        const newAllScores: Record<string, number> = {};

        cards.forEach(card => {
            // Generate 3 random scores between 1 and 5 for each card
            const randomScores = Array(3).fill(0).map(() => Math.floor(Math.random() * 5) + 1);
            const totalScore = randomScores.reduce((a, b) => a + b, 0);
            newAllScores[card.id] = totalScore;
        });

        onComplete(newAllScores);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            {SHOW_DEBUG_CONTROLS && (
                <div className="absolute -top-12 right-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRandomFill}
                        className="text-xs border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        Test: Random Fill
                    </Button>
                </div>
            )}

            <div className="mb-6 flex items-center justify-between">
                {currentIndex > 0 ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="px-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                ) : (
                    <div /> /* Spacer to keep progress bar centered if needed, or just empty */
                )}
                <div className="flex-1 mx-4">
                    <ProgressBar current={currentIndex + 1} total={cards.length} />
                </div>
                <div className="w-[60px]" /> {/* Spacer for balance */}
            </div>

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
                            initialScores={rawScores[cards[currentIndex].id]}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
