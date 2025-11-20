"use client";

import { useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { Assessment } from "@/components/Assessment";
import { Button } from "@/components/ui/Button";
import { UserProfile } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState<"hero" | "onboarding" | "assessment">("hero");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView("assessment");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mystic-purple/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mystic-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {view === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-b from-mystic-gold to-white tracking-tight">
                  KUNDLI
                </h1>
                <p className="text-mystic-muted text-lg max-w-xs mx-auto leading-relaxed">
                  Discover your inner architecture through ancient wisdom and modern psychology.
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => setView("onboarding")}
                className="w-full max-w-xs mx-auto"
              >
                Begin Introspection
              </Button>

              <p className="text-xs text-mystic-muted/50 uppercase tracking-widest">
                Not a prediction tool
              </p>
            </motion.div>
          )}

          {view === "onboarding" && (
            <Onboarding onComplete={handleOnboardingComplete} />
          )}

          {view === "assessment" && userProfile && (
            <Assessment userProfile={userProfile} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
