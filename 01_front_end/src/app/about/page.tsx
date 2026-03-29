import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Років на ринку', value: '5+', icon: <Globe size={24} /> },
    { label: 'Задоволених клієнтів', value: '10k+', icon: <Users size={24} /> },
    { label: 'Оригінальних брендів', value: '50+', icon: <ShieldCheck size={24} /> },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
          Ми — <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">SportZone</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg font-medium leading-relaxed">
          Ми не просто продаємо кросівки. Ми створюємо культуру руху та досягнень. 
          Наш магазин — це місце, де технології зустрічаються зі стилем.
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {stats.map((stat, i) => (
          <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="text-4xl font-black mb-2">{stat.value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Текстовий блок */}
      <div className="bg-black text-white rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-4xl font-black uppercase mb-6 leading-tight">Наша місія — <br/>Твій результат</h2>
          <p className="text-gray-400 text-lg mb-8">
            Кожна пара взуття в нашому каталозі проходить суворий відбір. Ми працюємо тільки з офіційними постачальниками, щоб ви отримували 100% оригінальний продукт.
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
              <Zap size={20} fill="white" />
            </div>
            <span className="font-bold self-center">Швидка доставка по всій Україні</span>
          </div>
        </div>
        <div className="flex-1 h-64 w-full bg-gray-800 rounded-[2rem] overflow-hidden relative">
           {/* Тут можна вставити фонове фото магазину або складу */}
           <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent"></div>
        </div>
      </div>
    </main>
  );
}