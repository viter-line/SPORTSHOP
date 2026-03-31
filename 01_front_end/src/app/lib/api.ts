export async function fetchProducts(
  page: number = 1, 
  limit: number = 8, 
  search: string = "", 
  category: string = ""
) {
  try {
    // Формуємо URL до нашого FastAPI бекенду
    const url = new URL('http://127.0.0.1:8000/api/products');
    
    // Додаємо обов'язкові параметри пагінації
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    // Додаємо необов'язковий пошук, якщо він не порожній
    if (search) {
      url.searchParams.append('search', search);
    }

    // Додаємо категорію, якщо вона вибрана і це не "all"
    if (category && category !== 'all') {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString(), { 
      cache: 'no-store' // Важливо для динамічних фільтрів, щоб дані не кешувалися старі
    });

    if (!response.ok) {
      console.error("Server responded with error:", response.status);
      return { items: [], total_pages: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error("API Error (fetchProducts):", error);
    return { items: [], total_pages: 0 };
  }
}