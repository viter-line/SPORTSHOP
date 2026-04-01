'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts, deleteProduct } from '@/app/lib/api';
import { Trash2, Edit2, Zap, LogOut } from 'lucide-react';
import Image from 'next/image';
import AddProductModal from '@/components/AddProductModal';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Новий стан!
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      router.push('/admin/login');
    } else {
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts(1, 100); 
    setProducts(data.items || []);
    setLoading(false);
  };

  // Відкриття для створення
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Відкриття для редагування
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex justify-between items-center mb-10 p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Склад</h1>
        <button onClick={handleAddNew} className="bg-purple-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">
          + Додати товар
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Товар</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product: any) => (
              <tr key={product.id} className="hover:bg-gray-50/10">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative border border-gray-100 rounded-lg overflow-hidden">
                      <Image src={product.image_url} alt="" fill sizes="48px" className="object-contain" />
                    </div>
                    <div className="font-black text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="p-6 text-right space-x-2">
                  {/* Кнопка Редагувати */}
                  <button onClick={() => handleEdit(product)} className="p-3 text-gray-300 hover:text-purple-600 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => {if(confirm('Видалити?')) deleteProduct(product.id).then(loadProducts)}} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadProducts}
        initialData={editingProduct} 
      />
    </main>
  );
}