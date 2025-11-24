
import { houses, grahas } from "./lib/data";
import { calculateCompatibility, getProfileAnalysis, getInterpretationBucket } from "./lib/scoring";
import { UserProfile } from "./lib/types";

// Mock Data
const mockProfile1: UserProfile = {
    name: "User 1",
    dob: "1990-01-01",
    gender: "Male",
    scores: {}
};

const mockProfile2: UserProfile = {
    name: "User 2",
    dob: "1992-02-02",
    gender: "Female",
    scores: {}
};

// Helper to set scores
const setScore = (profile: UserProfile, cardId: string, score: number) => {
    profile.scores[cardId] = score;
};

// 1. Test Interpretation Buckets
console.log("--- Testing Interpretation Buckets ---");
console.log("Score 4 (Low):", getInterpretationBucket(4) === "Low" ? "PASS" : "FAIL");
console.log("Score 8 (Medium):", getInterpretationBucket(8) === "Medium" ? "PASS" : "FAIL");
console.log("Score 12 (High):", getInterpretationBucket(12) === "High" ? "PASS" : "FAIL");

// 2. Test Profile Analysis
console.log("\n--- Testing Profile Analysis ---");
// Set high score for 1st House
setScore(mockProfile1, houses[0].id, 13);
const analysis = getProfileAnalysis(mockProfile1);
const house1Analysis = analysis.structural.find(h => h.title === houses[0].name);
console.log("House 1 Score 13 -> High Bucket:", house1Analysis?.bucket === "High" ? "PASS" : "FAIL");
console.log("House 1 Description:", house1Analysis?.description);

// 3. Test Compatibility - Complementary Forces
console.log("\n--- Testing Compatibility (Complementary) ---");
// Sun (g1) & Jupiter (g5)
const sun = grahas.find(g => g.name === "Sun")!;
const jupiter = grahas.find(g => g.name === "Jupiter")!;

setScore(mockProfile1, sun.id, 12); // High Sun
setScore(mockProfile2, jupiter.id, 12); // High Jupiter

const compResult = calculateCompatibility(mockProfile1, mockProfile2);
console.log("Sun-Jupiter Complementary Found:", compResult.details.complementary.some(s => s.includes("Sun & Jupiter")) ? "PASS" : "FAIL");

// 4. Test Compatibility - Tensions
console.log("\n--- Testing Compatibility (Tensions) ---");
// Mars (g3) & Moon (g2) - assuming IDs g3 and g2 based on order, but let's find by name
const mars = grahas.find(g => g.name === "Mars");
const moon = grahas.find(g => g.name === "Moon");

if (mars && moon) {
    setScore(mockProfile1, mars.id, 12); // High Mars
    setScore(mockProfile2, moon.id, 12); // High Moon

    const tensionResult = calculateCompatibility(mockProfile1, mockProfile2);
    console.log("Mars-Moon Tension Found:", tensionResult.details.tensions.some(s => s.includes("Mars vs Moon")) ? "PASS" : "FAIL");
} else {
    console.log("Skipping Mars-Moon test (cards not found in data export)");
}

// 5. Test Conflict Location
console.log("\n--- Testing Conflict Location ---");
// Both high in 4th House
const house4 = houses.find(h => h.name === "4th House");
if (house4) {
    setScore(mockProfile1, house4.id, 12);
    setScore(mockProfile2, house4.id, 12);

    const conflictResult = calculateCompatibility(mockProfile1, mockProfile2);
    console.log("4th House Conflict Found:", conflictResult.details.conflictLocations.includes("Emotional Security & Home") ? "PASS" : "FAIL");
} else {
    console.log("Skipping 4th House test (card not found)");
}
