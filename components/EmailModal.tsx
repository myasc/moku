"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserProfile } from "@/lib/types";

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
}

export function EmailModal({ isOpen, onClose, profile }: EmailModalProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, profile }),
            });

            if (!response.ok) {
                let errorMessage = "Failed to send email";
                try {
                    const data = await response.json();
                    errorMessage = data.error || errorMessage;
                } catch {
                    // If response is not JSON (e.g. 500 HTML page), use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setEmail("");
            }, 3000);
        } catch (error) {
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Failed to send report. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 z-50"
                    >
                        <div className="bg-mystic-dark border border-mystic-gold/20 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-mystic-muted hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-mystic-gold/10 rounded-full flex items-center justify-center mx-auto text-mystic-gold">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Get Your Detailed Report</h2>
                                    <p className="text-sm text-mystic-muted">
                                        Enter your email to receive a comprehensive breakdown of your Kundli profile.
                                    </p>
                                </div>

                                {status === "success" ? (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center space-y-2">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                                        <p className="text-green-200 font-medium">Report sent successfully!</p>
                                        <p className="text-xs text-green-200/60">Check your inbox (and spam folder).</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-xs uppercase tracking-wider text-mystic-muted">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-mystic-gold/50 transition-colors"
                                            />
                                        </div>

                                        {status === "error" && (
                                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                                                <AlertCircle className="w-4 h-4" />
                                                <p>{errorMessage}</p>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className="w-full"
                                        >
                                            {status === "loading" ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Report"
                                            )}
                                        </Button>
                                    </form>
                                )}

                                <p className="text-[10px] text-center text-mystic-muted/40">
                                    We respect your privacy. No spam, ever.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
