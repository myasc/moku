"use client";

import { Onboarding } from "@/components/Onboarding";
import { Assessment } from "@/components/Assessment";
import { Hero } from "@/components/Hero";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const view = useAppStore((state) => state.view);

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mystic-purple/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mystic-gold/10 rounded-full blur-[100px]" />
        </div>

        <div className="z-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            {view === "hero" && <Hero />}
            {view === "onboarding" && <Onboarding />}
            {view === "assessment" && <Assessment />}
          </AnimatePresence>
        </div>
      </main>
    </LazyMotion>
  );
}
