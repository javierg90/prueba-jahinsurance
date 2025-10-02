# ---- BUILD ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- RUNTIME ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache netcat-openbsd

# Copiamos artefactos y node_modules ya resueltos
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/config ./config
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeders ./seeders
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
