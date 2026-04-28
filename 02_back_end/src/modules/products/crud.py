from database import get_db_connection
from . import schemas

def get_products(page: int, limit: int, category: str = None, search: str = None, sort_by: str = "name"):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        
        count_query = "SELECT COUNT(*) as total FROM products WHERE 1=1"
        params = []
        if category and category != "all":
            count_query += " AND category = %s"
            params.append(category)
        if search:
            count_query += " AND name LIKE %s"
            params.append(f"%{search}%")
        
        cursor.execute(count_query, tuple(params))
        total_count = cursor.fetchone()['total']

        
        sort_options = {
            "name": "name ASC",
            "price_asc": "price ASC",
            "price_desc": "price DESC",
            "rating": "rating DESC"
        }
        order_clause = sort_options.get(sort_by, "name ASC")

        
        offset = (page - 1) * limit
        data_query = f"SELECT * FROM products WHERE 1=1"
        
        if category and category != "all":
            data_query += " AND category = %s"
        if search:
            data_query += " AND name LIKE %s"
        
        
        data_query += f" ORDER BY {order_clause} LIMIT %s OFFSET %s"
        
        final_params = params + [limit, offset]
        cursor.execute(data_query, tuple(final_params))
        items = cursor.fetchall()

        return items, total_count
    finally:
        cursor.close()
        conn.close()


def get_product_by_id(product_id: int):
    """Отримує дані одного товару за його ID"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM products WHERE id = %s"
        cursor.execute(query, (product_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

def create_product(product_data: schemas.ProductCreate):
    """Додає новий товар у базу даних"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO products (name, category, size, price, rating, image_url, description, in_stock)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            product_data.name, 
            product_data.category, 
            product_data.size,
            product_data.price, 
            product_data.rating, 
            product_data.image_url,
            product_data.description,
            product_data.in_stock
        )
        cursor.execute(query, values)
        conn.commit()
        return cursor.lastrowid  
    finally:
        cursor.close()
        conn.close()

def update_product(product_id: int, product_data: schemas.ProductCreate):
    """Оновлює існуючий товар за його ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            UPDATE products 
            SET name=%s, category=%s, size=%s, price=%s, rating=%s, image_url=%s, description=%s, in_stock=%s
            WHERE id=%s
        """
        values = (
            product_data.name, 
            product_data.category, 
            product_data.size,
            product_data.price, 
            product_data.rating, 
            product_data.image_url,
            product_data.description,
            product_data.in_stock, 
            product_id
        )
        cursor.execute(query, values)
        conn.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        conn.close()

def delete_product(product_id: int):
    """Видаляє товар з бази даних"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = "DELETE FROM products WHERE id = %s"
        cursor.execute(query, (product_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        conn.close()