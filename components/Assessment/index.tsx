"use client";

import { UserProfile } from "@/lib/types";
import { CardStack } from "./CardStack";
import { allCards } from "@/lib/data";
import { useRouter } from "next/navigation";

interface AssessmentProps {
    userProfile: UserProfile;
}

export function Assessment({ userProfile }: AssessmentProps) {
    const router = useRouter();

    const handleComplete = (scores: Record<string, number>) => {
        // In a real app, we would save this to a database/local storage
        console.log("Assessment Complete:", { ...userProfile, scores });

        // Store in localStorage for now to persist across pages
        const finalProfile = { ...userProfile, scores };
        localStorage.setItem("kundli_profile", JSON.stringify(finalProfile));

        router.push("/results");
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-mystic-text">
                    Introspection
                </h2>
                <p className="text-mystic-muted text-sm">
                    Flip the card to answer. Be honest.
                </p>
            </div>

            <CardStack cards={allCards} onComplete={handleComplete} />
        </div>
    );
}
