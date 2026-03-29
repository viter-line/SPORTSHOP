import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/app/lib/api';

// Додаємо тип для params, оскільки це динамічний роут [shop]
export default async function HomePage({ params }: { params: { shop: string } }) {
  
  // Викликаємо функцію і ВІДРАЗУ гарантуємо, що це масив
  const data = await fetchProducts();
  const items = Array.isArray(data) ? data : [];

  return (
    <main className="max-w-7xl mx-auto px-6">
      <h1 className="text-2xl font-bold my-8 capitalize">Магазин:</h1>

      {/* Сітка товарів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
        {items.length > 0 ? (
          items.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center p-10 bg-gray-100 rounded-2xl">
            <p className="text-gray-500 font-medium">Товари не знайдені або помилка з'єднання з API</p>
          </div>
        )}
      </div>
    </main>
  );
}