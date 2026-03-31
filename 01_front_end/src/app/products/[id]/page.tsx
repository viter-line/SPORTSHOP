import { fetchProductById } from '@/app/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton'; // Створимо цей компонент нижче

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await fetchProductById(resolvedParams.id);

  if (!product) {
    return <div className="py-20 text-center font-black uppercase">Товар не знайдено</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-black mb-10 transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">
        <ChevronLeft size={16} /> Назад до магазину
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Фото */}
        <div className="relative aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100">
          <Image 
            src={product.image_url || 'https://images.pexels.com/photos/949129/pexels-photo-949129.jpeg'} 
            alt={product.name}
            fill
            // Додаємо sizes: на мобільних 100% ширини, на десктопах близько 50% (оскільки дві колонки)
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-contain p-12 group-hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>

        {/* Контент */}
        <div className="flex flex-col pt-4">
          <span className="px-4 py-1.5 bg-purple-50 text-purple-600 font-black uppercase tracking-[0.2em] text-[10px] rounded-full border border-purple-100 w-fit mb-6">
            {product.category}
          </span>
          <h1 className="text-5xl font-black text-gray-950 mb-6 leading-tight">{product.name}</h1>
          <div className="text-6xl font-black text-gray-950 mb-10 tracking-tighter font-mono">₴{product.price}</div>
          
          <p className="text-gray-500 mb-10 text-lg leading-relaxed font-medium">
            {product.description}
          </p>

          {/* ВИКЛИК КНОПКИ ДОДАВАННЯ */}
          <AddToCartButton product={product} />
          
          <div className="mt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star size={14} fill="currentColor" /> {product.rating} Рейтинг
            </div>
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
            <div className="text-green-500 italic">Безкоштовна доставка від 2000 грн</div>
          </div>
        </div>
      </div>
    </main>
  );
}