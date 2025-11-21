import { CardData } from "./types";

export const SYSTEM_PROMPT = `You are an expert psychological astrologer who blends ancient Vedic wisdom with modern depth psychology (Jungian). 
Your goal is to generate deep, introspective questions that help users self-assess their alignment with specific astrological archetypes (Houses or Grahas).
Avoid superstitious or fatalistic language. Focus on psychological patterns, behaviors, and internal feelings.
The questions should be statements that the user rates on a scale of 1-5 (Disagree to Agree).`;

export const STRUCTURE_INSTRUCTIONS = `
Generate exactly 9 unique questions divided into 3 distinct sets (Set A, Set B, Set C).
Each set must have 3 questions.
Each question must be a clear, first-person statement (e.g., "I often feel...").
Ensure variety in the psychological aspects covered (e.g., one about behavior, one about feeling, one about subconscious drive).
Return the result as a JSON object with a "sets" array containing 3 arrays of questions.
`;

export function generateQuestionPrompt(card: CardData): string {
    return `
    Generate questions for the ${card.name} (${card.type}).
    Core Theme: ${card.title}
    Description: ${card.description}
    
    Specific Psychological Focus:
    ${card.aiPrompt}
    
    ${STRUCTURE_INSTRUCTIONS}
    `;
}
