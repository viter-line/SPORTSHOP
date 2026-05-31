'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchProducts } from '@/app/lib/api'; 
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ChatWindow from "@/components/ChatWidget";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Внутрішній компонент з логікою товарів
function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState({ items: [], total_pages: 0 });
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search') || "";
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentLimit = Number(searchParams.get('limit')) || 8;
  const currentCategory = searchParams.get('category') || "all";
  const currentSort = searchParams.get('sort_by') || "name";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await fetchProducts(
        currentPage, 
        currentLimit, 
        searchQuery, 
        currentCategory,
        currentSort
      );
      setData(res);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadData();
  }, [searchQuery, currentPage, currentLimit, currentCategory, currentSort]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <FilterBar />

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {data.items.length > 0 ? (
          data.items.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-xl font-medium">Товарів не знайдено 🔍</p>
              <button 
                onClick={() => router.push('/')}
                className="mt-4 text-purple-600 font-bold hover:underline"
              >
                Скинути всі фільтри
              </button>
            </div>
          )
        )}
      </div>

      {data.total_pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-16">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all text-black"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: data.total_pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`w-12 h-12 rounded-2xl font-black transition-all ${
                currentPage === i + 1
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-100 text-gray-400 hover:border-black'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === data.total_pages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all text-black"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </main>
  );
}

// Головний єдиний експорт сторінки
export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const currentUserId = 5; // Тимчасовий ID для тесту вебсокета

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={
          <div className="flex justify-center py-40">
              <Loader2 className="animate-spin text-purple-600" size={40} />
          </div>
      }>
        <HomeContent />
      </Suspense>

      {/* ФЛАВАЮЧИЙ ВІДЖЕТ ЧАТУ ДЛЯ КЛІЄНТІВ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-80 h-[450px] mb-4 shadow-2xl rounded-xl overflow-hidden border border-gray-200 bg-white">
            <ChatWindow roomId={currentUserId} />
          </div>
        )}
        
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 text-2xl"
        >
          {isChatOpen ? "❌" : "💬"}
        </button>
      </div>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}