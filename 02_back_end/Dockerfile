FROM python:3.11-slim

# Встановлюємо системні залежності для компіляції пакетів (наприклад, для бази даних)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmariadb-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копіюємо та встановлюємо залежності Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо всі файли проекту (включаючи вашу папку src)
COPY . .

EXPOSE 8000

# Запуск Uvicorn. Зверніть увагу на src.main:app та прапорець --reload
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]