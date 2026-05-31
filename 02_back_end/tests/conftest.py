# 02_back_end/src/tests/conftest.py
import sys
import os

# Отримуємо абсолютний шлях до папки 'src'
src_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../src'))

# Додаємо саме 'src' в sys.path
if src_path not in sys.path:
    sys.path.insert(0, src_path)

import pytest
from fastapi.testclient import TestClient

# Тепер Python спокійно знайде main, бо він шукає всередині папки src
from main import app 
from modules.auth.dependencies import get_current_admin

@pytest.fixture
def client():
    """Фікстура для клієнта тестування додатка FastAPI"""
    with TestClient(app) as tc:
        yield tc

@pytest.fixture
def mock_db(mocker):
    """Фікстура для підміни з'єднання з базою даних та курсора"""
    mock_pool = mocker.patch("database.connection_pool")
    mock_conn = mocker.MagicMock()
    mock_cursor = mocker.MagicMock()
    
    # Налаштовуємо ланцюжок: pool.get_connection() -> conn -> cursor() -> cursor
    mock_pool.get_connection.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor
    
    return {
        "pool": mock_pool,
        "conn": mock_conn,
        "cursor": mock_cursor
    }

@pytest.fixture
def authenticated_client(client):
    """Фікстура клієнта з перевизначеною (успішною) залежністю адміна"""
    # Підміняємо функцію get_current_admin, щоб вона просто повертала mock-користувача
    app.dependency_overrides[get_current_admin] = lambda: {"sub": "admin_test"}
    yield client
    # Очищуємо підміну після завершення тесту
    app.dependency_overrides.clear()