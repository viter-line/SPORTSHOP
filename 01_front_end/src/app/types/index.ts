export interface Product {
  id: number;
  name: string;
  category: string;
  size: string; // Додаємо цей параметр
  price: number;
  rating: number;
  image_url: string;
  description: string;
  in_stock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}