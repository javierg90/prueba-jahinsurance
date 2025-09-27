#!/bin/sh
set -eu

# Valores por defecto por si no vienen en el entorno
DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
RUN_SEED="${RUN_SEED:-true}"    # permitir desactivar seeders con RUN_SEED=false

echo "$(date +'%F %T') | Esperando MySQL en ${DB_HOST}:${DB_PORT}..."
until nc -z "${DB_HOST}" "${DB_PORT}"; do
  sleep 1
done
echo "$(date +'%F %T') | MySQL disponible. Aplicando migraciones..."

# Migraciones (el CLI ya está leyendo config/config.js y NODE_ENV=production)
npx sequelize-cli db:migrate

# Seeders (idempotente: se puede combinar con seederStorage='sequelize')
if [ "${RUN_SEED}" = "true" ] && [ ! -f ".seeded" ]; then
  echo "$(date +'%F %T') | Aplicando seeders..."
  npx sequelize-cli db:seed:all || true
  touch .seeded
fi

echo "$(date +'%F %T') | Arrancando backend (node dist)..."
# <<< ¡CLAVE! Ejecutar JS compilado, no ts-node-dev >>>
exec node dist/app/server.js
