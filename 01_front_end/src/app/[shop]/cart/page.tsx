'use client'

import { useCartStore } from '@/app/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-50 rounded-[2rem] mb-8 text-purple-600">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-4xl font-black mb-4 text-gray-950">Кошик порожній</h1>
        <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
          Час наповнити його стильними речами з нашої нової колекції!
        </p>
        <Link 
          href="/shop" 
          className="bg-gray-950 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-purple-600 transition-all shadow-2xl shadow-purple-100 active:scale-95"
        >
          Повернутися в магазин
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-black mb-6 transition-colors font-black uppercase text-[10px] tracking-[0.2em]">
            <ArrowLeft size={14} strokeWidth={3} />
            Назад до покупок
          </Link>
          <h1 className="text-5xl font-black text-gray-950 tracking-tighter">Кошик</h1>
        </div>
        <button 
          onClick={clearCart}
          className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl"
        >
          <Trash2 size={14} /> Очистити все
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Список товарів */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-500">
              <div className="relative w-32 h-32 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 group">
                <Image 
                  src={item.image_url || '/placeholder.png'} 
                  alt={item.name} 
                  fill 
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-grow text-center sm:text-left">
                <p className="text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  {item.category}
                </p>
                <h3 className="font-bold text-2xl text-gray-950 mb-4">{item.name}</h3>
                <div className="text-3xl font-black text-gray-950">₴{item.price}</div>
              </div>

              <div className="flex items-center gap-4 bg-gray-100/50 p-2 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-purple-600 transition-all active:scale-90"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="w-8 text-center font-black text-gray-950 text-lg">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-purple-600 transition-all active:scale-90"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-4 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
              >
                <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Підсумок замовлення */}
        <div className="lg:col-span-1">
          <div className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200 border-t-8 border-purple-600">
            <h2 className="text-2xl font-black mb-10 tracking-tight">Ваш чек</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Товари ({items.length})</span>
                <span className="font-black text-lg">₴{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Доставка</span>
                <span className="text-green-400 font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-green-400/10 rounded-full">Безкоштовно</span>
              </div>
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="flex justify-between items-end pt-2">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Всього до сплати</span>
                <span className="text-5xl font-black tracking-tighter text-white">₴{totalPrice}</span>
              </div>
            </div>

            <button className="w-full bg-purple-600 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-purple-500 transition-all active:scale-95 shadow-xl shadow-purple-900/40">
              <CreditCard size={24} strokeWidth={2.5} />
              Оформити
            </button>
            
            <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-8">
              Безпечна оплата через LiqPay / Mono
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}