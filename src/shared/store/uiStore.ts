import { create } from 'zustand';

interface UiState {
    currentScreen: string;
    selectedCustomer: any | null;
    setCurrentScreen: (screen: string) => void;
    setSelectedCustomer: (customer: any | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
    currentScreen: 'deliveries',
    selectedCustomer: null,
    setCurrentScreen: (screen) => set({ currentScreen: screen }),
    setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));
