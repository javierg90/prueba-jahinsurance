FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Instalar CLI sequelize (si no está en package.json)
RUN npm i -g sequelize-cli

# Puerto
EXPOSE 3000

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
