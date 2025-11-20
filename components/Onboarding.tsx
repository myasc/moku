"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserProfile } from "@/lib/types";
import { ArrowRight, Sparkles } from "lucide-react";

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState<"details" | "tutorial">("details");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && dob && gender) {
            setStep("tutorial");
        }
    };

    const handleStart = () => {
        onComplete({
            name,
            dob,
            gender,
            scores: {},
        });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 min-h-[60vh] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {step === "details" ? (
                    <motion.form
                        key="details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleDetailsSubmit}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl font-heading font-bold text-mystic-text">
                                Begin Your Journey
                            </h2>
                            <p className="text-mystic-muted text-sm">
                                Enter your details to create your unique profile.
                            </p>
                        </div>

                        <Input
                            label="Name"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Input
                            label="Date of Birth"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm text-mystic-muted font-medium ml-1">
                                Gender
                            </label>
                            <div className="flex gap-3">
                                {["Male", "Female", "Other"].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g)}
                                        className={`flex-1 py-3 rounded-xl border transition-all ${gender === g
                                                ? "bg-mystic-gold/20 border-mystic-gold text-mystic-gold"
                                                : "bg-mystic-purple/50 border-white/10 text-mystic-muted hover:bg-white/5"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-8" disabled={!name || !dob || !gender}>
                            Continue <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="tutorial"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 text-center"
                    >
                        <div className="w-16 h-16 bg-mystic-gold/10 rounded-full flex items-center justify-center mx-auto text-mystic-gold">
                            <Sparkles className="w-8 h-8" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-heading font-bold text-mystic-text">
                                How it Works
                            </h2>
                            <p className="text-mystic-muted leading-relaxed">
                                You will see 12 Houses and 9 Grahas. Each card represents a part of your psyche.
                            </p>
                            <div className="bg-mystic-purple/50 p-4 rounded-xl border border-white/10 text-sm text-left space-y-3">
                                <p>👆 <strong>Tap</strong> a card to reveal its meaning.</p>
                                <p>🔄 <strong>Flip</strong> to answer 3 questions about yourself.</p>
                                <p>✨ <strong>Be Honest</strong> for the most accurate insight.</p>
                            </div>
                        </div>

                        <Button onClick={handleStart} className="w-full" size="lg">
                            Start Introspection
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
