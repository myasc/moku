"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";
import { getProfileAnalysis, ProfileAnalysis } from "@/lib/scoring";
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

    const Section = ({ title, items }: { title: string, items: ProfileAnalysis["structural"] }) => (
        <div className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-mystic-gold border-b border-white/10 pb-2">
                {title}
            </h3>
            <div className="grid gap-4">
                {items.map((item) => (
                    <div key={item.title} className="bg-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-mystic-text">{item.title}</span>
                            <span className={cn(
                                "text-xs px-2 py-1 rounded-full border",
                                item.bucket === "High" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                    item.bucket === "Medium" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            )}>
                                {item.bucket} ({item.score})
                            </span>
                        </div>
                        <p className="text-sm text-mystic-muted">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );

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
                            <div className="bg-mystic-purple/50 border border-white/10 rounded-2xl p-6 space-y-8 backdrop-blur-sm">
                                <Section title="Structural (Houses)" items={analysis.structural} />
                                <Section title="Energetic (Grahas)" items={analysis.energetic} />
                            </div>

                            <div className="space-y-4">
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

                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => setIsEmailModalOpen(true)}
                                >
                                    <Mail className="w-4 h-4 mr-2" /> Get Detailed Report
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

