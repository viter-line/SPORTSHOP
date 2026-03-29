'use client'

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/app/lib/api';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [data, setData] = useState({ items: [], total_pages: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchProducts(currentPage);
      setData(res);
      setLoading(false);
      // Скролимо вгору при зміні сторінки
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    load();
  }, [currentPage]); // Перезавантажуємо дані щоразу, коли змінюється сторінка

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <FilterBar />

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {data.items.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Кнопки пагінації */}
      <div className="flex justify-center items-center gap-3 mt-16">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        {Array.from({ length: data.total_pages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
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
          onClick={() => setCurrentPage(p => p + 1)}
          className="p-3 rounded-2xl border hover:bg-gray-50 disabled:opacity-20 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </main>
  );
}