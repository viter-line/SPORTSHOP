# 02_back_end/src/tests/test_products.py
import pytest

# --- ТЕСТИ ПУБЛІЧНИХ ЕНДПОІНТІВ ---

def test_read_products_empty(client, mock_db):
    """Тест отримання списку товарів, коли база порожня"""
    # Налаштовуємо імітацію відповідей бази даних
    # 1. Для SELECT COUNT(*)
    # 2. Для SELECT * FROM products
    mock_db["cursor"].fetchone.return_value = {"total": 0}
    mock_db["cursor"].fetchall.return_value = []

    response = client.get("/api/products/?page=1&limit=8")
    
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["items"] == []
    assert json_data["total_pages"] == 0

def test_read_products_with_data(client, mock_db):
    """Тест успішного завантаження товарів із пагінацією"""
    mock_db["cursor"].fetchone.return_value = {"total": 10}
    mock_db["cursor"].fetchall.return_value = [
        {
            "id": 1, "name": "Кросівки", "category": "shoes", "size": "42",
            "price": 2500.0, "rating": 4.8, "image_url": "http://img.com",
            "description": "Опис", "in_stock": True
        }
    ]

    response = client.get("/api/products/?page=1&limit=8")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Кросівки"
    assert data["total_pages"] == 2  # 10 товарів при ліміті 8 — це 2 сторінки

def test_read_single_product_not_found(client, mock_db):
    """Тест отримання товару, якого немає в базі"""
    mock_db["cursor"].fetchone.return_value = None

    response = client.get("/api/products/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Товар не знайдено"


# --- ТЕСТИ ЗАХИЩЕНИХ ЕНДПОІНТІВ (AUTH REQUIRED) ---

def test_delete_product_unauthorized(client):
    """Спроба видалення без токена має повернути 401"""
    response = client.delete("/api/products/1")
    assert response.status_code == 401
    assert response.json()["detail"] == "Токен відсутній"

def test_delete_product_success(authenticated_client, mock_db):
    """Успішне видалення з валідним токеном (використовуємо authenticated_client)"""
    # rowcount > 0 означає, що рядок успішно видалено
    mock_db["cursor"].rowcount = 1 

    response = authenticated_client.delete("/api/products/1")
    
    assert response.status_code == 200
    assert response.json() == {"message": "Товар 1 успішно видалено"}

def test_create_product_success(authenticated_client, mock_db):
    """Тест створення нового товару під адміном"""
    mock_db["cursor"].lastrowid = 42  # Новий згенерований ID в MySQL

    product_payload = {
        "name": "Штанга",
        "category": "heavy",
        "size": "20kg",
        "price": 4500.0,
        "rating": 5.0,
        "image_url": "http://image.com/barbell.png",
        "description": "Сталева штанга",
        "in_stock": True
    }

    response = authenticated_client.post("/api/products/", json=product_payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 42
    assert data["name"] == "Штанга"