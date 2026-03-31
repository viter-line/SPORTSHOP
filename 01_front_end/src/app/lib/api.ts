// Додаємо п'ятий параметр sort_by
export async function fetchProducts(
  page: number = 1, 
  limit: number = 8, 
  search: string = "", 
  category: string = "",
  sort_by: string = "name" // ПЕРЕКОНАЙТЕСЯ, ЩО ЦЕЙ РЯДОК Є
) {
  try {
    const url = new URL('http://127.0.0.1:8000/api/products');
    
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    if (search) url.searchParams.append('search', search);
    if (category && category !== 'all') url.searchParams.append('category', category);
    
    // ПЕРЕДАЄМО параметр сортування на бекенд
    if (sort_by) url.searchParams.append('sort_by', sort_by);

    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) return { items: [], total_pages: 0 };
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { items: [], total_pages: 0 };
  }
}