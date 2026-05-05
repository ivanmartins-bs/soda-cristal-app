import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Delivery, DeliveryStatusData } from './models';

interface DeliveryState {
    selectedDelivery: Delivery | null;
    selectedRoute: any | null; // Route type to be defined strictly later if needed
    deliveryStatuses: Record<string, DeliveryStatusData>;

    setSelectedDelivery: (delivery: Delivery | null) => void;
    setSelectedRoute: (route: any | null) => void;
    updateDeliveryStatus: (id: string, status: DeliveryStatusData) => void;
    resetDeliveryStatus: (id: string) => void;
    clearDeliveryStatuses: () => void;
    cleanupOldStatuses: () => void;
}

export const useDeliveryStore = create<DeliveryState>()(
    persist(
        (set) => ({
            selectedDelivery: null,
            selectedRoute: null,
            deliveryStatuses: {},

            setSelectedDelivery: (delivery) => set({ selectedDelivery: delivery }),
            setSelectedRoute: (route) => set({ selectedRoute: route }),
            updateDeliveryStatus: (id, status) => set((state) => ({
                deliveryStatuses: { ...state.deliveryStatuses, [id]: status }
            })),
            resetDeliveryStatus: (id) => set((state) => {
                const newStatuses = { ...state.deliveryStatuses };
                delete newStatuses[id];
                return { deliveryStatuses: newStatuses };
            }),
            clearDeliveryStatuses: () => set({ deliveryStatuses: {} }),
            cleanupOldStatuses: () => set((state) => {
                const now = new Date().getTime();
                const EXPIRE_TIME = 20 * 60 * 60 * 1000; // 20 horas
                const newStatuses = { ...state.deliveryStatuses };
                let hasChanged = false;

                Object.keys(newStatuses).forEach((id) => {
                    const status = newStatuses[id];
                    if (status.timestamp) {
                        const statusTime = new Date(status.timestamp).getTime();
                        if (now - statusTime > EXPIRE_TIME) {
                            delete newStatuses[id];
                            hasChanged = true;
                        }
                    }
                });

                return hasChanged ? { deliveryStatuses: newStatuses } : {};
            }),
        }),
        {
            name: 'soda-delivery-storage',
            partialize: (state) => ({
                deliveryStatuses: state.deliveryStatuses,
            }),
        }
    )
);
