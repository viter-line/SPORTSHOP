import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SportZone - Преміум спортивні товари',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

// --- Приклад Хедера (поєднує лого та адмін-кнопку з image_0.png) ---
import { ShoppingBag, ShieldCheck } from 'lucide-react';

function Header() {
    // Приклад. Для відображення кількості в кошику потрібен клієнтський компонент
    const cartCount = 0; 

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm border-b">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Лого з іконкою з вашого дизайну */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                    <span className="text-purple-600">✨</span>
                    Sport<span className="text-pink-500">Zone</span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Кошик */}
                    <Link href="/cart" className="relative p-2 text-gray-600 hover:text-purple-600 transition">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Кнопка входу адміна */}
                    <Link href="/admin/login" title="Панель адміністратора" className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-purple-300">
                        <ShieldCheck size={18} className="text-purple-500" />
                        Admin
                    </Link>
                </div>
            </nav>
        </header>
    );
}

// --- Приклад Футера (відтворює дизайн image_2.png) ---
function Footer() {
    return (
        <footer className="bg-[#0D1525] text-gray-300 mt-16 text-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Колонки з image_2.png (SportZone, Магазин, Допомога, Контакти) */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">SportZone</h3>
                    <p className="text-gray-400">Ваше найкраще місце для преміум спортивного обладнання та одягу.</p>
                </div>
                {/* ... */}
            </div>
            <div className="border-t border-gray-700 max-w-7xl mx-auto px-6 py-6 text-center text-gray-500">
                © 2026 SportZone. Всі права захищено.
            </div>
        </footer>
    );
}