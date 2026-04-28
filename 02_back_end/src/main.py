from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Імпортуємо роутер з нашого модуля auth
from modules.auth.router import router as auth_router
from modules.products.router import router as products_router

app = FastAPI(
    title="SportStore API",
    description="Backend для магазину спортивних товарів (Modular MVC)",
    version="1.0.0"
)

app.include_router(products_router)
app.include_router(auth_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "project": "SportStore API",
        "status": "online",
        "message": "Welcome! Use /docs for API documentation"
    }