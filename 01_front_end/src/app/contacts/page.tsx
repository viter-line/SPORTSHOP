import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Ліва частина: Інфо */}
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-10">
            Зв'яжіться <br/> з <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">намі</span>
          </h1>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Телефон</p>
                <p className="text-xl font-bold">+38 (097) 123 45 67</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <p className="text-xl font-bold">hello@sportzone.ua</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Локація</p>
                <p className="text-xl font-bold">м. Київ, вул. Спортивна, 1</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
              
            </button>
            <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
              
            </button>
          </div>
        </div>

        {/* Права частина: Форма */}
        <div className="bg-white border border-gray-100 p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-purple-100/50">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-2">Ім'я</label>
                <input type="text" placeholder="John" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest ml-2">Email</label>
                <input type="email" placeholder="example@mail.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest ml-2">Повідомлення</label>
              <textarea rows={4} placeholder="Ваше запитання..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"></textarea>
            </div>
            <button className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-lg shadow-gray-200">
              Відправити
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}