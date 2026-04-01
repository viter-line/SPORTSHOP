'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Тимчасова проста перевірка (замініть на реальну логіку пізніше)
    if (login === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/admin');
    } else {
      alert('Невірний логін або пароль');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden p-10 space-y-10">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-purple-200 mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Вхід в систему</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Тільки для адміністраторів</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 flex items-center gap-2">
              <User size={12}/> Логін
            </label>
            <input 
              required
              className="w-full bg-gray-100 border-none rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 flex items-center gap-2">
              <Lock size={12}/> Пароль
            </label>
            <input 
              required
              type="password"
              className="w-full bg-gray-100 border-none rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-purple-600 transition-all shadow-xl active:scale-95 group"
          >
            Увійти <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </main>
  );
}