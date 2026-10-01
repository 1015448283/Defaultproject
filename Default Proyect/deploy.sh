#!/bin/bash
set -e

echo "=========================================="
echo " Despliegue - Oliver Prada Servicios Web "
echo "=========================================="

if [ ! -f .env ]; then
  echo "Aviso: Creando .env desde .env.example..."
  cp .env.example .env
fi

echo "[1/3] Instalando dependencias..."
npm install

echo "[2/3] Compilando aplicación..."
npm run build

echo "[3/3] Desplegando en Netlify..."
if [ "$1" == "--prod" ]; then
  npx netlify-cli deploy --dir=dist --functions=netlify/functions --prod
else
  npx netlify-cli deploy --dir=dist --functions=netlify/functions
fi

echo "Despliegue finalizado exitosamente."
