'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Trash2, Edit, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Product } from '../types';
// Створіть окремо fetch function для адміна
// import { fetchAdminProducts, deleteProduct } from '@/lib/api'; 

export default function AdminDashboardPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Тут має бути перевірка токена та завантаження товарів
        // const token = localStorage.getItem('admin_token');
        // if (!token) { router.push('/admin/login'); return; }
        // loadProducts(token);
        
        // Приклад моку
        setProducts([
            { id: '1', name: 'Premium Dumbbells', price: 159.99, rating: 4.8, category: 'fitness', image_url: '/dummy/dumb.jpg', description: '...', in_stock: true},
            { id: '2', name: 'Basketball', price: 49.99, rating: 4.6, category: 'equipment', image_url: '/dummy/ball.jpg', description: '...', in_stock: false}
        ]);
        setLoading(false);
    }, [router]);

    const handleDelete = async (id: string) => {
        if (!confirm('Ви дійсно хочете видалити цей товар?')) return;
        // const token = localStorage.getItem('admin_token');
        // await deleteProduct(token, id);
        setProducts(products.filter(p => p.id !== id));
    }

    return (
        <main className="p-8">
            <div className="flex items-center justify-between gap-4 border-b pb-6 mb-8">
                <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-3">
                    <LayoutDashboard size={28} className="text-purple-600" /> Управління товарами
                </h1>
                <button className="flex items-center gap-2.5 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition">
                    <PlusCircle size={20} /> Створити товар
                </button>
            </div>

            {loading ? <p>Завантаження...</p> : (
                <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
                    {/* Таблиця товарів */}
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Зображення</th>
                                <th className="px-6 py-4">Назва</th>
                                <th className="px-6 py-4">Категорія</th>
                                <th className="px-6 py-4 text-right">Ціна</th>
                                <th className="px-6 py-4 text-center">Статус</th>
                                <th className="px-6 py-4 text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-mono">{product.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative h-12 w-16 rounded overflow-hidden">
                                            <Image src={product.image_url} alt={product.name} fill className="object-cover"/>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-right font-bold">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {product.in_stock ? (
                                            <span className="flex items-center justify-center gap-1.5 text-xs text-green-700 font-semibold bg-green-100 px-2.5 py-1 rounded-full"><CheckCircle size={14}/>В наявності</span>
                                        ) : (
                                            <span className="text-xs text-red-700 font-semibold bg-red-100 px-2.5 py-1 rounded-full">Немає</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-gray-500 hover:text-purple-600 rounded-lg hover:bg-gray-100">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-100">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}