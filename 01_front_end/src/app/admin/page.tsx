'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts, deleteProduct } from '@/app/lib/api';
import { Trash2, Edit2, Zap, LogOut, MessageSquare, ArrowLeft, Search } from 'lucide-react';
import Image from 'next/image';
import AddProductModal from '@/components/AddProductModal';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
  
  const ws = useRef<WebSocket | null>(null);

  const BACKEND_CHAT_COUNT_URL = "http://0.0.0.0:8000/api/v1/chat/ws/admin/unanswered-count";
  const BACKEND_WS_URL = "ws://0.0.0.0:8000/api/v1/chat/ws/admin";

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(BACKEND_CHAT_COUNT_URL);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error("Не вдалося завантажити лічильник чату:", err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      router.push('/admin/login');
    } else {
      loadProducts();
      fetchUnreadCount();

      ws.current = new WebSocket(BACKEND_WS_URL);

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.sender_id !== 'admin') {
            setUnreadCount((prev) => prev + 1);
          }
        } catch (err) {
          console.error("Помилка обробки WebSocket сповіщення:", err);
        }
      };

      return () => {
        ws.current?.close();
      };
    }
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts(1, 100); 
    setProducts(data.items || []);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
      deleteProduct(productId).then(loadProducts);
    }
  };

  // Розрахунок кількості товарів за категоріями
  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {
      "ВЗУТТЯ": 0,
      "ОДЯГ": 0,
      "СПОРЯДЖЕННЯ": 0,
      "АКСЕСУАРИ": 0
    };
    
    products.forEach((product) => {
      const rawCategory = product.category || product.category_name || "";
      const cleanCategory = rawCategory.trim().toUpperCase();
      
      if (cleanCategory in stats) {
        const count = Number(product.stock) || Number(product.quantity) || 1;
        stats[cleanCategory] += count;
      }
    });

    return Object.entries(stats);
  };

  const categoryStats = getCategoryStats();

  // Логіка фільтрації товарів за назвою
  const filteredProducts = products.filter((product) => {
    if (!product.name) return false;
    
    const productNameClean = product.name.toLowerCase();
    const searchClean = searchQuery.toLowerCase().trim();
    
    if (!searchClean) return true;
    
    const searchWords = searchClean.split(/\s+/);
    return searchWords.every(word => productNameClean.includes(word));
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      
      {/* Шапка панелі з категоріями */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
        
        {/* Заголовок та кнопка "Повернутися назад" */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Склад</h1>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-600 transition-colors w-fit"
          >
            <ArrowLeft size={12} />
            Повернутися назад
          </button>
        </div>

        {/* Стовпчик категорій праворуч від слова СКЛАД */}
        <div className="flex-1 max-w-md md:ml-10 bg-gray-50/50 border border-gray-100 rounded-2xl p-4 w-full">
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
            Категорії товарів
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {categoryStats.map(([category, count]) => (
              <div key={category} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-xl border border-gray-50 text-xs font-bold">
                <span className="text-gray-900 font-black tracking-tight truncate mr-4">{category}</span>
                <span className="font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md min-w-[2rem] text-center">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Кнопки керування */}
        <div className="flex items-center gap-4 self-end md:self-center whitespace-nowrap">
          <button 
            onClick={() => router.push('/admin/chat')} 
            className="relative p-4 bg-gray-50 text-gray-900 border border-gray-100 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all group shadow-sm"
            title="Чат з клієнтами"
          >
            <MessageSquare size={20} className="group-hover:scale-105 transition-transform" />
            
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] w-5 h-5 flex items-center justify-center rounded-full shadow-md border border-white z-10">
                  {unreadCount}
                </span>
              </>
            )}
          </button>

          <button onClick={handleAddNew} className="bg-purple-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">
            + Додати товар
          </button>
        </div>
      </div>

      {/* Поле пошуку товарів */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Пошук товару за назвою чи ключовими словами..."
          className="w-full pl-12 pr-6 py-4 border border-gray-100 bg-white rounded-2xl text-sm font-bold text-black focus:outline-none focus:border-purple-600 transition-all shadow-sm placeholder-gray-400"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-600 transition-colors"
          >
            Очистити
          </button>
        )}
      </div>

      {/* Таблиця складу */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Товар</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-10 text-center text-sm font-bold text-gray-400">
                  Товарів за вашим запитом не знайдено
                </td>
              </tr>
            ) : (
              filteredProducts.map((product: any) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {/* Клікнувши на цю зону, відкривається картка перегляду/редагування параметрів */}
                  <td 
                    onClick={() => handleEdit(product)} 
                    className="p-6 cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative border border-gray-100 rounded-lg overflow-hidden bg-white group-hover:scale-105 transition-transform">
                        <Image src={product.image_url} alt="" fill sizes="48px" className="object-contain" />
                      </div>
                      <div className="font-black text-gray-900 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  
                  {/* Окрема зона для швидких дій справа */}
                  <td className="p-6 text-right space-x-2 whitespace-nowrap w-40">
                    <button 
                      onClick={() => handleEdit(product)} 
                      className="p-3 text-gray-300 hover:text-purple-600 transition-colors"
                      title="Редагувати параметри"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                      title="Видалити товар"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
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