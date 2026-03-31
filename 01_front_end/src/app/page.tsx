'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchProducts } from '@/app/lib/api'; // Перевірте шлях до вашого api.ts
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Стан для даних та індикатора завантаження
  const [data, setData] = useState({ items: [], total_pages: 0 });
  const [loading, setLoading] = useState(true);

  // Зчитуємо ВСІ актуальні параметри з URL
  const searchQuery = searchParams.get('search') || "";
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentLimit = Number(searchParams.get('limit')) || 8;
  const currentCategory = searchParams.get('category') || "all";

  // Основний ефект завантаження даних
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Викликаємо API з усіма фільтрами одночасно
      const res = await fetchProducts(
        currentPage, 
        currentLimit, 
        searchQuery, 
        currentCategory
      );
      
      setData(res);
      setLoading(false);
      
      // Плавний скрол вгору при зміні фільтрів або сторінки
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    loadData();
    
    // Масив залежностей: якщо хоч один параметр в URL зміниться — loadData запуститься знову
  }, [searchQuery, currentPage, currentLimit, currentCategory]);

  // Функція для перемикання сторінок через оновлення URL
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* Наш компонент фільтрації */}
      <FilterBar />

      {/* Сітка товарів */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {data.items.length > 0 ? (
          data.items.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-xl font-medium">Товарів не знайдено за вашим запитом 🔍</p>
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

      {/* Блок пагінації (показуємо, лише якщо сторінок більше однієї) */}
      {data.total_pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-16">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all text-black"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: data.total_pages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-12 h-12 rounded-2xl font-black transition-all ${
                  currentPage === pageNum
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-100 text-gray-400 hover:border-black'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

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