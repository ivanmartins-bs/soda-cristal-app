import { create } from 'zustand';

interface UserState {
    isLoggedIn: boolean;
    user: any | null;
    login: () => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    isLoggedIn: false,
    user: null,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false, user: null }),
}));
