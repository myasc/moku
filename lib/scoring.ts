import { UserProfile, CardData, InterpretationBucket, CategoryType, ProfileAnalysis } from "./types";
import { allCards, houses, grahas } from "./data";

export interface CompatibilityResult {
    score: number;
    matchLevel: "Soulmate" | "Deep Connection" | "Balanced" | "Challenging" | "Karmic Lesson";
    description: string;
    details: {
        complementary: string[];
        tensions: string[];
        conflictLocations: string[];
    };
}



export function getInterpretationBucket(score: number): InterpretationBucket {
    if (score <= 6) return "Low";
    if (score <= 10) return "Medium";
    return "High";
}

import { cardInsights } from "./insights";

export function getProfileAnalysis(profile: UserProfile): ProfileAnalysis {
    const analyzeCard = (card: CardData) => {
        const score = profile.scores[card.id] || 0;
        const bucket = getInterpretationBucket(score);
        let description = "";

        if (bucket === "Low") description = "Deficient, under-expressed, avoidance tendencies";
        else if (bucket === "Medium") description = "Balanced expression";
        else description = "Dominant theme; over-identification possible";

        // Get insight based on bucket (Low -> low, Medium/High -> high)
        // We treat Medium as High for the purpose of "strength" vs "weakness" insights in this context,
        // or we could default to high. Let's use the score to determine which insight to show.
        // Actually, for the general list, we might want to show the insight corresponding to the bucket.
        // But for the "Top" logic, we will be specific.

        const insightData = cardInsights[card.id];
        const isLow = bucket === "Low";
        const insight = isLow ? insightData.low.insight : insightData.high.insight;
        const psychology = isLow ? insightData.low.psychology : insightData.high.psychology;

        return {
            title: card.name,
            score,
            bucket,
            description,
            insight,
            psychology,
            icon: card.icon
        };
    };

    const structural = houses.map(analyzeCard);
    const energetic = grahas.map(analyzeCard);
    const allResults = [...structural, ...energetic];

    // Helper to find max/min
    const findMax = (items: typeof allResults) => items.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    const findMin = (items: typeof allResults) => items.reduce((prev, current) => (prev.score < current.score) ? prev : current);

    const topHouse = findMax(structural);
    const topGraha = findMax(energetic);
    const topStrength = findMax(allResults);
    const topWeakness = findMin(allResults);

    return {
        structural,
        energetic,
        topHouse,
        topGraha,
        topStrength,
        topWeakness
    };
}

export function calculateCompatibility(profile1: UserProfile, profile2: UserProfile): CompatibilityResult {
    let totalDiff = 0;
    let maxDiff = 0;

    // 1. Calculate Base Score (Similarity)
    allCards.forEach((card) => {
        const score1 = profile1.scores[card.id] || 0;
        const score2 = profile2.scores[card.id] || 0;

        // Difference between scores (0-12, since range is 3-15)
        const diff = Math.abs(score1 - score2);
        totalDiff += diff;
        maxDiff += 12; // Max possible difference per card (15-3)
    });

    // Normalize to 0-100
    const compatibilityPercentage = Math.round(((maxDiff - totalDiff) / maxDiff) * 100);

    // 2. Identify Complementary Forces & Tensions
    const complementary: string[] = [];
    const tensions: string[] = [];

    const getScore = (p: UserProfile, name: string) => {
        const card = allCards.find(c => c.name === name);
        return card ? (p.scores[card.id] || 0) : 0;
    };

    const isHigh = (score: number) => score >= 11;
    const isLow = (score: number) => score <= 6;

    // Helper to check pairs for both directions (P1-P2 and P2-P1)
    const checkPair = (name1: string, name2: string, type: "comp" | "tension", msg: string) => {
        const p1A = getScore(profile1, name1);
        const p2B = getScore(profile2, name2);

        const p1B = getScore(profile1, name2);
        const p2A = getScore(profile2, name1);

        // Logic: If both have high energy in complementary pairs, it's a match.
        // For tension, if one is high and other is high in conflicting energy.

        if (type === "comp") {
            if ((isHigh(p1A) && isHigh(p2B)) || (isHigh(p1B) && isHigh(p2A))) {
                complementary.push(msg);
            }
        } else {
            if ((isHigh(p1A) && isHigh(p2B)) || (isHigh(p1B) && isHigh(p2A))) {
                tensions.push(msg);
            }
        }
    };

    // A. Compatibility (Complementary Forces)
    checkPair("Sun", "Jupiter", "comp", "Sun & Jupiter: Shared vision and purpose.");
    checkPair("Moon", "Venus", "comp", "Moon & Venus: Deep emotional and affectionate bond.");
    checkPair("Mars", "Mercury", "comp", "Mars & Mercury: Action balanced with strategy.");
    checkPair("Saturn", "Sun", "comp", "Saturn & Sun: Discipline supports ambition.");
    checkPair("Rahu", "Mars", "comp", "Rahu & Mars: Intense shared drive and goals.");

    // Special case for Ketu stabilizing
    const p1Ketu = getScore(profile1, "Ketu");
    const p2Moon = getScore(profile2, "Moon");
    const p2Venus = getScore(profile2, "Venus");
    if (isHigh(p1Ketu) && (isHigh(p2Moon) || isHigh(p2Venus))) {
        complementary.push("Ketu stabilizes emotional intensity.");
    }

    // B. Natural Tensions
    checkPair("Mars", "Moon", "tension", "Mars vs Moon: Anger vs Sensitivity.");
    checkPair("Venus", "Saturn", "tension", "Venus vs Saturn: Desire vs Restriction.");
    checkPair("Rahu", "Saturn", "tension", "Rahu vs Saturn: Ambition vs Limitation.");
    checkPair("Sun", "Ketu", "tension", "Sun vs Ketu: Ego vs Detachment.");
    checkPair("Mercury", "Moon", "tension", "Mercury vs Moon: Logic vs Emotion.");

    // C. House-based Conflict Location (Where conflict shows up)
    // We look for houses where BOTH have high scores (over-identification) or HUGE gaps
    const conflictLocations: string[] = [];

    houses.forEach(house => {
        const s1 = profile1.scores[house.id] || 0;
        const s2 = profile2.scores[house.id] || 0;

        if (isHigh(s1) && isHigh(s2)) {
            if (house.name === "4th House") conflictLocations.push("Emotional Security & Home");
            if (house.name === "7th House") conflictLocations.push("Relationships & Intimacy");
            if (house.name === "10th House") conflictLocations.push("Career & Public Image");
            if (house.name === "12th House") conflictLocations.push("Unconscious Patterns");
        }
    });

    let matchLevel: CompatibilityResult["matchLevel"];
    let description: string;

    if (compatibilityPercentage >= 90) {
        matchLevel = "Soulmate";
        description = "A rare and profound alignment. You mirror each other's deepest truths.";
    } else if (compatibilityPercentage >= 75) {
        matchLevel = "Deep Connection";
        description = "Strong emotional and psychological resonance. You understand each other well.";
    } else if (compatibilityPercentage >= 50) {
        matchLevel = "Balanced";
        description = "A healthy mix of similarities and differences. Growth comes from understanding.";
    } else if (compatibilityPercentage >= 30) {
        matchLevel = "Challenging";
        description = "Significant differences in worldview. Requires patience and open communication.";
    } else {
        matchLevel = "Karmic Lesson";
        description = "Opposing forces. This relationship is a powerful teacher for both of you.";
    }

    return {
        score: compatibilityPercentage,
        matchLevel,
        description,
        details: {
            complementary,
            tensions,
            conflictLocations
        }
    };
}

export function getDominantTraits(profile: UserProfile): string[] {
    // Sort cards by score (descending)
    const sortedCards = Object.entries(profile.scores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([id]) => allCards.find(c => c.id === id)?.title)
        .filter(Boolean) as string[];

    return sortedCards.slice(0, 3);
}
