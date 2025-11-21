import { create } from 'zustand';
import { UserProfile, QuestionSet } from './types';

type ViewState = 'hero' | 'onboarding' | 'assessment';

interface AppState {
    view: ViewState;
    userProfile: UserProfile | null;

    // AI Question State
    questionSets: Record<string, QuestionSet[]>; // cardId -> sets
    currentSetIndex: Record<string, number>; // cardId -> index
    refreshCount: Record<string, number>; // cardId -> count
    isLoadingQuestions: Record<string, boolean>; // cardId -> loading

    setView: (view: ViewState) => void;
    setUserProfile: (profile: UserProfile) => void;

    // AI Actions
    setQuestionSets: (cardId: string, sets: QuestionSet[]) => void;
    setCurrentSetIndex: (cardId: string, index: number) => void;
    incrementRefreshCount: (cardId: string) => void;
    setLoadingQuestions: (cardId: string, isLoading: boolean) => void;

    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    view: 'hero',
    userProfile: null,

    questionSets: {},
    currentSetIndex: {},
    refreshCount: {},
    isLoadingQuestions: {},

    setView: (view) => set({ view }),
    setUserProfile: (userProfile) => set({ userProfile }),

    setQuestionSets: (cardId, sets) => set((state) => ({
        questionSets: { ...state.questionSets, [cardId]: sets }
    })),

    setCurrentSetIndex: (cardId, index) => set((state) => ({
        currentSetIndex: { ...state.currentSetIndex, [cardId]: index }
    })),

    incrementRefreshCount: (cardId) => set((state) => ({
        refreshCount: { ...state.refreshCount, [cardId]: (state.refreshCount[cardId] || 0) + 1 }
    })),

    setLoadingQuestions: (cardId, isLoading) => set((state) => ({
        isLoadingQuestions: { ...state.isLoadingQuestions, [cardId]: isLoading }
    })),

    reset: () => set({
        view: 'hero',
        userProfile: null,
        questionSets: {},
        currentSetIndex: {},
        refreshCount: {},
        isLoadingQuestions: {}
    }),
}));
