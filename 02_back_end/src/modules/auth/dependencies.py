from fastapi import Header, HTTPException, Depends
from .utils import verify_token

def get_current_admin(authorization: str = Header(None)):
    """Перевіряє Token у заголовку Authorization"""
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Токен відсутній")
    
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(status_code=401, detail="Невалідний або протермінований токен")
    
    return payload # Повертає дані адміна з токена