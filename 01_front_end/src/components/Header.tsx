'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/app/store/useCartStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  
  // Стан для запобігання помилкам гідратації
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Розрахунок кількості товарів (безпечно для SSR)
  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Список посилань
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About us', href: '/about' },
    { name: 'Contacts', href: '/contacts' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight hover:opacity-90 transition shrink-0">
          <span className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-purple-200">
            S
          </span>
          <span className="text-gray-900 hidden sm:inline">Sport</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Zone</span>
        </Link>

        {/* Центральна навігація */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                  isActive 
                    ? 'text-purple-600' 
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Права частина: Кошик та Адмін */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors group flex items-center">
            <ShoppingBag size={22} strokeWidth={2.5} />
            
            {/* Відображаємо лічильник тільки ПІСЛЯ монтажу компонента (mounted === true) */}
            {mounted && cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white animate-in zoom-in">
                {cartCount}
              </span>
            )}
            
            <span className="hidden lg:inline ml-2 text-xs font-black uppercase tracking-widest">Кошик</span>
          </Link>

          <div className="hidden sm:block h-8 w-[1px] bg-gray-100"></div>

          <Link 
            href="/admin/login" 
            className="flex items-center gap-2 bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700 px-4 py-2.5 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all text-[11px] font-black uppercase tracking-wider shadow-sm"
          >
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}