export type HouseName =
    | "1st House" | "2nd House" | "3rd House" | "4th House"
    | "5th House" | "6th House" | "7th House" | "8th House"
    | "9th House" | "10th House" | "11th House" | "12th House";

export type GrahaName =
    | "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter"
    | "Venus" | "Saturn" | "Rahu" | "Ketu";

export type CategoryType = "House" | "Graha";

export interface Question {
    id: string;
    text: string;
}

export interface CardData {
    id: string;
    type: CategoryType;
    name: HouseName | GrahaName;
    title: string; // e.g., "Self & Identity"
    description: string;
    question_generator_prompt: string;
    questions: Question[];
}

export interface UserProfile {
    name: string;
    dob: string;
    gender: string;
    scores: Record<string, number>; // cardId -> score (1-5)
}
