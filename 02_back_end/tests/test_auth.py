# 02_back_end/src/tests/test_auth.py
import pytest

def test_login_success(client, mock_db, mocker):
    """Тест успішного входу адміністратора та генерації JWT токена"""
    # Імітуємо, що адміна знайдено в БД з таким самим паролем
    mock_db["cursor"].fetchone.return_value = {
        "username": "admin",
        "password": "secretpassword"
    }
    
    # Мокаємо змінні оточення, щоб utils.py не впав без .env секретів
    mocker.patch("os.getenv", side_effect=lambda key, default=None: {
        "SECRET_KEY": "super_secret_for_testing",
        "ALGORITHM": "HS256",
        "ACCESS_TOKEN_EXPIRE_MINUTES": "15"
    }.get(key, default))

    login_data = {
        "username": "admin",
        "password": "secretpassword"
    }

    response = client.post("/api/login", json=login_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["username"] == "admin"

def test_login_wrong_credentials(client, mock_db):
    """Тест відмови у вході при невірному паролі або логіні"""
    # База повернула None (користувача немає)
    mock_db["cursor"].fetchone.return_value = None

    login_data = {
        "username": "hacker",
        "password": "wrong_password"
    }

    response = client.post("/api/login", json=login_data)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Невірний логін або пароль"