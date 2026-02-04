import { create } from 'zustand';

interface UiState {
    selectedCustomer: any | null;
    setSelectedCustomer: (customer: any | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
    selectedCustomer: null,
    setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));
