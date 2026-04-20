from pydantic import BaseModel

# клас моделі логін та паролю адмінки
class LoginRequest(BaseModel):
    username: str
    password: str

# клас моделі властивостей товару
class ProductCreate(BaseModel):
    name: str
    category: str
    size: str
    price: float
    rating: float
    image_url: str
    description: str
    in_stock: bool