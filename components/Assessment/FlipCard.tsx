"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { RefreshCw, RotateCcw, Info, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface FlipCardProps {
    data: CardData;
    onRate: (scores: number[]) => void;
    initialScores?: number[];
}

export function FlipCard({ data, onRate, initialScores }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [scores, setScores] = useState<number[]>(
        initialScores || new Array(data.questions.length).fill(0)
    );
    const [shake, setShake] = useState(false);

    // Store State
    const {
        questionSets,
        currentSetIndex,
        refreshCount,
        isLoadingQuestions,
        setQuestionSets,
        setCurrentSetIndex,
        incrementRefreshCount,
        setLoadingQuestions
    } = useAppStore();

    const cardId = data.id;
    const currentSets = questionSets[cardId] || [];
    const currentIndex = currentSetIndex[cardId] || 0;
    const currentRefreshCount = refreshCount[cardId] || 0;
    const isLoading = isLoadingQuestions[cardId] || false;

    // Determine which questions to show
    const activeQuestions = currentSets.length > 0
        ? currentSets[currentIndex].questions
        : data.questions;

    // Reset scores when questions change
    // Note: In a real app, we might want to persist scores per question set
    // For now, we reset when switching sets if the scores don't match the new length
    if (scores.length !== activeQuestions.length) {
        setScores(new Array(activeQuestions.length).fill(0));
    }

    const handleRate = (index: number, score: number) => {
        const newScores = [...scores];
        newScores[index] = score;
        setScores(newScores);
    };

    const handleSubmit = () => {
        if (scores.every((s) => s > 0)) {
            onRate(scores);
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 400);
        }
    };

    const handleRefresh = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // If we already have questions, just cycle to the next set
        if (currentSets.length > 0) {
            const nextIndex = (currentIndex + 1) % currentSets.length;
            setCurrentSetIndex(cardId, nextIndex);
            setScores(new Array(3).fill(0)); // Reset scores
            return;
        }

        setLoadingQuestions(cardId, true);

        try {
            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId: data.id, type: data.type }),
            });

            if (!response.ok) throw new Error('Failed to generate questions');

            const result = await response.json();

            // Update store
            setQuestionSets(cardId, result.questions);
            setCurrentSetIndex(cardId, 0); // Reset to first set
            // incrementRefreshCount(cardId); // No longer needed for limiting, but kept for tracking if desired

            // Reset scores for new questions
            setScores(new Array(3).fill(0));

        } catch (error) {
            console.error("Error refreshing questions:", error);
            alert("Failed to refresh questions. Please try again.");
        } finally {
            setLoadingQuestions(cardId, false);
        }
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
                    className="absolute inset-0 backface-hidden w-full h-full bg-mystic-purple/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-mystic-gold/50"
                    onClick={() => !showInfo && setIsFlipped(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            if (!showInfo) setIsFlipped(true);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ backgroundImage: "var(--card-gradient)" }}
                    aria-label={`Flip card for ${data.name}`}
                >
                    {/* Info Button */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleInfoClick}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleInfoClick(e as unknown as React.MouseEvent);
                            }
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-mystic-muted hover:bg-white/10 hover:text-mystic-gold transition-colors z-10"
                        aria-label="Show card info"
                    >
                        <Info className="w-5 h-5" />
                    </div>

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
                                className="absolute inset-0 bg-mystic-dark/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center z-20 cursor-default"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleCloseInfo}
                                    className="absolute top-4 right-4 p-2 text-mystic-muted hover:text-white"
                                    aria-label="Close info"
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

                        <div className="flex items-center gap-2">
                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="p-2 hover:bg-white/5 rounded-full text-mystic-muted hover:text-mystic-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
                                title="Get new questions"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {activeQuestions.map((q, qIdx) => (
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
                            <RotateCcw className="w-4 h-4 mr-2" /> Flip
                        </Button>
                        <motion.div
                            className="flex-1"
                            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSubmit}
                                className="w-full"
                            >
                                Next Card
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
