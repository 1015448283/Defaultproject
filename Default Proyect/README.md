# Oliver Prada - Servicios Técnicos

## Descripción
Aplicación web PWA para servicios de desarrollo frontend y gestión de bases de datos.

## Estructura del Proyecto

```
Default Proyect/
├── src/                    # Código fuente React + Vite
│   ├── app/               # App, rutas, providers
│   ├── components/        # Componentes UI y layouts
│   ├── pages/            # Páginas públicas y admin
│   ├── hooks/            # Custom hooks y React Query
│   ├── services/         # Servicios API (Supabase)
│   ├── stores/           # Zustand stores
│   ├── styles/           # Tailwind CSS global
│   └── lib/              # Constantes y utilidades
├── netlify/
│   └── functions/        # Netlify Functions (Stripe, WhatsApp)
├── public/               # Assets estáticos
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── seed/            # Datos iniciales
├── netlify.toml         # Configuración Netlify
├── vite.config.ts       # Configuración Vite + PWA
├── tailwind.config.js   # Configuración Tailwind
├── tsconfig.json        # Configuración TypeScript
├── package.json         # Dependencias
└── .env.example         # Variables de entorno
```

## Instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd Default-Proyect

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Configurar Supabase
# - Crear proyecto en supabase.com
# - Ejecutar migrations: supabase db push
# - Insertar seed data: supabase db seed

# 5. Configurar Netlify Functions
# - Netlify CLI: npm install -g netlify-cli
# - netlify login
# - netlify link

# 6. Ejecutar en desarrollo
npm run dev

# 7. Build para producción
npm run build
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite + PWA) |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm test` | Ejecutar tests con Vitest |
| `npm run test:coverage` | Tests con coverage |
| `npm run lint` | Linting con ESLint |
| `npm run lint:fix` | Arreglar problemas de lint |

## Variables de Entorno Requeridas

| Variable | Propósito | Ejemplo |
|----------|-----------|---------|
| VITE_SUPABASE_URL | URL de Supabase | `https://xxx.supabase.co` |
| VITE_SUPABASE_ANON_KEY | Key pública | `eyJ...` |
| VITE_STRIPE_PUBLIC_KEY | Key pública Stripe | `pk_test_xxx` |
| SUPABASE_SERVICE_ROLE_KEY | Key admin (Netlify) | `eyJ...` |
| STRIPE_SECRET_KEY | Key secreta Stripe | `sk_test_xxx` |
| STRIPE_WEBHOOK_SECRET | Secret webhook | `whsec_xxx` |
| RESEND_API_KEY | Email notifications | `re_xxx` |
| WHATSAPP_API_TOKEN | WhatsApp Business | `xxxx` |

## Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Serverless**: Netlify Functions
- **Pagos**: Stripe Checkout (PSE, Nequi, Tarjetas)
- **Estado**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **UI**: Radix UI + Sonner + Lucide Icons
- **Testing**: Vitest + React Testing Library
- **PWA**: Vite PWA Plugin

## Documentación de Referencia

- `/documentos/BRIEF.md` - Requerimientos de negocio
- `/documentos/Arquitectura.md` - Diseño de arquitectura
- `/documentos/backend.md` - Especificación backend
- `/documentos/frontend.md` - Especificación frontend
