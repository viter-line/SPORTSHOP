export async function fetchProducts(page: number = 1, limit: number = 8) {
  try {
    // Додаємо query-параметри до запиту
    const response = await fetch(`http://127.0.0.1:8000/api/products?page=${page}&limit=${limit}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return { items: [], total_pages: 0 };
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { items: [], total_pages: 0 };
  }
}