'use client'

import { useCartStore } from '../../store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Ваш кошик порожній</h1>
        <p className="text-gray-500 max-w-sm mb-10">Здається, ви ще нічого не додали. Оберіть найкращі товари на головній сторінці.</p>
        <Link href="/" className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-pink-500 transition-all shadow-lg shadow-purple-100">
          Повернутися до покупок
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-purple-600 mb-10 transition-colors">
        <ArrowLeft size={16} /> Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Список товарів */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black text-gray-900">Кошик</h1>
            <button onClick={clearCart} className="text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Очистити все</button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{item.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xl font-black text-gray-950">${item.price}</p>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-purple-600 transition-all"><Minus size={16}/></button>
                <span className="w-8 text-center font-black">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-purple-600 transition-all"><Plus size={16}/></button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="p-4 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        {/* Разом */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold mb-8 text-gray-900">Підсумок замовлення</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Кількість товарів</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Доставка</span>
                <span className="text-green-600 font-bold uppercase text-xs">Безкоштовно</span>
              </div>
              <div className="h-[1px] bg-gray-100 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">Разом:</span>
                <span className="text-3xl font-black text-purple-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-gray-950 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-gray-100 active:scale-[0.98]">
              Оформити замовлення
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}