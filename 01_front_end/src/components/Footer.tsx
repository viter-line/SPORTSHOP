'use client'

import Link from 'next/link';
import { Share2, Heart, Play, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D1525] text-gray-400 pt-24 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        
        {/* Про магазин */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter">
            <span className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-purple-900/20 text-base">S</span>
            Sport<span className="text-purple-500">Zone</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs font-medium text-gray-500">
            Ваш надійний партнер у світі спорту. Тільки оригінальна продукція та професійне спорядження для будь-яких цілей.
          </p>
          <div className="flex gap-5">
            <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300">
              <Share2 size={18} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300">
              <Heart size={18} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
              <Play size={18} />
            </Link>
          </div>
        </div>

        {/* Навігація */}
        <div>
          <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em]">Каталог</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Взуття для бігу</Link></li>
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Одяг для фітнесу</Link></li>
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Аксесуари</Link></li>
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Новинки</Link></li>
          </ul>
        </div>

        {/* Клієнтам */}
        <div>
          <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em]">Сервіс</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Доставка</Link></li>
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Оплата</Link></li>
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Гарантія</Link></li>
            <li><Link href="#" className="hover:text-purple-400 transition-colors">Контакти</Link></li>
          </ul>
        </div>

        {/* Контакти */}
        <div>
          <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em]">Зворотний зв'язок</h4>
          <ul className="space-y-6 text-sm">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-purple-500" />
              </div>
              <span className="font-medium text-gray-300">м. Львів,<br />вул. Промислова, 50/52</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center shrink-0">
                <Phone size={18} className="text-purple-500" />
              </div>
              <span className="font-black text-white">+380 67 000 00 00</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-purple-500" />
              </div>
              <span className="font-medium">support@sportzone.ua</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
          © 2026 SportZone LLC. Всі права захищено.
        </p>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <Link href="#" className="hover:text-white transition-colors">Публічна оферта</Link>
          <Link href="#" className="hover:text-white transition-colors">Приватність</Link>
        </div>
      </div>
    </footer>
  );
}