// src/lib/api.ts

const API_URL = "http://localhost:8000/api";

/**
 * Хелпер для безпечного отримання чистого JWT-токена
 */
function getCleanToken(): string {
  const rawToken = localStorage.getItem('token');
  if (!rawToken) {
    return ""; 
  }

  if (rawToken.startsWith('{') || rawToken.startsWith('"')) {
    try {
      const parsed = JSON.parse(rawToken);
      return parsed.access_token || parsed.token || rawToken;
    } catch (e) {
      return rawToken;
    }
  }
  return rawToken;
}

/**
 * Авторизація користувача (отримання токена)
 */
export async function loginUser(credentials: any) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) return null;
    const data = await res.json();
    
    // Автоматично зберігаємо токен у Local Storage при успішному вході
    if (data) {
      const tokenValue = data.access_token || data.token;
      if (tokenValue) {
        localStorage.setItem('token', tokenValue);
      }
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

/**
 * Отримання списку товарів з пагінацією та фільтрацією
 */
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
      cache: 'no-store'
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Бекенд повернув помилку ${res.status}:`, errText);
      throw new Error('Помилка при завантаженні товарів');
    }

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
    const token = getCleanToken();

    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Деталі помилки від сервера:", data?.detail || data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Критична помилка при відправці (createProduct):", error);
    return null;
  }
}

/**
 * Видалення товару за ID (Використовусь в адмінці)
 */
export async function deleteProduct(id: number) {
  try {
    const token = getCleanToken();

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Не вдалося видалити товар:", errorData?.detail || errorData);
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
    const token = getCleanToken();

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Не вдалося оновити товар:", data?.detail || data);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Помилка при оновленні (updateProduct):", error);
    return null;
  }
}