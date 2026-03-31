/**
 * Функція для отримання списку товарів з фільтрацією, пошуком, сортуванням та пагінацією.
 * Використовується на головній сторінці (каталозі).
 */
export async function fetchProducts(
  page: number = 1, 
  limit: number = 8, 
  search: string = "", 
  category: string = "",
  sort_by: string = "name"
) {
  try {
    const url = new URL('http://127.0.0.1:8000/api/products');
    
    // Додаємо обов'язкові параметри пагінації
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    // Додаємо пошуковий запит, якщо він переданий
    if (search) {
      url.searchParams.append('search', search);
    }

    // Додаємо категорію, якщо вибрано щось крім "all"
    if (category && category !== 'all') {
      url.searchParams.append('category', category);
    }

    // Додаємо параметр сортування
    if (sort_by) {
      url.searchParams.append('sort_by', sort_by);
    }

    const response = await fetch(url.toString(), { 
      cache: 'no-store' // Вимикаємо кешування для отримання завжди актуальних даних
    });

    if (!response.ok) {
      console.error(`Помилка API (список): ${response.status}`);
      return { items: [], total_pages: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error("Критична помилка fetchProducts:", error);
    return { items: [], total_pages: 0 };
  }
}

/**
 * Функція для отримання детальної інформації про ОДИН товар за його ID.
 * Використовується на динамічній сторінці товару /products/[id].
 */
export async function fetchProductById(id: string) {
  try {
    // Звертаємося до конкретного ендпоінту бекенду
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Товар з ID ${id} не знайдено в базі даних.`);
      } else {
        console.error(`Помилка API (деталі): ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Критична помилка fetchProductById:", error);
    return null;
  }
}