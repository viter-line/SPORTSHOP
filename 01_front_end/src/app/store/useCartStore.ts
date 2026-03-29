import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/app/types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === product.id);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, qty) => set({
        items: get().items.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)
      }),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'sport-cart-storage' }
  )
);