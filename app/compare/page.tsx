"use client";

import { useEffect, useState, Suspense } from "react";
import { UserProfile } from "@/lib/types";
import { decodeProfile } from "@/lib/share";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

function CompareRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "redirecting" | "partner_found">("loading");
    const [partnerName, setPartnerName] = useState<string>("");

    useEffect(() => {
        const partnerParam = searchParams.get("partner");
        const savedProfile = localStorage.getItem("kundli_profile");

        if (partnerParam) {
            // 1. Decode and save partner profile
            try {
                const decodedPartner = decodeProfile(partnerParam);
                if (decodedPartner) {
                    console.log("Partner decoded:", decodedPartner);
                    localStorage.setItem("kundli_partner", JSON.stringify(decodedPartner));
                    setPartnerName(decodedPartner.name);

                    if (!savedProfile) {
                        setStatus("partner_found");
                        return;
                    }
                } else {
                    console.error("Failed to decode partner profile");
                }
            } catch (e) {
                console.error("Error processing partner param:", e);
            }
        }

        // 2. Redirect based on user state
        if (savedProfile) {
            setStatus("redirecting");
            router.push("/results");
        } else {
            // If no partner param and no profile, go home
            if (!partnerParam) {
                setStatus("redirecting");
                router.push("/");
            }
        }
    }, [router, searchParams]);

    if (status === "partner_found") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 pointer-events-none fixed">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mystic-purple/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mystic-gold/10 rounded-full blur-[100px]" />
                </div>

                <div className="z-10 w-full max-w-md space-y-8 text-center">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-heading font-bold text-mystic-gold">
                            Compatibility Check
                        </h1>
                        <p className="text-mystic-muted">
                            <span className="text-mystic-text font-bold">{partnerName}</span> wants to check compatibility with you!
                        </p>
                        <div className="bg-mystic-purple/50 border border-white/10 rounded-2xl p-6">
                            <p className="text-sm text-mystic-muted mb-4">
                                To reveal your dynamic, you first need to discover your own profile.
                            </p>
                            <Button onClick={() => router.push("/")} className="w-full">
                                Start My Assessment <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-mystic-gold">
            <div className="animate-pulse">
                {status === "loading" ? "Setting up compatibility check..." : "Redirecting..."}
            </div>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-mystic-gold">Loading...</div>}>
            <CompareRedirect />
        </Suspense>
    );
}


