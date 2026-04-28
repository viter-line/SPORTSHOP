from fastapi import APIRouter, HTTPException
from . import schemas, crud
from .utils import create_access_token

router = APIRouter(prefix="/api", tags=["Authentication"])


@router.post("/login")
def login(data: schemas.LoginRequest):
    admin = crud.verify_admin(data.username, data.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Невірний логін або пароль")
    
    # Токен
    access_token = create_access_token(data={"sub": admin["username"]})
    
    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "username": admin["username"]
    }