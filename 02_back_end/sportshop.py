from fastapi import FastAPI
from pydantic import BaseModel 
import mysql.connector

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
async def get_products(page: int = 1, limit: int = 8, search: str = ""):
    # пропускуємо стільки рядків
    offset = (page - 1) * limit
    cursor = db.cursor(dictionary=True)
    
    # витягуємо стільки товарів
    query = "SELECT * FROM products WHERE name LIKE %s OR description LIKE %s LIMIT %s OFFSET %s"
    search_param = f"%{search}%"
    cursor.execute(query, (search_param, search_param, limit, offset))
    products = cursor.fetchall()
    
    # сторінок буде от стільки (правда ще момент - але з ним пізніше розберемось)
    count_query = "SELECT COUNT(*) as total FROM products WHERE name LIKE %s"
    cursor.execute(count_query, (search_param,))
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