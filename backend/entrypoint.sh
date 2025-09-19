#!/bin/sh
set -e

# Espera a MySQL antes de seguir
echo "Esperando MySQL en $DB_HOST:$DB_PORT..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "MySQL disponible. Aplicando migraciones y seeders..."

# Ejecutar migraciones y seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

echo "Arrancando backend..."
exec npm run start:prod
