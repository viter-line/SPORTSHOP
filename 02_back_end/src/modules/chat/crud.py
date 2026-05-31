from database import get_db_connection

def save_message(sender_id: str, recipient_id: str, text: str):
    """Зберігає повідомлення в базу даних"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO chat_messages (sender_id, recipient_id, text, is_read)
            VALUES (%s, %s, %s, 0)
        """
        cursor.execute(query, (sender_id, recipient_id, text))
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()

def get_chat_history(client_id: str):
    """месседжі від клієнта до адміна"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT sender_id, recipient_id, text, created_at, is_read 
            FROM chat_messages 
            WHERE (sender_id = %s AND recipient_id = 'admin')
               OR (sender_id = 'admin' AND recipient_id = %s)
            ORDER BY created_at ASC
        """
        cursor.execute(query, (client_id, client_id))
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

def get_active_chats_for_admin():
    """список активних чатів із прапорцем наявності нових повідомлень"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT m1.sender_id, m1.recipient_id, m1.is_read
            FROM chat_messages m1
            INNER JOIN (
                SELECT 
                    IF(sender_id = 'admin', recipient_id, sender_id) AS client_id,
                    MAX(id) AS max_id
                FROM chat_messages
                GROUP BY client_id
            ) m2 ON m1.id = m2.max_id
            ORDER BY m1.id DESC
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            client_id = row['recipient_id'] if row['sender_id'] == 'admin' else row['sender_id']
            
            # Індикатор активний, тільки якщо повідомлення від клієнта і воно НЕ прочитане
            has_new = (row['sender_id'] != 'admin') and (row['is_read'] == 0)
            
            result.append({
                "client_id": client_id,
                "has_new": has_new
            })
            
        return result
    finally:
        cursor.close()
        conn.close()

def mark_messages_as_read(client_id: str):
    """Позначає всі повідомлення від конкретного клієнта як прочитані менеджером"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            UPDATE chat_messages 
            SET is_read = 1 
            WHERE sender_id = %s AND recipient_id = 'admin' AND is_read = 0
        """
        cursor.execute(query, (client_id,))
        conn.commit()
        return True
    except Exception as e:
        print(f"Помилка оновлення статусу в CRUD: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def get_unanswered_chats_count():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT COUNT(DISTINCT sender_id) as unanswered_count
            FROM chat_messages
            WHERE sender_id != 'admin' AND recipient_id = 'admin' AND is_read = 0
        """
        cursor.execute(query)
        result = cursor.fetchone()
        return result['unanswered_count'] if result else 0
    finally:
        cursor.close()
        conn.close()