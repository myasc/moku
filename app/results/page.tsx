"use client";

import { useEffect, useState } from "react";
import { UserProfile, ProfileAnalysis } from "@/lib/types";
import { getProfileAnalysis } from "@/lib/scoring";
import { encodeProfile } from "@/lib/share";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Share2, UserPlus, Mail, ArrowLeft, User, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EmailModal } from "@/components/EmailModal";
import { CompatibilityView } from "@/components/CompatibilityView";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
    const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"self" | "partner">("self");
    const router = useRouter();

    useEffect(() => {
        const savedProfile = localStorage.getItem("kundli_profile");
        if (savedProfile) {
            const p = JSON.parse(savedProfile);
            setProfile(p);
            setAnalysis(getProfileAnalysis(p));
        } else {
            router.push("/");
        }

        const savedPartner = localStorage.getItem("kundli_partner");
        if (savedPartner) {
            setPartnerProfile(JSON.parse(savedPartner));
            setActiveTab("partner"); // Default to partner tab if partner exists
        }
    }, [router]);

    if (!profile || !analysis) return null;

    const HighlightCard = ({ title, data, type }: { title: string, data: ProfileAnalysis["topHouse"], type: "strength" | "weakness" | "neutral" }) => {
        const Icon = data.icon;
        return (
            <div className="bg-mystic-purple/50 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm relative overflow-hidden">
                <div className={cn(
                    "absolute top-0 right-0 p-2 rounded-bl-xl text-xs font-bold uppercase tracking-wider",
                    type === "strength" ? "bg-green-500/20 text-green-400" :
                        type === "weakness" ? "bg-red-500/20 text-red-400" :
                            "bg-mystic-gold/20 text-mystic-gold"
                )}>
                    {title}
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/5">
                        <Icon className="w-8 h-8 text-mystic-gold" />
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-bold text-white">{data.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-mystic-muted">
                            <span>Score: {data.score}/15</span>
                            <span>•</span>
                            <span className={cn(
                                data.bucket === "High" ? "text-red-400" :
                                    data.bucket === "Medium" ? "text-yellow-400" :
                                        "text-blue-400"
                            )}>{data.bucket} Expression</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-mystic-gold uppercase tracking-wider">Actionable Insight</span>
                        <p className="text-sm text-white/90 leading-relaxed">
                            {data.insight}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs font-bold text-mystic-muted uppercase tracking-wider">Psychological Why</span>
                        <p className="text-xs text-mystic-muted italic leading-relaxed">
                            "{data.psychology}"
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen p-6 flex flex-col items-center relative overflow-hidden overflow-y-auto">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none fixed">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-mystic-purple/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-mystic-gold/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md space-y-6 mt-6 mb-12"
            >
                <div className="w-full flex justify-start">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/")}
                        className="px-0 hover:bg-transparent text-mystic-muted hover:text-mystic-gold"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-mystic-gold">
                        {profile.name}&apos;s Profile
                    </h1>
                    <p className="text-mystic-muted">Your inner architecture revealed.</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-mystic-purple/50 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab("self")}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeTab === "self"
                                ? "bg-mystic-gold text-mystic-dark shadow-lg"
                                : "text-mystic-muted hover:text-mystic-text"
                        )}
                    >
                        <User className="w-4 h-4" /> Self
                    </button>
                    <button
                        onClick={() => setActiveTab("partner")}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeTab === "partner"
                                ? "bg-mystic-gold text-mystic-dark shadow-lg"
                                : "text-mystic-muted hover:text-mystic-text"
                        )}
                    >
                        <Users className="w-4 h-4" /> Partner
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "self" ? (
                        <motion.div
                            key="self"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-6">
                                <HighlightCard title="Dominant House" data={analysis.topHouse} type="neutral" />
                                <HighlightCard title="Dominant Planet" data={analysis.topGraha} type="neutral" />
                                <HighlightCard title="Greatest Strength" data={analysis.topStrength} type="strength" />
                                <HighlightCard title="Core Challenge" data={analysis.topWeakness} type="weakness" />
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="bg-mystic-gold/10 border border-mystic-gold/20 rounded-xl p-4 text-center space-y-2">
                                    <p className="text-sm text-mystic-gold font-medium">
                                        This is just the tip of the iceberg.
                                    </p>
                                    <p className="text-xs text-mystic-muted">
                                        Get your full 20+ page psychological analysis covering all 12 Houses and 9 Planets.
                                    </p>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full py-6 text-lg shadow-lg shadow-mystic-gold/10"
                                    onClick={() => setIsEmailModalOpen(true)}
                                >
                                    <Mail className="w-5 h-5 mr-2" /> Get Detailed Report
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full border-mystic-gold/20 text-mystic-gold hover:bg-mystic-gold/10"
                                    onClick={() => {
                                        const encoded = encodeProfile(profile);
                                        const url = `${window.location.origin}/compare?partner=${encoded}`;
                                        const text = `Hey! I just checked my Kundli profile. Click here to see how compatible we are: ${url}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                    }}
                                >
                                    <Share2 className="w-4 h-4 mr-2" /> Share Profile
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="partner"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <CompatibilityView
                                myProfile={profile}
                                partnerProfile={partnerProfile}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center space-y-3">
                    <button
                        onClick={() => {
                            localStorage.removeItem("kundli_profile");
                            localStorage.removeItem("kundli_partner");
                            router.push("/");
                        }}
                        className="text-xs text-mystic-muted hover:text-mystic-text underline"
                    >
                        Retake Assessment
                    </button>
                </div>
            </motion.div>

            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                profile={profile}
            />
        </main>
    );
}

