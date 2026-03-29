'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronDown, ListFilter } from 'lucide-react';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Функція для оновлення URL параметрів без перезавантаження сторінки
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Скидаємо сторінку на 1 при зміні фільтрів
    params.set('page', '1'); 
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
      
      {/* 1. Пошук за назвою */}
      <div className="flex-1 min-w-[250px]">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1">
          Пошук товару
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Назва або бренд..."
            defaultValue={searchParams.get('search') || ''}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
            onChange={(e) => updateFilters('search', e.target.value)}
          />
        </div>
      </div>

      {/* 2. Фільтр за категорією */}
      <div className="w-full sm:w-48">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1">
          Категорія
        </label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 cursor-pointer"
            value={searchParams.get('category') || 'all'}
            onChange={(e) => updateFilters('category', e.target.value)}
          >
            <option value="all">Усі товари</option>
            <option value="shoes">Взуття</option>
            <option value="clothing">Одяг</option>
            <option value="equipment">Спорядження</option>
            <option value="accessories">Аксесуари</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* 3. Сортування */}
      <div className="w-full sm:w-56">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1">
          Сортувати за
        </label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 cursor-pointer"
            value={searchParams.get('sort_by') || 'name'}
            onChange={(e) => updateFilters('sort_by', e.target.value)}
          >
            <option value="name">Назва (А-Я)</option>
            <option value="price_asc">Розмір</option>
            <option value="price_asc">Ціна: від дешевих</option>
            <option value="price_desc">Ціна: від дорогих</option>
            <option value="rating">Рейтинг</option>
            <option value="stock">Наявність</option>
          </select>
          <ListFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* 4. Кількість на сторінці */}
      <div className="w-24">
        <label className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2 block ml-1 text-center">
          Показати
        </label>
        <select 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 outline-none focus:border-purple-400 text-center"
          value={searchParams.get('limit') || '12'}
          onChange={(e) => updateFilters('limit', e.target.value)}
        >
          <option value="12">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>

    </div>
  );
}