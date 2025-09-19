#!/bin/sh
set -e

# Levantar contenedores en segundo plano
docker compose up -d

# Esperar a que frontend responda en el puerto 4200
echo "Esperando a que frontend responda en http://localhost:4200 ..."
until curl -s http://localhost:4200 > /dev/null; do sleep 1; done

# Abrir navegador dependiendo del sistema operativo
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:4200
elif command -v open > /dev/null; then
  open http://localhost:4200
elif command -v start > /dev/null; then
  start http://localhost:4200
else
  echo "Abra manualmente http://localhost:4200"
fi
