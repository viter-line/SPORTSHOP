import mysql.connector
import os
from dotenv import load_dotenv
from mysql.connector import pooling

load_dotenv()


db_config = {
    "host": "localhost",
    "user": "support",
    "password": "password123",
    "database": "sportshop"
}


try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="sport_pool",
        pool_size=5, # Кількість одночасних з'єднань
        **db_config
    )
    print("Pool підключення до MySQL створено успішно")
except mysql.connector.Error as err:
    print(f"Помилка при створенні пулу: {err}")

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )