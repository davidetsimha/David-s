import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface CustomerState {
  customer: CustomerInfo | null;
}

interface CustomerActions {
  setCustomerInfo: (info: CustomerInfo) => void;
  clearCustomerInfo: () => void;
  getCustomerInfo: () => CustomerInfo | null;
}

type CustomerStore = CustomerState & CustomerActions;

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customer: null,

      setCustomerInfo: (info) => set({ customer: info }),

      clearCustomerInfo: () => set({ customer: null }),

      getCustomerInfo: () => get().customer,
    }),
    {
      name: 'davids-customer',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customer: state.customer }),
    }
  )
);
