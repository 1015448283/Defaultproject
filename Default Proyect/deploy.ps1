# Script de despliegue local automatizado (PowerShell)
param (
    [switch]$Prod = $false
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Despliegue - Oliver Prada Servicios Web " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Verificar variables de entorno
if (-not (Test-Path ".env")) {
    Write-Warning "No se encontró el archivo .env. Copiando desde .env.example..."
    Copy-Item ".env.example" ".env"
    Write-Host "Por favor revisa y actualiza los valores en .env antes de desplegar a producción." -ForegroundColor Yellow
}

# 2. Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "`n[1/3] Instalando dependencias..." -ForegroundColor Green
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Fallo en npm install"
        exit $LASTEXITCODE
    }
}

# 3. Compilación y Type Check
Write-Host "`n[2/3] Compilando aplicación Vite..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Fallo en npm run build"
    exit $LASTEXITCODE
}
Write-Host "Compilación exitosa en /dist" -ForegroundColor Green

# 4. Despliegue con Netlify CLI
Write-Host "`n[3/3] Desplegando en Netlify..." -ForegroundColor Green
if ($Prod) {
    Write-Host "Desplegando en PRODUCCIÓN..." -ForegroundColor Cyan
    npx netlify-cli deploy --dir=dist --functions=netlify/functions --prod
} else {
    Write-Host "Desplegando vista previa (Draft)..." -ForegroundColor Cyan
    npx netlify-cli deploy --dir=dist --functions=netlify/functions
}

Write-Host "`nDespliegue finalizado." -ForegroundColor Green
