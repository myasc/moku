"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";
import { calculateCompatibility, CompatibilityResult } from "@/lib/scoring";
import { encodeProfile } from "@/lib/share";
import { incrementCompatibilityRequests } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { Copy, Check, Share2, Heart, Zap, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CompatibilityViewProps {
    myProfile: UserProfile;
    partnerProfile?: UserProfile | null;
    onClose?: () => void;
}

export function CompatibilityView({ myProfile, partnerProfile, onClose }: CompatibilityViewProps) {
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (myProfile && partnerProfile) {
            const res = calculateCompatibility(myProfile, partnerProfile);
            setResult(res);
        } else {
            setResult(null);
        }
    }, [myProfile, partnerProfile]);

    const handleCopyLink = async () => {
        if (!myProfile) return;
        const encoded = encodeProfile(myProfile);
        const url = `${window.location.origin}/compare?partner=${encoded}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Track request if we have a user ID
        if (myProfile.id) {
            await incrementCompatibilityRequests(myProfile.id);
        }
    };

    const handleShareWhatsApp = async () => {
        if (!myProfile) return;
        const encoded = encodeProfile(myProfile);
        const url = `${window.location.origin}/compare?partner=${encoded}`;
        const text = `Hey! I just checked my Kundli profile. Click here to see how compatible we are: ${url}`;

        // Track request if we have a user ID
        if (myProfile.id) {
            await incrementCompatibilityRequests(myProfile.id);
        }

        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (!partnerProfile) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
            >
                {/* Share Section */}
                <div className="bg-mystic-purple/50 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-mystic-text">Invite Partner</h2>
                        <p className="text-sm text-mystic-muted">
                            Share your unique link. When they open it, your compatibility will be revealed instantly.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <Button
                            onClick={handleShareWhatsApp}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                        >
                            <Share2 className="w-4 h-4 mr-2" /> Share on WhatsApp
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCopyLink}
                            className="w-full"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? "Link Copied!" : "Copy Link"}
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!result) return null;

    return (
        <motion.div
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
                    {myProfile.name} & {partnerProfile.name}
                </h2>
                <h3 className="text-xl text-mystic-gold">
                    {result.matchLevel}
                </h3>
                <p className="text-mystic-muted leading-relaxed px-4">
                    {result.description}
                </p>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-4 text-left">
                {result.details.complementary.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <h3 className="flex items-center gap-2 text-green-400 font-bold mb-2">
                            <Heart className="w-4 h-4" /> Complementary Forces
                        </h3>
                        <ul className="list-disc list-inside text-sm text-mystic-text space-y-1">
                            {result.details.complementary.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {result.details.tensions.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <h3 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                            <Zap className="w-4 h-4" /> Natural Tensions
                        </h3>
                        <ul className="list-disc list-inside text-sm text-mystic-text space-y-1">
                            {result.details.tensions.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {result.details.conflictLocations.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <h3 className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                            <MapPin className="w-4 h-4" /> Potential Conflict Zones
                        </h3>
                        <ul className="list-disc list-inside text-sm text-mystic-text space-y-1">
                            {result.details.conflictLocations.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex gap-3 flex-col">
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => {
                        // Clear partner from local storage to "Check Another"
                        localStorage.removeItem("kundli_partner");
                        window.location.reload(); // Simple reload to reset state
                    }} className="flex-1">
                        Check Another
                    </Button>
                    <Button onClick={handleShareWhatsApp} className="flex-1">
                        Share Result
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
