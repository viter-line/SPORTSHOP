from database import get_db_cursor, commit_db

# запит для адмінки
def authenticate_admin(username, password):
    cursor = get_db_cursor(dictionary=True)
    query = "SELECT id, username FROM admins WHERE BINARY username = %s AND BINARY password = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    cursor.close()
    return user

# список товарів (по пошуку, категорії, сортуванню, кількості відображення)
def get_products_list(search, category, sort_by, limit, offset):
    cursor = get_db_cursor(dictionary=True)
    query = "SELECT * FROM products WHERE (name LIKE %s OR description LIKE %s)"
    params = [f"%{search}%", f"%{search}%"]

    if category and category != "all": #якщо фільтр по категорії
        query += " AND category = %s"
        params.append(category)

    sort_map = {  # сортування
        "name": "ORDER BY name ASC",  # по алфавіту
        "price_asc": "ORDER BY price ASC",     # по ціні зростання 
        "price_desc": "ORDER BY price DESC",   # по ціні спадання
        "rating": "ORDER BY rating DESC"       # по рейтингу
    }
    query += f" {sort_map.get(sort_by, 'ORDER BY name ASC')} LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    
    cursor.execute(query, tuple(params))
    items = cursor.fetchall()
    cursor.close()
    return items

 # сторінка товару
def get_product_by_id(product_id: int):
    cursor = get_db_cursor(dictionary=True)
    try:
        query = "SELECT * FROM products WHERE id = %s"
        cursor.execute(query, (product_id,))
        product = cursor.fetchone()
        return product
    except Exception as e:
        print(f"Помилка при отриманні товару {product_id}: {e}")
        return None
    finally:
        cursor.close()

 # по пошуку чи категорії
def get_total_count(search, category):
    cursor = get_db_cursor(dictionary=True)
    query = "SELECT COUNT(*) as total FROM products WHERE (name LIKE %s OR description LIKE %s)"
    params = [f"%{search}%", f"%{search}%"]
    if category and category != "all":
        query += " AND category = %s"
        params.append(category)
    cursor.execute(query, tuple(params))
    result = cursor.fetchone()['total']
    cursor.close()
    return result

 # створення товару
def create_product(product_data):
    cursor = get_db_cursor()
    sql = """
        INSERT INTO products (name, category, size, price, rating, image_url, description, in_stock) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        product_data.name, product_data.category, product_data.size, product_data.price, 
        product_data.rating, product_data.image_url, product_data.description, product_data.in_stock
    )
    cursor.execute(sql, values)
    commit_db()
    new_id = cursor.lastrowid
    cursor.close()
    return new_id

 # оновлення товару
def update_product(product_id, product_data):
    cursor = get_db_cursor()
    sql = """
        UPDATE products 
        SET name=%s, category=%s, size=%s, price=%s, rating=%s, image_url=%s, description=%s, in_stock=%s
        WHERE id=%s
    """
    values = (*product_data.dict().values(), product_id)
    cursor.execute(sql, values)
    commit_db()
    affected = cursor.rowcount
    cursor.close()
    return affected

 # видалення товару
def delete_product(product_id):
    cursor = get_db_cursor()
    cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
    commit_db()
    affected = cursor.rowcount
    cursor.close()
    return affected