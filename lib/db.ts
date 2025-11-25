import { supabase } from './supabase';
import { QuestionSet, UserProfile } from './types';

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

export async function saveUser(profile: UserProfile): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({
                name: profile.name,
                dob: profile.dob,
                gender: profile.gender,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error saving user:', error);
            return null;
        }

        return data.id;
    } catch (err) {
        console.error('Unexpected error in saveUser:', err);
        return null;
    }
}

export async function incrementCompatibilityRequests(userId: string): Promise<void> {
    try {
        const { error } = await supabase.rpc('increment_compatibility_requests', {
            user_id: userId
        });

        if (error) {
            console.error('Error incrementing compatibility requests:', error);
        } else {
            console.log('Successfully incremented compatibility requests for user:', userId);
        }
    } catch (err) {
        console.error('Unexpected error in incrementCompatibilityRequests:', err);
    }
}
