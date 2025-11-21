import { supabase } from './supabase';
import { QuestionSet } from './types';

export async function getQuestionsForCard(cardId: string): Promise<QuestionSet[] | null> {
    try {
        const { data, error } = await supabase
            .from('generated_questions')
            .select('questions_json')
            .eq('card_id', cardId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') { // Ignore "Row not found" error
                console.error('Error fetching questions:', error);
            }
            return null;
        }

        if (data && data.questions_json) {
            return data.questions_json as QuestionSet[];
        }

        return null;
    } catch (err) {
        console.error('Unexpected error in getQuestionsForCard:', err);
        return null;
    }
}

export async function saveQuestions(cardId: string, questions: QuestionSet[]): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('generated_questions')
            .insert({
                card_id: cardId,
                questions_json: questions,
            });

        if (error) {
            console.error('Error saving questions:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error in saveQuestions:', err);
        return false;
    }
}
