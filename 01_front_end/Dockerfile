FROM node:20-alpine

WORKDIR /app

# Спочатку копіюємо файли залежностей
COPY package*.json ./
RUN npm install

# Копіюємо весь інший код (включаючи вашу папку src)
COPY . .

EXPOSE 3000

# Запуск у режимі розробки з підтримкою Hot Reload
CMD ["npm", "run", "dev"]