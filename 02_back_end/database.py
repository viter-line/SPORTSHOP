import mysql.connector

# підключення до бд
db = mysql.connector.connect(
    user = 'support',
    password = 'password123',
    host = 'localhost',
    database = 'sportshop'
)

# перевірка наявності підключення
def get_db_cursor(dictionary=True):
    if not db.is_connected():
        db.reconnect()
    return db.cursor(dictionary=dictionary)

def commit_db():
    db.commit()