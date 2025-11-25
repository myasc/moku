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

export interface QuestionSet {
    id: string;
    questions: Question[];
    createdAt: number;
}

export interface CardData {
    id: string;
    type: CategoryType;
    name: HouseName | GrahaName;
    title: string; // e.g., "Self & Identity"
    description: string;
    detailedDescription?: string;
    questions: Question[];
    aiPrompt: string; // Prompt for generating questions
    icon: any; // Lucide Icon
}

export interface UserProfile {
    id?: string; // Optional because it's not present during initial creation flow
    name: string;
    dob: string;
    gender: string;
    scores: Record<string, number>; // cardId -> score (3-15)
}

export type InterpretationBucket = "Low" | "Medium" | "High";
