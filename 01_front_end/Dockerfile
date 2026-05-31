FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Копіює весь корінь фронтенду (включаючи твою папку src)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]