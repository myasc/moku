import { CardData } from "./types";

export interface InsightData {
    high: {
        insight: string;
        psychology: string;
    };
    low: {
        insight: string;
        psychology: string;
    };
}

export const cardInsights: Record<string, InsightData> = {
    // HOUSES
    "h1": { // 1st House: Self & Identity
        high: {
            insight: "Channel your strong presence into leadership roles, but practice active listening to avoid dominating others.",
            psychology: "High self-assertion indicates a strong ego structure, essential for resilience but potentially leading to narcissism if unchecked."
        },
        low: {
            insight: "Practice daily affirmations and take small risks to build confidence. Your voice matters.",
            psychology: "Low self-assertion often stems from conditional self-worth, where validation is sought externally rather than internally."
        }
    },
    "h2": { // 2nd House: Values & Security
        high: {
            insight: "You have a gift for stability. Use it to build long-term wealth, but don't let material security replace emotional connection.",
            psychology: "A strong drive for security reflects a survival-based attachment style, prioritizing safety over spontaneity."
        },
        low: {
            insight: "Define your core values clearly. Financial instability often mirrors internal uncertainty about what truly matters.",
            psychology: "Low security needs can indicate a 'scarcity mindset' or a rejection of the material world as a defense mechanism."
        }
    },
    "h3": { // 3rd House: Expression & Courage
        high: {
            insight: "Your voice is powerful. Use it to advocate for others, but ensure you are communicating, not just broadcasting.",
            psychology: "High expression suggests a need for external validation of internal thoughts, often linked to a desire to be 'heard' and 'seen'."
        },
        low: {
            insight: "Challenge yourself to speak up in meetings or groups. Your perspective is unique and valuable.",
            psychology: "Reluctance to express often comes from a fear of judgment or a learned behavior that silence equals safety."
        }
    },
    "h4": { // 4th House: Emotional Foundations
        high: {
            insight: "Your emotional depth is a superpower. Create a sanctuary at home, but ensure you don't retreat from the world entirely.",
            psychology: "Deep emotional roots indicate high sensitivity and a strong attachment to the past, often serving as a protective shell."
        },
        low: {
            insight: "Connect with your roots. Healing family patterns can unlock a new level of emotional freedom for you.",
            psychology: "Detachment from emotional foundations can be a defense against past trauma or a way to avoid vulnerability."
        }
    },
    "h5": { // 5th House: Creativity & Play
        high: {
            insight: "You are a natural creator. Dedicate time to 'useless' play—it's where your genius lies.",
            psychology: "A high need for play and expression reflects a strong 'Inner Child' that seeks joy and validation through creation."
        },
        low: {
            insight: "Schedule fun. You may be taking life too seriously, stifling your natural spark.",
            psychology: "Suppressed creativity often points to a belief that productivity is the only measure of worth."
        }
    },
    "h6": { // 6th House: Discipline & Mastery
        high: {
            insight: "Your discipline is admirable. Watch out for burnout; rest is also a productive activity.",
            psychology: "High discipline can be a coping mechanism for anxiety, using control and order to manage internal chaos."
        },
        low: {
            insight: "Start small. Build one healthy habit at a time to regain a sense of control over your life.",
            psychology: "Resistance to routine often stems from a rebellion against authority or a fear of failure if standards aren't met."
        }
    },
    "h7": { // 7th House: Partnership & Bonding
        high: {
            insight: "You thrive in connection. Ensure you maintain your own identity within relationships to avoid codependency.",
            psychology: "A strong focus on partnership suggests an 'Anxious Attachment' style, where safety is found in connection with others."
        },
        low: {
            insight: "Open yourself to collaboration. Independence is strength, but isolation limits your growth.",
            psychology: "Avoidance of partnership often reflects an 'Avoidant Attachment' style, prioritizing autonomy to prevent potential hurt."
        }
    },
    "h8": { // 8th House: Depth & Shadow
        high: {
            insight: "You are a transformer. Use your ability to navigate darkness to help others heal, but protect your energy.",
            psychology: "Comfort with the shadow suggests a history of navigating intense emotional landscapes, leading to high resilience."
        },
        low: {
            insight: "Don't fear the deep end. Vulnerability is not weakness; it's the gateway to true intimacy.",
            psychology: "Avoidance of depth usually masks a fear of loss of control or being overwhelmed by intense emotions."
        }
    },
    "h9": { // 9th House: Belief & Exploration
        high: {
            insight: "You are a seeker. Share your wisdom, but remain open to the fact that truth has many faces.",
            psychology: "A strong quest for meaning reflects a need to transcend the mundane, often driven by existential curiosity."
        },
        low: {
            insight: "Expand your horizons. Read a book on a new topic or travel somewhere new to spark your curiosity.",
            psychology: "A narrowed worldview can be a defense against the uncertainty and complexity of the larger world."
        }
    },
    "h10": { // 10th House: Purpose & Achievement
        high: {
            insight: "You are built for success. Ensure your ladder is leaning against the right wall—does this path truly fulfill you?",
            psychology: "High ambition often compensates for feelings of inadequacy, using external achievement to build internal worth."
        },
        low: {
            insight: "Set one long-term goal. A sense of direction can reduce anxiety and give your days meaning.",
            psychology: "Lack of ambition may stem from a fear of failure or a belief that success is not 'for people like me'."
        }
    },
    "h11": { // 11th House: Aspirations & Social Vision
        high: {
            insight: "You are a connector. Use your network to create positive change, but don't lose yourself in the crowd.",
            psychology: "A focus on the collective suggests a need for belonging and a desire to be part of something greater than oneself."
        },
        low: {
            insight: "Reach out to a friend today. Community is a buffer against life's stressors.",
            psychology: "Social withdrawal often reflects social anxiety or a belief that one does not fit in with the group."
        }
    },
    "h12": { // 12th House: Subconscious & Release
        high: {
            insight: "Trust your intuition. Your sensitivity is a gift; ensure you have enough solitude to recharge.",
            psychology: "High access to the subconscious indicates a porous boundary between self and other, leading to high empathy but potential overwhelm."
        },
        low: {
            insight: "Pay attention to your dreams. Your subconscious is trying to speak to you; don't ignore it.",
            psychology: "Disconnect from the subconscious suggests a repression of intuition in favor of hyper-rationality as a defense."
        }
    },

    // GRAHAS
    "g1": { // Sun: Purpose & Ego Strength
        high: {
            insight: "Lead with humility. Your light is bright enough to shine without dimming others.",
            psychology: "A strong Sun indicates a solid ego-ideal, but can slip into narcissism if the need for admiration overtakes genuine self-worth."
        },
        low: {
            insight: "Step into the spotlight. You have a unique purpose; hiding it serves no one.",
            psychology: "A weak Sun often points to a 'Father Wound' or a lack of early mirroring, leading to a diminished sense of self."
        }
    },
    "g2": { // Moon: Emotion & Sensitivity
        high: {
            insight: "Your empathy is world-class. Practice emotional boundaries so you don't carry everyone else's burdens.",
            psychology: "High lunar energy reflects deep emotional intelligence but can lead to emotional flooding if regulation skills are low."
        },
        low: {
            insight: "Check in with your feelings. Ignoring emotions doesn't make them go away; it makes them somatic.",
            psychology: "Suppressed lunar energy is often a learned response to an environment where emotions were seen as weakness."
        }
    },
    "g3": { // Mars: Drive & Conflict Response
        high: {
            insight: "You are a warrior. Pick your battles wisely; not everything requires a full-force response.",
            psychology: "High Martian energy indicates a strong 'Fight' response, useful for survival but potentially destructive in relationships."
        },
        low: {
            insight: "Stand your ground. Healthy aggression is necessary for setting boundaries and achieving goals.",
            psychology: "Low Mars energy often reflects a 'Fawn' response, prioritizing appeasement over self-protection."
        }
    },
    "g4": { // Mercury: Thinking & Expression
        high: {
            insight: "Your mind is a supercomputer. Practice mindfulness to give your racing thoughts a break.",
            psychology: "High Mercurial energy suggests high cognitive processing speed, but can lead to anxiety and analysis paralysis."
        },
        low: {
            insight: "Write it down. Journaling can help clarify your thoughts and improve your communication.",
            psychology: "Difficulty with Mercury often stems from a fear of being misunderstood or 'sounding stupid'."
        }
    },
    "g5": { // Jupiter: Growth & Wisdom
        high: {
            insight: "Your optimism is magnetic. Ensure your grand plans are grounded in reality to avoid over-promising.",
            psychology: "Strong Jupiterian energy reflects a 'Growth Mindset', but can lead to spiritual bypassing or ignoring necessary details."
        },
        low: {
            insight: "Look for the silver lining. Cultivating gratitude can shift your entire perspective.",
            psychology: "Low Jupiter energy often indicates learned helplessness or a cynical worldview developed as a defense against disappointment."
        }
    },
    "g6": { // Venus: Love & Pleasure
        high: {
            insight: "You are an artist of life. Enjoy the beauty, but remember that true connection goes deeper than aesthetics.",
            psychology: "High Venusian energy prioritizes harmony and pleasure, sometimes at the expense of addressing difficult truths."
        },
        low: {
            insight: "Treat yourself. You deserve pleasure and beauty; it's not frivolous, it's nourishing.",
            psychology: "Blocking Venus often comes from a belief that one is unworthy of love or that pleasure must be 'earned' through suffering."
        }
    },
    "g7": { // Saturn: Discipline & Boundaries
        high: {
            insight: "You are the rock. Your reliability is unmatched, but don't let duty crush your joy.",
            psychology: "Strong Saturnian energy reflects a high capacity for delayed gratification, but can lead to rigidity and depression."
        },
        low: {
            insight: "Commit to one thing. Discipline is freedom; it builds the structure your dreams need to survive.",
            psychology: "Avoiding Saturn is often a rebellion against the 'Father' archetype or a fear of the weight of responsibility."
        }
    },
    "g8": { // Rahu: Ambition & Obsession
        high: {
            insight: "You are a visionary. Your hunger for the new is powerful; just ensure you aren't running from yourself.",
            psychology: "High Rahu energy indicates a drive to break patterns, often fueled by a deep-seated feeling of 'not enoughness'."
        },
        low: {
            insight: "Step out of your comfort zone. Growth happens at the edge of the unknown.",
            psychology: "Low Rahu energy suggests a preference for the known and safe, potentially leading to stagnation."
        }
    },
    "g9": { // Ketu: Detachment & Intuition
        high: {
            insight: "You are a mystic. Your detachment is a strength, but stay connected enough to function in the world.",
            psychology: "High Ketu energy reflects a natural ability to dissociate or transcend, which can be spiritual or escapist."
        },
        low: {
            insight: "Let go. Holding on to the past prevents your hands from receiving the future.",
            psychology: "Low Ketu energy indicates a strong attachment to the material world or past identity, fearing the void of the unknown."
        }
    }
};
