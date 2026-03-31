'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Додаємо цей хук
import { fetchProducts } from '@/app/lib/api';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const searchParams = useSearchParams(); // Зчитуємо параметри з URL
  
  const [data, setData] = useState({ items: [], total_pages: 0 });
  const [loading, setLoading] = useState(true);

  // Отримуємо актуальні значення з URL
  const searchQuery = searchParams.get('search') || "";
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentLimit = Number(searchParams.get('limit')) || 8;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      // ТЕПЕР передаємо всі параметри з URL у функцію API
      const res = await fetchProducts(currentPage, currentLimit, searchQuery);
      
      setData(res);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    load();
    
    // Ефект спрацює щоразу, коли зміняться пошук, сторінка або ліміт в URL
  }, [searchQuery, currentPage, currentLimit]); 

  // Функція для зміни сторінки через URL (щоб FilterBar і Пагінація працювали синхронно)
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
    // Оскільки ми використовуємо searchParams у масиві залежностей useEffect, 
    // зміна URL автоматично запустить load().
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <FilterBar />

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {data.items.length > 0 ? (
          data.items.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          !loading && <p className="col-span-full text-center text-gray-500 py-10">Товарів не знайдено</p>
        )}
      </div>

      {/* Кнопки пагінації */}
      {data.total_pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-16">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all"
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
            className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </main>
  );
}