'use client'

import { useCartStore } from '@/app/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/app/types';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    // Повертаємо текст кнопки назад через 2 секунди
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl ${
        added 
        ? 'bg-green-500 text-white shadow-green-100' 
        : 'bg-gray-950 text-white hover:bg-purple-600 shadow-purple-100'
      }`}
    >
      <ShoppingCart size={24} strokeWidth={2.5} />
      {added ? 'ДОДАНО В КОШИК!' : 'ДОДАТИ В КОШИК'}
    </button>
  );
}