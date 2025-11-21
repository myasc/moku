import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { allCards } from '@/lib/data';
import { generateQuestionPrompt, SYSTEM_PROMPT } from '@/lib/prompts';
import { getQuestionsForCard, saveQuestions } from '@/lib/db';
import { QuestionSet } from '@/lib/types';

// Configure xAI (Grok)
const xai = createOpenAI({
    name: 'xai',
    baseURL: 'https://api.x.ai/v1',
    apiKey: process.env.XAI_API_KEY,
});

// Configure OpenAI (Backup)
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Schema for structured output
const QuestionSchema = z.object({
    sets: z.array(
        z.array(
            z.object({
                text: z.string(),
            })
        ).length(3) // Each set must have 3 questions
    ).length(3), // Must generate 3 sets
});

export async function POST(req: Request) {
    try {
        const { cardId } = await req.json();

        if (!cardId) {
            return new Response('Missing cardId', { status: 400 });
        }

        // 1. Check Cache (Supabase)
        const cachedQuestions = await getQuestionsForCard(cardId);
        if (cachedQuestions) {
            return Response.json({ questions: cachedQuestions, source: 'cache' });
        }

        // 2. Get Card Data
        const card = allCards.find((c) => c.id === cardId);
        if (!card) {
            return new Response('Card not found', { status: 404 });
        }

        // 3. Generate Questions via AI
        const prompt = generateQuestionPrompt(card);
        let result;
        let provider = 'xai';

        try {
            // Try xAI first
            result = await generateObject({
                model: xai('grok-2-1212'), // Updated to latest stable model
                system: SYSTEM_PROMPT,
                prompt: prompt,
                schema: QuestionSchema,
            });
        } catch (error) {
            console.error('xAI generation failed, switching to backup:', error);
            // Fallback to OpenAI
            provider = 'openai';
            result = await generateObject({
                model: openai('gpt-4o-mini'),
                system: SYSTEM_PROMPT,
                prompt: prompt,
                schema: QuestionSchema,
            });
        }

        // 4. Format Questions
        const timestamp = Date.now();
        const formattedSets: QuestionSet[] = result.object.sets.map((set, setIndex) => ({
            id: `${cardId}-set-${timestamp}-${setIndex}`,
            createdAt: timestamp,
            questions: set.map((q, qIndex) => ({
                id: `${cardId}-ai-${timestamp}-${setIndex}-${qIndex}`,
                text: q.text,
            })),
        }));

        // 5. Save to Cache (Supabase)
        // We don't await this to speed up response
        saveQuestions(cardId, formattedSets).catch(err =>
            console.error('Failed to save questions to DB:', err)
        );

        return Response.json({ questions: formattedSets, source: provider });

    } catch (error) {
        console.error('Error generating questions:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
