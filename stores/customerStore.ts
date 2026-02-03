import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  // New fields for address persistence
  deliveryAddress?: DeliveryAddress;
  preferredDeliveryZoneId?: string;
}

interface CustomerState {
  customer: CustomerInfo | null;
}

interface CustomerActions {
  setCustomerInfo: (info: CustomerInfo) => void;
  clearCustomerInfo: () => void;
  getCustomerInfo: () => CustomerInfo | null;
  updateDeliveryAddress: (address: DeliveryAddress) => void;
  updatePreferredZone: (zoneId: string) => void;
}

type CustomerStore = CustomerState & CustomerActions;

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customer: null,

      setCustomerInfo: (info) => set({ customer: info }),

      clearCustomerInfo: () => set({ customer: null }),

      getCustomerInfo: () => get().customer,

      updateDeliveryAddress: (address) => {
        const current = get().customer;
        if (current) {
          set({
            customer: {
              ...current,
              deliveryAddress: address,
            },
          });
        }
      },

      updatePreferredZone: (zoneId) => {
        const current = get().customer;
        if (current) {
          set({
            customer: {
              ...current,
              preferredDeliveryZoneId: zoneId,
            },
          });
        }
      },
    }),
    {
      name: 'davids-customer',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customer: state.customer }),
    }
  )
);
