import { create } from 'zustand';
import { UserProfile } from './types';

type ViewState = 'hero' | 'onboarding' | 'assessment';

interface AppState {
    view: ViewState;
    userProfile: UserProfile | null;
    setView: (view: ViewState) => void;
    setUserProfile: (profile: UserProfile) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    view: 'hero',
    userProfile: null,
    setView: (view) => set({ view }),
    setUserProfile: (userProfile) => set({ userProfile }),
    reset: () => set({ view: 'hero', userProfile: null }),
}));
