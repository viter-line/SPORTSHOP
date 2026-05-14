'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronDown, ListFilter } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';

function FilterBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        updateFilters('search', searchTerm);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); 
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
      <div className="flex-1 min-w-[250px]">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1">
          Пошук товару
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Назва або бренд..."
            value={searchTerm}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all text-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1">
          Категорія
        </label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 cursor-pointer text-black"
            value={searchParams.get('category') || 'all'}
            onChange={(e) => updateFilters('category', e.target.value)}
          >
            <option value="all">Усі товари</option>
            <option value="взуття">Взуття</option>
            <option value="одяг">Одяг</option>
            <option value="спорядження">Спорядження</option>
            <option value="аксесуари">Аксесуари</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="w-full sm:w-56">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1">
          Сортувати за
        </label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 cursor-pointer text-black"
            value={searchParams.get('sort_by') || 'name'}
            onChange={(e) => updateFilters('sort_by', e.target.value)}
          >
            <option value="name">Назва (А-Я)</option>
            <option value="price_asc">Ціна: від дешевих</option>
            <option value="price_desc">Ціна: від дорогих</option>
            <option value="rating">Рейтинг</option>
          </select>
          <ListFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="w-24">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1 text-center">
          Показати
        </label>
        <select 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 outline-none focus:border-purple-400 text-center text-black"
          value={searchParams.get('limit') || '8'}
          onChange={(e) => updateFilters('limit', e.target.value)}
        >
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </div>
    </div>
  );
}

// Огортаємо в Suspense, щоб Next міг зібрати білд
export default function FilterBar() {
    return (
        <Suspense fallback={<div className="h-24 bg-gray-50 animate-pulse rounded-2xl" />}>
            <FilterBarContent />
        </Suspense>
    );
}