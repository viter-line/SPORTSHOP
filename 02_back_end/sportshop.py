from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
import mysql.connector

from typing import Optional

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductBase(BaseModel):
    name: str
    category: str
    size: str
    price: float
    rating: float
    image_url: str
    description: str
    in_stock: bool

# БД
db = mysql.connector.connect(
    user = 'support',
    password = 'password123',
    host = 'localhost',
    database = 'sportshop'
)

# витягуємо продукти з БД (по кількості і опису)
@app.get("/api/products")
async def get_products(
    page: int = 1, 
    limit: int = 8, 
    search: str = "", 
    category: Optional[str] = None,
    sort_by: str = "name"
):
    offset = (page - 1) * limit
    cursor = db.cursor(dictionary=True)
    
    # Пошук + Категорія
    query = "SELECT * FROM products WHERE (name LIKE %s OR description LIKE %s)"
    params = [f"%{search}%", f"%{search}%"]

    if category and category != "all":
        query += " AND category = %s"
        params.append(category)

    # сортуємо за алфавітом, ціною, рейтингом
    sort_map = {
        "name": "ORDER BY name ASC",
        "price_asc": "ORDER BY price ASC",    
        "price_desc": "ORDER BY price DESC",  
        "rating": "ORDER BY rating DESC"      
    }
    
    # сорт за назвою
    order_clause = sort_map.get(sort_by, "ORDER BY name ASC")
    query += f" {order_clause}"

    # пагінація сторінок
    query += " LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    
    cursor.execute(query, tuple(params))
    products = cursor.fetchall()
    
    # кількість сторінок для пагінаці
    count_query = "SELECT COUNT(*) as total FROM products WHERE (name LIKE %s OR description LIKE %s)"
    count_params = [f"%{search}%", f"%{search}%"]
    if category and category != "all":
        count_query += " AND category = %s"
        count_params.append(category)
        
    cursor.execute(count_query, tuple(count_params))
    total_count = cursor.fetchone()['total']
    cursor.close()
    
    return {
        "items": products,
        "total_pages": (total_count + limit - 1) // limit
    }

# додаємо продукти до БД (Postman)
@app.post("/api/create_product")
async def create_product(product: ProductBase): 
    cursor = db.cursor()
    sql = """
        INSERT INTO products (name, category, size, price, rating, image_url, description, in_stock) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        product.name, product.category, product.size, product.price, 
        product.rating, product.image_url, product.description, product.in_stock
    )
    
    cursor.execute(sql, values)
    db.commit()
    
    cursor.close()
    return {"message": "Product created successfully!"}


# сторінка продукту
@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    cursor = db.cursor(dictionary=True)
    try:
        query = "SELECT * FROM products WHERE id = %s"
        cursor.execute(query, (product_id,))
        product = cursor.fetchone()
        
        if not product:
            raise HTTPException(status_code=404, detail="Товар не знайдено")
            
        return product
    finally:
        cursor.close()