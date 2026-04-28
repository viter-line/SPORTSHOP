from database import get_db_connection

def verify_admin(username, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    
    print(f"--- DEBUG AUTH ---")
    print(f"Шукаємо: '{username}' з паролем: '{password}'")
    
    try:
        
        query = "SELECT * FROM admins WHERE username = %s"
        cursor.execute(query, (username,))
        admin = cursor.fetchone()
        
        if not admin:
            print(f"РЕЗУЛЬТАТ: Користувача '{username}' взагалі не знайдено в базі!")
            return None
        
        print(f"Знайдено в базі: '{admin['username']}'")
        print(f"Пароль у базі: '{admin['password']}'")
        
        if admin['password'] == password:
            print("РЕЗУЛЬТАТ: Паролі збіглися!")
            return admin
        else:
            print("РЕЗУЛЬТАТ: Паролі НЕ збіглися!")
            return None
    finally:
        cursor.close()
        conn.close()