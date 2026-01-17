import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductType } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartValidationResult {
  valid: boolean;
  error?: 'MIXED_CART_NOT_ALLOWED';
  message?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastValidationError: CartValidationResult | null;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => CartValidationResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  getItemQuantity: (productId: string) => number;
  getCartType: () => ProductType | null;
  canAddProduct: (product: Product) => CartValidationResult;
  clearValidationError: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastValidationError: null,

      // Get the current cart type based on items
      getCartType: () => {
        const { items } = get();
        if (items.length === 0) return null;
        // Return the type of the first item (all items should be same type)
        return items[0].product.product_type || 'individual';
      },

      // Check if a product can be added to the cart
      canAddProduct: (product) => {
        const cartType = get().getCartType();
        const productType = product.product_type || 'individual';

        // If cart is empty, any product can be added
        if (cartType === null) {
          return { valid: true };
        }

        // If product type matches cart type, it can be added
        if (cartType === productType) {
          return { valid: true };
        }

        // Mixed cart not allowed
        return {
          valid: false,
          error: 'MIXED_CART_NOT_ALLOWED',
          message:
            cartType === 'individual'
              ? 'Vous ne pouvez pas mélanger les gâteaux individuels et les plateaux. Veuillez vider votre panier ou passer une commande séparée.'
              : 'Vous ne pouvez pas mélanger les plateaux et les gâteaux individuels. Veuillez vider votre panier ou passer une commande séparée.',
        };
      },

      clearValidationError: () => set({ lastValidationError: null }),

      addItem: (product, quantity = 1) => {
        const validation = get().canAddProduct(product);

        if (!validation.valid) {
          set({ lastValidationError: validation });
          return validation;
        }

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex !== -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, lastValidationError: null };
          }
          return {
            items: [...state.items, { product, quantity }],
            lastValidationError: null,
          };
        });

        return { valid: true };
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], lastValidationError: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item?.quantity ?? 0;
      },
    }),
    {
      name: 'davids-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
