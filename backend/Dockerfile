# -----------------------------
# Etapa 1: BUILD (compila TS)
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# 1) Copiar manifests primero para aprovechar caché
COPY package*.json ./

# 2) Instalar TODAS las dependencias (incluye dev) para poder compilar
RUN npm ci

# 3) Copiar el resto del código fuente
COPY . .

# 4) Compilar a JS (ajustar al script real del proyecto)
#    Asegurarse de que "npm run build" genere /app/dist con server.js, etc.
RUN npm run build


# ---------------------------------------------
# Etapa 2: RUNTIME (ligero, solo prod deps)
# ---------------------------------------------
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# 1) Manifests para instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# 2) Herramientas mínimas del sistema
#    - netcat-openbsd: usado por entrypoint para esperar MySQL (nc -z host port)
#    - (opcional) toolchain si hay módulos nativos (descomentarlo si hace falta)
RUN apk add --no-cache netcat-openbsd
# RUN apk add --no-cache python3 make g++  # <- si usas bcrypt, sqlite3, etc.

# 3) CLI de sequelize disponible SIEMPRE en runtime
#    (mejor que depender de devDependencies)
RUN npm i -g sequelize-cli@6.6.3

# 4) Copiar artefactos y recursos necesarios para arrancar
#    - dist: JS compilado desde builder
#    - config/.sequelizerc: rutas del CLI
#    - migrations/seeders: para que el CLI no falle con ENOENT
COPY --from=builder /app/dist ./dist
COPY .sequelizerc ./.sequelizerc
COPY config ./config
COPY migrations ./migrations
COPY seeders ./seeders
COPY entrypoint.sh ./entrypoint.sh

# 5) Normalizar finales de línea del entrypoint y permisos de ejecución
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# 6) Exponer puerto de la app
EXPOSE 3000

# 7) Entrypoint POSIX (sh). Si alguna vez se usan bashismos, cambiar a bash.
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
