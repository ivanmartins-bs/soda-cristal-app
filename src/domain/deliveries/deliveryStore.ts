import { create } from 'zustand';
import { Delivery, DeliveryStatusData } from './models';

interface DeliveryState {
    selectedDelivery: Delivery | null;
    selectedRoute: any | null; // Route type to be defined strictly later if needed
    deliveryStatuses: Record<string, DeliveryStatusData>;

    setSelectedDelivery: (delivery: Delivery | null) => void;
    setSelectedRoute: (route: any | null) => void;
    updateDeliveryStatus: (id: string, status: DeliveryStatusData) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
    selectedDelivery: null,
    selectedRoute: null,
    deliveryStatuses: {},

    setSelectedDelivery: (delivery) => set({ selectedDelivery: delivery }),
    setSelectedRoute: (route) => set({ selectedRoute: route }),
    updateDeliveryStatus: (id, status) => set((state) => ({
        deliveryStatuses: { ...state.deliveryStatuses, [id]: status }
    })),
}));
