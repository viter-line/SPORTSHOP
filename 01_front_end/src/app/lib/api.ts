// src/lib/api.ts

const API_URL = "http://127.0.0.1:8000/api";

/**
 * Отримання списку товарів з пагінацією та фільтрацією
 */

export async function loginUser(credentials: any) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}


export async function fetchProducts(
  page: number = 1, 
  limit: number = 8, 
  search: string = "", 
  category: string = "all",
  sort_by: string = "name"
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: search,
      category: category,
      sort_by: sort_by
    });

    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
      cache: 'no-store' // Щоб завжди отримувати свіжі дані з бази
    });

    if (!res.ok) throw new Error('Помилка при завантаженні товарів');
    return await res.json();
  } catch (error) {
    console.error("Помилка API (fetchProducts):", error);
    return { items: [], total_pages: 0 };
  }
}

/**
 * Отримання одного товару за його ID
 */
export async function fetchProductById(id: string | number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Помилка API (fetchProductById ${id}):`, error);
    return null;
  }
}

/**
 * Створення нового товару (Використовується в адмінці)
 */
export async function createProduct(productData: any) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Переконуємося, що дані йдуть як чистий JSON
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (!res.ok) {
      // Виводимо детальну помилку від FastAPI (наприклад, помилку валідації 422)
      console.error("Деталі помилки від сервера:", data.detail);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Критична помилка при відправці (createProduct):", error);
    return null;
  }
}

/**
 * Видалення товару за ID (Використовується в адмінці)
 */
export async function deleteProduct(id: number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Не вдалося видалити товар:", errorData.detail);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Помилка при видаленні (deleteProduct):", error);
    return false;
  }
}

/**
 * Оновлення існуючого товару (CRUD: Update)
 */
export async function updateProduct(id: number, productData: any) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Помилка при оновленні (updateProduct):", error);
    return null;
  }
}