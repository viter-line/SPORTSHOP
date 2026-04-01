'use client'

import { useState, useEffect } from 'react';
import { X, Star, Box, Tag, Info, Layers, DollarSign, Image as ImageIcon, ChevronDown, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import { createProduct, updateProduct } from '@/app/lib/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; // Дані для редагування
}

export default function AddProductModal({ isOpen, onClose, onSuccess, initialData }: ModalProps) {
  const [formData, setFormData] = useState({
    name: '', category: 'Спорядження', size: '', price: '', 
    rating: '5.0', image_url: '', description: '', in_stock: true
  });

  // Кожного разу при відкритті або зміні initialData оновлюємо форму
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Категорія',
        size: initialData.size || '',
        price: initialData.price?.toString() || '',
        rating: initialData.rating?.toString() || '5.0',
        image_url: initialData.image_url || '',
        description: initialData.description || '',
        in_stock: initialData.in_stock ?? true
      });
    } else {
      setFormData({ name: '', category: 'Спорядження', size: '', price: '', rating: '5.0', image_url: '', description: '', in_stock: true });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating)
    };
    
    // Вирішуємо, який метод API викликати
    const result = initialData 
      ? await updateProduct(initialData.id, payload)
      : await createProduct(payload);

    if (result) {
      onSuccess();
      onClose();
    }
  };

  const inputStyles = "w-full bg-white border border-gray-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 shadow-inner";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-gray-100 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-4 border-white animate-in zoom-in duration-200">
        
        <div className="p-8 border-b bg-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <PackageSearch size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {initialData ? 'Редагувати товар' : 'Новий товар'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600"><X size={28} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Назва</label>
              <input required className={inputStyles} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Категорія</label>
              <select className={inputStyles} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Взуття</option><option>Одяг</option><option>Аксесуари</option><option>Спорядження</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Розмір</label>
              <input required className={inputStyles} value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Ціна</label>
              <input required type="number" step="0.01" className={inputStyles} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 text-yellow-600">Рейтинг</label>
              <input required type="number" step="0.1" className={inputStyles} value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 text-blue-500">URL Фото</label>
              <input required className={inputStyles} value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              <div className="aspect-video bg-white rounded-2xl relative overflow-hidden border-2 border-dashed border-gray-200">
                {formData.image_url && <Image src={formData.image_url} alt="Pre" fill sizes="400px" className="object-contain p-2" />}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Опис</label>
              <textarea required rows={8} className={`${inputStyles} resize-none`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-purple-600 transition-all">
            {initialData ? 'Оновити дані' : 'Зберегти товар'}
          </button>
        </form>
      </div>
    </div>
  );
}