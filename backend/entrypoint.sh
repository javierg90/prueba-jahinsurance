#!/bin/sh
# entrypoint.sh — Runtime para backend Node + Sequelize
# Shell: POSIX (sh). No usa bashismos.

set -euo pipefail

# -------------------------------
# Config por variables de entorno
# -------------------------------
DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"

# Control de pasos (todo en minúsculas/true|false)
MIGRATE="${MIGRATE:-true}"          # Ejecutar migraciones
SEED="${SEED:-true}"                # Ejecutar seeders
SEED_ONCE_FILE="${SEED_ONCE_FILE:-/app/.seeded}"   # Marca "seed ejecutado"
WAIT_TIMEOUT_SEC="${WAIT_TIMEOUT_SEC:-60}"         # Tiempo máx esperando MySQL (0 = infinito)

# Entorno de Sequelize/Node
export NODE_ENV="${NODE_ENV:-production}"
export SEQUELIZE_ENV="${SEQUELIZE_ENV:-$NODE_ENV}"

# Comando final de la app (ajustar si difiere la ruta del build)
APP_CMD="${APP_CMD:-node dist/app/server.js}"

# Utilidades
CLI="./node_modules/.bin/sequelize"        # desde v6, el bin se llama "sequelize"
CLI_FALLBACK="./node_modules/.bin/sequelize-cli"  # por compatibilidad

ts() { date +'%F %T'; }
log() { printf '%s | %s\n' "$(ts)" "$*"; }

# -------------------------------
# Esperar a MySQL (TCP handshake)
# -------------------------------
log "Esperando MySQL en ${DB_HOST}:${DB_PORT} ..."
elapsed=0
while ! nc -z "${DB_HOST}" "${DB_PORT}" 2>/dev/null; do
  sleep 1
  elapsed=$((elapsed+1))
  if [ "${WAIT_TIMEOUT_SEC}" -ne 0 ] && [ "${elapsed}" -ge "${WAIT_TIMEOUT_SEC}" ]; then
    log "ERROR: Timeout esperando MySQL (${WAIT_TIMEOUT_SEC}s)."
    exit 1
  fi
done
log "MySQL disponible."

# -------------------------------
# Comprobaciones de dependencias
# -------------------------------
# Debe existir 'sequelize' local (el CLI lo carga desde el proyecto)
node -e "require.resolve('sequelize')" 2>/dev/null \
  || { log "ERROR: Falta el paquete 'sequelize' en /app/node_modules."; exit 1; }

# Resolver bin del CLI local (sequelize o sequelize-cli)
if [ -x "$CLI" ]; then
  SEQ="$CLI"
elif [ -x "$CLI_FALLBACK" ]; then
  SEQ="$CLI_FALLBACK"
else
  log "ERROR: No se encontró sequelize CLI en ./node_modules/.bin (ni 'sequelize' ni 'sequelize-cli')."
  exit 1
fi

# Mostrar versión para trazabilidad
log "Node: $(node -v) | NPM: $(npm -v)"
"$SEQ" --version || true

# -------------------------------
# Migraciones
# -------------------------------
if [ "${MIGRATE}" = "true" ]; then
  log "Ejecutando migraciones (env=${SEQUELIZE_ENV})..."
  # El CLI usa config/config.js y SEQUELIZE_ENV/NODE_ENV
  "$SEQ" db:migrate
  log "Migraciones aplicadas."
else
  log "MIGRATE=false → se omite db:migrate."
fi

# -------------------------------
# Seeders (idempotente)
# -------------------------------
if [ "${SEED}" = "true" ]; then
  # Si el proyecto usa `seederStorage: 'sequelize'`, esto ya es idempotente.
  # El archivo .seeded sirve como guardia adicional en despliegues repetidos.
  if [ ! -f "${SEED_ONCE_FILE}" ]; then
    log "Ejecutando seeders..."
    # No fallar el arranque si un seeder ya insertó datos previamente.
    "$SEQ" db:seed:all || log "Aviso: db:seed:all devolvió error no-crítico (posibles duplicados)."
    # Marcar como hecho (siempre que el contenedor tenga FS escribible)
    if touch "${SEED_ONCE_FILE}" 2>/dev/null; then
      log "Marcado seed ejecutado en ${SEED_ONCE_FILE}."
    else
      log "Aviso: no se pudo crear ${SEED_ONCE_FILE}; confiar solo en seederStorage."
    fi
  else
    log "Seeders ya aplicados previamente (existe ${SEED_ONCE_FILE})."
  fi
else
  log "SEED=false → se omite db:seed:all."
fi

# -------------------------------
# Arranque de la aplicación
# -------------------------------
log "Arrancando backend → ${APP_CMD}"
exec ${APP_CMD}
