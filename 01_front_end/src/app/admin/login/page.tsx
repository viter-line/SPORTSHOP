'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Loader2, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Імітація входу для демонстрації
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 relative overflow-hidden">
        {/* Декор */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl shadow-purple-100 mb-6 rotate-3">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Sport<span className="text-purple-600">Zone</span>
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mt-2">Панель доступу</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Логін</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Введіть логін..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Пароль</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-950 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> Авторизуватися</>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center gap-6">
          <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
            <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">Тестовий доступ: <span className="text-gray-900 ml-2">admin / admin</span></p>
          </div>
          
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> Назад до магазину
          </Link>
        </div>
      </div>
    </div>
  );
}