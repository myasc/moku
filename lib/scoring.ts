import { UserProfile, CardData } from "./types";
import { allCards } from "./data";

export interface CompatibilityResult {
    score: number;
    matchLevel: "Soulmate" | "Deep Connection" | "Balanced" | "Challenging" | "Karmic Lesson";
    description: string;
}

export function calculateCompatibility(profile1: UserProfile, profile2: UserProfile): CompatibilityResult {
    let totalDiff = 0;
    let maxDiff = 0;

    allCards.forEach((card) => {
        const score1 = profile1.scores[card.id] || 0;
        const score2 = profile2.scores[card.id] || 0;

        // Difference between scores (0-4)
        const diff = Math.abs(score1 - score2);
        totalDiff += diff;
        maxDiff += 4; // Max possible difference per card
    });

    // Normalize to 0-100
    // Lower difference = Higher compatibility
    const compatibilityPercentage = Math.round(((maxDiff - totalDiff) / maxDiff) * 100);

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
