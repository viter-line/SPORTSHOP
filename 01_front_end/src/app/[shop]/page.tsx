'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchProducts } from '@/app/lib/api'; 
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

function ShopContent() {
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-purple-600">
          <Loader2 className="animate-spin" size={48} />
          <p className="font-black uppercase tracking-widest text-xs">Завантаження каталогу...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 transition-all">
            {data.items.length > 0 ? (
              data.items.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xl font-bold italic">Нічого не знайдено 🔍</p>
                <button 
                  onClick={() => router.push('/shop')}
                  className="mt-4 text-purple-600 font-black uppercase text-xs tracking-widest hover:underline"
                >
                  Скинути фільтри
                </button>
              </div>
            )}
          </div>

          {data.total_pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-4 rounded-2xl border border-gray-100 hover:bg-black hover:text-white disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: data.total_pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all shadow-sm ${
                    currentPage === i + 1
                      ? 'bg-black text-white scale-110'
                      : 'bg-white text-gray-400 hover:border-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === data.total_pages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-4 rounded-2xl border border-gray-100 hover:bg-black hover:text-white disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}