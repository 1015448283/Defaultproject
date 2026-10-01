# GUÍA DEFINITIVA DE DESPLIEGUE A PRODUCCIÓN

**Proyecto:** Oliver Prada - Servicios Técnicos (Página Web Personal Brand)  
**Arquitectura:** JAMstack + PWA (React 18 + Vite + Netlify Functions + Supabase)

---

## 📋 Resumen del Pipeline de Despliegue

```
[Código en GitHub]
       │
       ▼ (Push a main / master)
[GitHub Actions CI/CD] ────▶ [Type Check: tsc] ────▶ [Build: Vite PWA]
       │
       ▼ (Artefactos compilados)
[Netlify CDN + Functions] ◀───▶ [Supabase PostgreSQL (BaaS)]
       │                                  │
       ▼                                  ▼
[Stripe Checkout] ─────────── Webhook ────┘
```

---

## PASO 1: Configuración de Base de Datos en Supabase

1. **Crear Proyecto en Supabase:**
   - Ingresa a [supabase.com](https://supabase.com) y crea una nueva organización y proyecto.
   - Selecciona la región más cercana (ej. `us-east-1` o `sa-east-1` para Sudamérica).

2. **Ejecutar Migración de Tablas y Seguridad (RLS):**
   - En el panel de Supabase, navega a **SQL Editor**.
   - Abre y copia el contenido del archivo:
     [`Default Proyect/supabase/migrations/001_initial_schema.sql`](file:///c:/Users/olive/OneDrive/Documentos/Default_Project/Default%20Proyect/supabase/migrations/001_initial_schema.sql)
   - Haz clic en **Run**. Esto creará:
     - 10 tablas relacionales (`usuarios`, `contactos`, `proyectos`, `servicios`, `proyecto_servicios`, `pagos`, `agendamientos`, `disponibilidad`, `redes_sociales`, `portafolio`, `testimonios`, `contenido`).
     - Función y trigger para sincronizar `auth.users` con `public.usuarios`.
     - Funciones RPC `get_dashboard_metrics()` y `get_available_slots()`.
     - Políticas Row Level Security (RLS) en todas las tablas.

3. **Cargar Datos Iniciales (Seed Data):**
   - En el **SQL Editor**, copia y ejecuta el archivo:
     [`Default Proyect/supabase/seed/001_seed_data.sql`](file:///c:/Users/olive/OneDrive/Documentos/Default_Project/Default%20Proyect/supabase/seed/001_seed_data.sql)
   - Esto creará los registros iniciales de disponibilidad horaria, servicios, portafolio, testimonios y artículos de blog.

4. **Crear tu Usuario Administrador:**
   - Abre el archivo:
     [`Default Proyect/supabase/seed/002_create_admin_user.sql`](file:///c:/Users/olive/OneDrive/Documentos/Default_Project/Default%20Proyect/supabase/seed/002_create_admin_user.sql)
   - Modifica el correo `admin_email` y la contraseña `admin_password` según tus preferencias.
   - Ejecuta el script en el **SQL Editor**. Con este usuario podrás ingresar a `/login` y acceder a `/admin`.

5. **Obtener las Claves de API:**
   - Ve a **Project Settings > API**.
   - Copia:
     - **Project URL** (`https://xxxxxxxx.supabase.co`)
     - **anon / public key** (`eyJ...`)
     - **service_role key** (clave secreta para Netlify Functions).

---

## PASO 2: Configuración de Pasarela de Pagos (Stripe)

1. Ingresa a [dashboard.stripe.com](https://dashboard.stripe.com).
2. Obtén tus claves en **Developers > API Keys**:
   - `STRIPE_SECRET_KEY` (`sk_test_...` o `sk_live_...`)
   - `VITE_STRIPE_PUBLIC_KEY` (`pk_test_...` o `pk_live_...`)
3. **Configurar el Webhook:**
   - Ve a **Developers > Webhooks > Add an endpoint**.
   - **Endpoint URL**: `https://tu-dominio.netlify.app/.netlify/functions/stripe-webhook`
   - **Eventos a escuchar**:
     - `checkout.session.completed`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copia el **Signing Secret** (`whsec_...`) y asígnalo a `STRIPE_WEBHOOK_SECRET`.

---

## PASO 3: Despliegue en Netlify

### Opción A: Conexión Automática con Git (Recomendada)
1. Ve a [app.netlify.com](https://app.netlify.com) y selecciona **Add new site > Import an existing project**.
2. Conecta tu repositorio de GitHub `Default_Project`.
3. Configura los parámetros de build:
   - **Base directory**: `Default Proyect`
   - **Build command**: `npm run build`
   - **Publish directory**: `Default Proyect/dist`
   - **Functions directory**: `Default Proyect/netlify/functions`
4. En **Site configuration > Environment variables**, añade las siguientes variables:

| Variable | Tipo | Valor / Descripción |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Llave anónima pública de Supabase |
| `VITE_STRIPE_PUBLIC_KEY` | Frontend | Llave pública de Stripe |
| `SUPABASE_URL` | Backend | URL de Supabase para las functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend (Secreto) | Service Role Key de Supabase |
| `STRIPE_SECRET_KEY` | Backend (Secreto) | Secret Key de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Backend (Secreto) | Signing secret del webhook |
| `WHATSAPP_API_TOKEN` | Backend (Opcional) | Token de WhatsApp Business API |
| `WHATSAPP_PHONE_NUMBER_ID` | Backend (Opcional) | ID de teléfono de WhatsApp API |
| `NODE_VERSION` | Build | `18` |

5. Haz clic en **Deploy Site**. Netlify compilará el frontend y desplegará las Edge/Serverless Functions.

---

### Opción B: Despliegue Directo por CLI
Desde la carpeta `Default Proyect`, puedes ejecutar:
```powershell
# En Windows PowerShell:
.\deploy.ps1 -Prod

# O en Bash:
./deploy.sh --prod
```

---

## PASO 4: Configuración de CI/CD con GitHub Actions (Opcional pero Automatizado)

Si deseas que cada `git push` a `master` o `main` despliegue automáticamente mediante GitHub Actions:
1. En tu repositorio de GitHub, ve a **Settings > Secrets and variables > Actions**.
2. Crea los siguientes secretos:
   - `NETLIFY_AUTH_TOKEN`: Tu Personal Access Token generado en Netlify (User Settings > Applications > New access token).
   - `NETLIFY_SITE_ID`: El API ID de tu sitio en Netlify (Site configuration > Site details).
   - `VITE_SUPABASE_URL`: Tu URL de Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.
   - `VITE_STRIPE_PUBLIC_KEY`: Tu clave pública de Stripe.

El archivo [`.github/workflows/deploy.yml`](file:///c:/Users/olive/OneDrive/Documentos/Default_Project/.github/workflows/deploy.yml) se encargará de validar tipos, compilar y desplegar en producción automáticamente.

---

## PASO 5: Despliegue Alternativo en Contenedores (Docker)

Si prefieres alojar la aplicación en un VPS, Railway, Render o DigitalOcean:
```bash
cd "Default Proyect"

# 1. Construir la imagen Docker
docker build -t oliver-prada-services:latest .

# 2. Ejecutar el contenedor en el puerto 8080
docker run -d -p 8080:80 --name oliver-prada-web oliver-prada-services:latest
```
La aplicación incluye servidor Nginx optimizado con compresión gzip, encabezados de seguridad y soporte para rutas SPA.

---

## ✅ Checklist de Verificación Post-Despliegue

- [ ] La página principal (`/`) carga con estilos azul/negro y contenido inicial.
- [ ] La navegación a `/servicios`, `/portafolio`, `/testimonios`, `/contacto`, `/agendar` funciona sin recargas completas.
- [ ] El formulario de `/contacto` registra nuevos leads en la tabla `contactos` de Supabase.
- [ ] El agendamiento en `/agendar` valida y crea citas en la tabla `agendamientos`.
- [ ] La página de login en `/login` permite autenticar al administrador y redirige a `/admin`.
- [ ] El panel `/admin` muestra las métricas de `get_dashboard_metrics` y permite gestionar contactos, proyectos y citas.
- [ ] La sesión del administrador persiste al recargar la página (`F5`).
- [ ] El webhook de Stripe responde exitosamente con código `200` y firma válida.
- [ ] Lighthouse PWA pasa con score superior a 90.
