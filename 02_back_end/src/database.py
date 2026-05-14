import mysql.connector
import os
from dotenv import load_dotenv
from mysql.connector import pooling


load_dotenv()


DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT", "22745") 


db_config = {
    "host": DB_HOST,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "port": DB_PORT
}


if os.getenv("DATABASE_SSL") == "true":
    db_config["ssl_disabled"] = False
    

try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="sport_pool",
        pool_size=5,
        **db_config
    )
    print("Pool підключення до MySQL створено успішно")
except mysql.connector.Error as err:
    print(f"Помилка при створенні пулу: {err}")

def get_db_connection():
    """Отримує з'єднання з пулу (ефективніше за нове підключення)"""
    try:
        return connection_pool.get_connection()
    except mysql.connector.Error:
        
        return mysql.connector.connect(**db_config)