import { createClient } from '@supabase/supabase-js';
import { QuestionSet } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GeneratedQuestionsRow = {
    id: string;
    card_id: string;
    questions_json: QuestionSet[]; // Storing the JSON structure of question sets
    created_at: string;
};
