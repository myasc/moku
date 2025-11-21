"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { RefreshCw, RotateCcw, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
    data: CardData;
    onRate: (scores: number[]) => void;
}

export function FlipCard({ data, onRate }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [scores, setScores] = useState<number[]>([0, 0, 0]);

    const handleRate = (index: number, score: number) => {
        const newScores = [...scores];
        newScores[index] = score;
        setScores(newScores);
    };

    const handleSubmit = () => {
        if (scores.every((s) => s > 0)) {
            onRate(scores);
        }
    };

    const handleRefresh = (e: React.MouseEvent) => {
        e.stopPropagation();
        // In a real app, this would fetch new questions
        console.log("Refresh questions");
    };

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowInfo(true);
    };

    const handleCloseInfo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowInfo(false);
    };

    return (
        <div className="relative w-full h-[500px] perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-150"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.15, type: "spring", stiffness: 160, damping: 20 }}
            >
                {/* Front of Card */}
                <div
                    className="absolute inset-0 backface-hidden w-full h-full bg-mystic-purple/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer"
                    onClick={() => !showInfo && setIsFlipped(true)}
                    style={{ backgroundImage: "var(--card-gradient)" }}
                >
                    {/* Info Button */}
                    <button
                        onClick={handleInfoClick}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-mystic-muted hover:bg-white/10 hover:text-mystic-gold transition-colors z-10"
                    >
                        <Info className="w-5 h-5" />
                    </button>

                    <div className="w-20 h-20 rounded-full bg-mystic-gold/10 flex items-center justify-center mb-6">
                        <span className="text-4xl font-heading text-mystic-gold">
                            {data.name.charAt(0)}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-mystic-gold mb-2">{data.name}</h3>
                    <h4 className="text-lg text-mystic-text mb-4">{data.title}</h4>

                    {/* Short Description (Default) */}
                    <p className="text-mystic-muted text-sm leading-relaxed max-w-xs line-clamp-2">
                        {data.description}
                    </p>

                    <div className="mt-8 text-xs text-mystic-muted/50 uppercase tracking-widest">
                        Tap Card to Rate
                    </div>

                    {/* Info Overlay */}
                    <AnimatePresence>
                        {showInfo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-0 bg-mystic-dark/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleCloseInfo}
                                    className="absolute top-4 right-4 p-2 text-mystic-muted hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h3 className="text-xl font-bold text-mystic-gold mb-4">{data.name}</h3>
                                <p className="text-mystic-text text-base leading-relaxed">
                                    {data.description}
                                </p>
                                <p className="mt-4 text-sm text-mystic-muted">
                                    This archetype influences your subconscious patterns. Understanding it is key to self-mastery.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute inset-0 backface-hidden w-full h-full bg-mystic-dark border border-mystic-gold/20 rounded-2xl p-6 flex flex-col shadow-2xl rotate-y-180"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-mystic-gold">{data.name}</h3>
                        <button
                            onClick={handleRefresh}
                            className="p-2 hover:bg-white/5 rounded-full text-mystic-muted hover:text-mystic-text transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {data.questions.map((q, qIdx) => (
                            <div key={q.id} className="space-y-3">
                                <p className="text-sm text-mystic-text">{q.text}</p>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => handleRate(qIdx, rating)}
                                            className={cn(
                                                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                                                scores[qIdx] === rating
                                                    ? "bg-mystic-gold text-mystic-dark scale-110"
                                                    : "bg-white/5 text-mystic-muted hover:bg-white/10"
                                            )}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-mystic-muted/50 px-1">
                                    <span>Disagree</span>
                                    <span>Agree</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFlipped(false)}
                            className="flex-1"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={scores.some(s => s === 0)}
                            className="flex-1"
                        >
                            Next Card
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
