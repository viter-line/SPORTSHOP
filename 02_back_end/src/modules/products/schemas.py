from pydantic import BaseModel
from typing import Optional, List

class ProductBase(BaseModel):
    name: str
    category: str
    size: str
    price: float
    rating: float
    image_url: str
    description: str
    in_stock: bool


class ProductCreate(BaseModel):
    name: str
    category: str
    size: str
    price: float
    rating: float
    image_url: str
    description: str
    in_stock: bool


class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

class ProductPaginationResponse(BaseModel):
    items: List[ProductResponse]
    total_pages: int