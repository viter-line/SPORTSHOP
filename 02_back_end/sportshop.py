from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


import schemas
import crud

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# вхід у адмінку
@app.post("/api/login")
async def login(request: schemas.LoginRequest):
    user = crud.authenticate_admin(request.username, request.password)
    if not user:  # перевіряємо наявність запису у бд
        raise HTTPException(status_code=401, detail="Невірний логін або пароль")
    return {"status": "success", "username": user['username']}

# пагінація сторінок 
@app.get("/api/products")
async def get_products(
    page: int = 1, 
    limit: int = 8, 
    search: str = "", 
    category: Optional[str] = None,
    sort_by: str = "name"
):
    offset = (page - 1) * limit
    items = crud.get_products_list(search, category, sort_by, limit, offset)
    total = crud.get_total_count(search, category)
    
    return {
        "items": items,
        "total_pages": (total + limit - 1) // limit
    }

# блок додавання товару
@app.post("/api/products")
async def add_product(product: schemas.ProductCreate):
    new_id = crud.create_product(product)
    return {"id": new_id, **product.model_dump()}

# блок оновлення товару
@app.put("/api/products/{product_id}")
async def edit_product(product_id: int, product: schemas.ProductCreate):
    if crud.update_product(product_id, product) == 0:  # перевіряємо наявність
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return {"status": "success"}

# блок видалення товару
@app.delete("/api/products/{product_id}")
async def remove_product(product_id: int):
    if crud.delete_product(product_id) == 0:  # перевіряємо наявність
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return {"message": "Товар видалено"}

# блок сторінки товару
@app.get("/api/products/{product_id}")
async def get_product_endpoint(product_id: int):
    product = crud.get_product_by_id(product_id)
    if not product: # перевіряємо наявність
        raise HTTPException(
            status_code=404, 
            detail=f"Товар з ID {product_id} не знайдено в базі"
        )
    return product
