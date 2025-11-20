"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";
import { calculateCompatibility, CompatibilityResult } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { Copy, Check, ArrowRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComparePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [partnerCode, setPartnerCode] = useState("");
    const [myCode, setMyCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedProfile = localStorage.getItem("kundli_profile");
        if (savedProfile) {
            const p = JSON.parse(savedProfile);
            setProfile(p);
            // Generate a simple "code" from name + dob (mock)
            // In real app, this would come from backend
            const code = btoa(p.name + p.dob).slice(0, 6).toUpperCase();
            setMyCode(code);
        } else {
            router.push("/");
        }
    }, [router]);

    const handleCopy = () => {
        navigator.clipboard.writeText(myCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCompare = () => {
        // In real app, we'd fetch partner profile by code
        // For demo, we'll just mock a partner profile
        const mockPartner: UserProfile = {
            name: "Partner",
            dob: "1995-01-01",
            gender: "Other",
            scores: {}, // Mock scores would be needed here
        };

        // Generate random scores for mock partner
        Object.keys(profile?.scores || {}).forEach(key => {
            mockPartner.scores[key] = Math.floor(Math.random() * 5) + 1;
        });

        if (profile) {
            const res = calculateCompatibility(profile, mockPartner);
            setResult(res);
        }
    };

    if (!profile) return null;

    return (
        <main className="min-h-screen p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mystic-purple/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mystic-gold/10 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-mystic-gold">
                        Compatibility
                    </h1>
                    <p className="text-mystic-muted">Connect with a partner to reveal your dynamic.</p>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            {/* My Code Section */}
                            <div className="bg-mystic-purple/50 border border-white/10 rounded-2xl p-6 space-y-4">
                                <label className="text-sm text-mystic-muted uppercase tracking-widest">Your Code</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-black/20 rounded-xl p-4 text-center font-mono text-2xl tracking-widest text-mystic-gold border border-mystic-gold/20">
                                        {myCode}
                                    </div>
                                    <Button variant="secondary" onClick={handleCopy} className="px-4">
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-mystic-muted text-center">
                                    Share this code with your partner
                                </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <span className="relative bg-mystic-dark px-4 text-sm text-mystic-muted">OR</span>
                            </div>

                            {/* Partner Code Section */}
                            <div className="space-y-4">
                                <Input
                                    label="Enter Partner's Code"
                                    placeholder="6-DIGIT CODE"
                                    value={partnerCode}
                                    onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                                    className="text-center uppercase tracking-widest"
                                    maxLength={6}
                                />
                                <Button
                                    className="w-full"
                                    onClick={handleCompare}
                                    disabled={partnerCode.length < 6}
                                >
                                    Reveal Compatibility <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 text-center"
                        >
                            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 bg-mystic-gold/20 rounded-full blur-xl animate-pulse" />
                                <div className="relative z-10 w-32 h-32 rounded-full border-4 border-mystic-gold flex items-center justify-center bg-mystic-purple">
                                    <span className="text-4xl font-bold text-mystic-gold">{result.score}%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-heading font-bold text-mystic-text">
                                    {result.matchLevel}
                                </h2>
                                <p className="text-mystic-muted leading-relaxed px-4">
                                    {result.description}
                                </p>
                            </div>

                            <div className="bg-mystic-purple/50 border border-white/10 rounded-xl p-4 text-sm text-mystic-text">
                                <p>
                                    This score is based on the alignment of your psychological archetypes.
                                    Remember, compatibility is built, not just found.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setResult(null)} className="flex-1">
                                    Check Another
                                </Button>
                                <Button className="flex-1">
                                    Share Result
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
