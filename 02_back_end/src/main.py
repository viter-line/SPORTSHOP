import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from modules.auth.router import router as auth_router
from modules.products.router import router as products_router
from modules.chat.router import router as chat_router

app = FastAPI(
    title="SportStore API",
    description="Backend для магазину спортивних товарів (Modular MVC)",
    version="1.0.0"
)

app.include_router(products_router)
app.include_router(auth_router)

origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(products_router)
app.include_router(
    chat_router,
    prefix="/api/v1/chat",  
    tags=["Чат"]            
)

@app.get("/")
def root():
    return {
        "project": "SportStore API",
        "status": "online",
        "message": "Welcome! Use /docs for API documentation"
    }