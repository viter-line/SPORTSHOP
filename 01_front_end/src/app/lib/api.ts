export async function fetchProducts(page: number = 1, limit: number = 8, search: string = "") {
  try {
    // Формуємо URL з query-параметрами
    const url = new URL('http://127.0.0.1:8000/api/products');
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (search) url.searchParams.append('search', search);

    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) return { items: [], total_pages: 0 };
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { items: [], total_pages: 0 };
  }
}