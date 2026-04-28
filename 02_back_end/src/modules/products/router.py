import math
from fastapi import APIRouter, Query, HTTPException, Depends
from modules.auth.dependencies import get_current_admin
from typing import List
from . import schemas, crud

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=schemas.ProductPaginationResponse)
def read_products(
    page: int = Query(1, ge=1),
    limit: int = Query(8, ge=1),
    category: str = "all",
    search: str = "",
    sort_by: str = "name" 
):
    items, total_count = crud.get_products(
        page=page, 
        limit=limit, 
        category=category, 
        search=search,
        sort_by=sort_by
    )
    
    total_pages = math.ceil(total_count / limit) if total_count > 0 else 0

    return {
        "items": items,
        "total_pages": total_pages
    }

@router.post("/", response_model=schemas.ProductResponse)
def add_product(product: schemas.ProductCreate, admin: dict = Depends(get_current_admin)):
    new_id = crud.create_product(product)
    if not new_id:
        raise HTTPException(status_code=400, detail="Не вдалося додати товар")
    return {**product.model_dump(), "id": new_id}


@router.put("/{product_id}", response_model=schemas.ProductResponse)
def edit_product(product_id: int, product: schemas.ProductCreate, admin: dict = Depends(get_current_admin)):
    success = crud.update_product(product_id, product)
    if not success:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return {**product.model_dump(), "id": product_id}


@router.delete("/{product_id}")
def remove_product(product_id: int, admin: dict = Depends(get_current_admin)):
    success = crud.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return {"message": f"Товар {product_id} успішно видалено"}

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def read_product(product_id: int):
    product = crud.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return product