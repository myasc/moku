"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";
import { getDominantTraits } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Share2, UserPlus, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedProfile = localStorage.getItem("kundli_profile");
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        } else {
            router.push("/");
        }
    }, [router]);

    if (!profile) return null;

    const dominantTraits = getDominantTraits(profile);

    return (
        <main className="min-h-screen p-6 flex flex-col items-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-mystic-purple/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-mystic-gold/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md space-y-8 mt-10"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-mystic-gold">
                        {profile.name}&apos;s Profile
                    </h1>
                    <p className="text-mystic-muted">Your inner architecture revealed.</p>
                </div>

                <div className="bg-mystic-purple/50 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
                    <div>
                        <h3 className="text-sm uppercase tracking-widest text-mystic-muted mb-3">Dominant Themes</h3>
                        <div className="flex flex-wrap gap-2">
                            {dominantTraits.map((trait) => (
                                <span key={trait} className="px-3 py-1 rounded-full bg-mystic-gold/10 text-mystic-gold text-sm border border-mystic-gold/20">
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-widest text-mystic-muted">Analysis</h3>
                        <p className="text-mystic-text text-sm leading-relaxed">
                            You show a strong inclination towards {dominantTraits[0].toLowerCase()} and {dominantTraits[1].toLowerCase()}.
                            Your path involves balancing these drives with your inner needs.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        className="w-full"
                        onClick={() => router.push("/compare")}
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> Check Compatibility
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => alert("Feature coming soon!")}
                    >
                        <Mail className="w-4 h-4 mr-2" /> Get Detailed Report
                    </Button>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem("kundli_profile");
                            router.push("/");
                        }}
                        className="text-xs text-mystic-muted hover:text-mystic-text underline"
                    >
                        Retake Assessment
                    </button>
                </div>
            </motion.div>
        </main>
    );
}
