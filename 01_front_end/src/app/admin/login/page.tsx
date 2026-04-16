'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { loginUser } from '@/app/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Викликаємо функцію, яка звертається до FastAPI
      const result = await loginUser({ username, password });

      if (result && result.status === 'success') {
        // Зберігаємо статус входу
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminUser', result.username);
        
        // Перенаправляємо в адмін-панель
        router.push('/admin');
      } else {
        setError('Невірний логін або пароль');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden p-10 space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Лого та заголовок */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-purple-100 mb-4 transform -rotate-6">
            <Lock size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-950">Система входу</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">База даних: MySQL Active</p>
        </div>

        {/* Повідомлення про помилку */}
        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
            <AlertCircle size={20} />
            <span className="text-xs font-bold uppercase">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Поле Логін */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 flex items-center gap-2">
              <User size={12}/> Логін адміністратора
            </label>
            <input 
              required
              disabled={isLoading}
              type="text"
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 font-bold outline-none focus:border-purple-500 focus:bg-white transition-all disabled:opacity-50"
              placeholder="Введіть username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Поле Пароль */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 flex items-center gap-2">
              <Lock size={12}/> Пароль
            </label>
            <input 
              required
              disabled={isLoading}
              type="password"
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 font-bold outline-none focus:border-purple-500 focus:bg-white transition-all disabled:opacity-50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Кнопка входу */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-purple-600 transition-all shadow-xl active:scale-95 group disabled:bg-gray-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Перевірити дані <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
            SportStore Admin Panel v2.0
          </p>
        </div>
      </div>
    </main>
  );
}