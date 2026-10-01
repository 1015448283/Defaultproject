# Oliver Prada - Servicios Técnicos

Aplicación web PWA (React + Vite) para servicios de desarrollo frontend y gestión de bases de datos.

El repositorio Git está un nivel arriba. Esta carpeta se llama **`Default Proyect`** (espacio en el nombre). En Netlify, Base directory = `Default Proyect`. Guía completa: [`../DEPLOYMENT.md`](../DEPLOYMENT.md).

## Estructura

```
Default Proyect/
├── src/                    # React + Vite
│   ├── app/                # App, rutas, providers
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/           # Cliente Supabase (VITE_*)
│   ├── stores/
│   └── styles/
├── netlify/functions/      # Stripe, WhatsApp (deps en este package.json)
├── public/
├── supabase/               # migrations + seed
├── netlify.toml
├── vite.config.ts
├── package.json
└── .env.example
```

## Instalación

```bash
# Desde el Git root
cd "Default Proyect"

npm install
cp .env.example .env
# Completar .env (VITE_* para el cliente; SUPABASE_URL y secrets para Functions)

# Supabase: crear proyecto, luego
# supabase db push
# aplicar seed en supabase/seed/

npm run dev
```

Build local: `npm run build`. Preview: `npm run preview`. Despliegue: ver `../DEPLOYMENT.md`.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Vite (puerto 3000) |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Sirve el build |

No hay scripts de test ni lint cableados en `package.json` todavía.

## Variables de entorno

**Build (browser):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Opcionales: `VITE_STRIPE_PUBLIC_KEY`, `VITE_GA_TRACKING_ID`.

**Functions:** `SUPABASE_URL` (misma URL del proyecto, **no** es `VITE_SUPABASE_URL`), `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, y las de WhatsApp/Resend. Detalle en `.env.example` y `../DEPLOYMENT.md`.

`stripe` en `package.json` es para Netlify Functions, no para el bundle del cliente.

## Stack

- Frontend: React 18 + Vite + TypeScript + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth)
- Serverless: Netlify Functions
- Pagos: Stripe Checkout
- Estado: Zustand + React Query
- Forms: React Hook Form + Zod
- PWA: Vite PWA Plugin

## Documentación

- [`../DEPLOYMENT.md`](../DEPLOYMENT.md) — Netlify, Antigravity, env, CI
- [`../Documentacion/BRIEF.md`](../Documentacion/BRIEF.md)
- [`../Documentacion/Arquitectura.md`](../Documentacion/Arquitectura.md)
- [`../Documentacion/backend.md`](../Documentacion/backend.md)
- [`../Documentacion/frontend.md`](../Documentacion/frontend.md)
