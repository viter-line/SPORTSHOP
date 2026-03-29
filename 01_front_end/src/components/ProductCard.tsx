'use client'

import Image from 'next/image';
import { Star, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '@/app/types';
import { useCartStore } from '@/app/store/useCartStore';

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group h-full">
      {/* Зображення з бейджем рейтингу */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-50">
        <Image 
          src={product.image_url} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          priority
        />
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-gray-950 text-[11px] font-black px-3 py-2 rounded-2xl shadow-sm border border-white/50">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {product.rating}
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col px-1">
        <div className="mb-5">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-2 block">
            {product.category}
          </span>
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs mt-3 line-clamp-2 font-medium leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          {/* Статус наявності */}
          <div className="mb-5">
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <CheckCircle size={12} strokeWidth={3} /> В наявності
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <XCircle size={12} strokeWidth={3} /> Немає в наявності
              </span>
            )}
          </div>

          {/* Блок ціни та дії */}
          <div className="flex items-center justify-between gap-4 pt-5 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Ціна</span>
              <span className="text-2xl font-black text-gray-950">₴{product.price}</span>
            </div>
            
            <button 
              onClick={() => addToCart(product)}
              disabled={!product.in_stock}
              className={`flex items-center justify-center gap-2 h-14 w-14 sm:w-auto sm:px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                product.in_stock 
                ? 'bg-gray-950 text-white hover:bg-purple-600 shadow-xl shadow-gray-200 hover:shadow-purple-200 active:scale-95' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Додати</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}