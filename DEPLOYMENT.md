# Despliegue — Oliver Prada Servicios

Guía para publicar la PWA en **Netlify** (hosting real) y desde **Google Antigravity** (agente que despliega *en* Netlify). No hay hosting llamado Antigravity.

## Estructura del repositorio

El Git root es `Default_Project`. El sitio Vite **no** está en la raíz:

| Ruta | Contenido |
|------|-----------|
| `Default Proyect/` | App (React + Vite), `package.json`, Functions, `netlify.toml` local |
| `Documentacion/` | Brief y specs de arquitectura |
| `Agentes/` | Prompts de roles (no son runbooks de producción) |
| `netlify.toml` | Config de Netlify con `base = "Default Proyect"` |
| `DEPLOYMENT.md` | Este archivo |

El nombre de carpeta **incluye un espacio** (`Default Proyect`). No se movió la app a la raíz para no romper rutas locales. En Netlify UI, si *no* usas el `netlify.toml` de la raíz, define **Base directory** = `Default Proyect` (con espacio). En scripts, entrecomilla la ruta: `"Default Proyect"`.

## Ruta recomendada: Netlify (no Docker)

Docker + Nginx solo sirve `dist`. Pagos y WhatsApp viven en Netlify Functions; un contenedor estático **no** las ejecuta.

| Setting | Valor |
|---------|--------|
| Base directory | `Default Proyect` (o confiar en el `netlify.toml` de la raíz) |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node | 20 |

### Conectar el sitio

1. Repositorio en GitHub/GitLab → New site on Netlify (o `netlify init` / `netlify link` desde `Default Proyect`).
2. Configurar variables de entorno (abajo) **antes** del primer build de producción.
3. Primer deploy: draft (`netlify deploy`), no `--prod`.
4. Stripe webhook: `https://<tu-sitio>/api/pagos/webhook` (rewrite a `stripe-webhook`). Alternativa: `https://<tu-sitio>/.netlify/functions/stripe-webhook`.
5. Dominio custom en Netlify; `URL` del sitio se usa para `success_url` de Checkout.

### Variables de entorno

Nunca commitees `.env`. Copia `Default Proyect/.env.example` solo en local.

**Build (Vite las incrusta en el JS; deben existir en el build de Netlify):**

| Variable | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | Cliente Supabase en el browser |
| `VITE_SUPABASE_ANON_KEY` | Anon key (RLS) |
| `VITE_STRIPE_PUBLIC_KEY` | Opcional (UI) |
| `VITE_GA_TRACKING_ID` | Opcional (aún no cableado en el código) |

**Runtime (solo Functions; no usar prefijo `VITE_`):**

| Variable | Uso |
|----------|-----|
| `SUPABASE_URL` | Mismo proyecto que `VITE_SUPABASE_URL`, leído por Functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin; nunca en el frontend |
| `STRIPE_SECRET_KEY` | Checkout |
| `STRIPE_WEBHOOK_SECRET` | Firma del webhook (body raw) |
| `RESEND_API_KEY` | Email (si se usa) |
| `ADMIN_EMAIL` | Destinatario admin |
| `WHATSAPP_API_TOKEN` | WhatsApp Business |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Cuenta Business |

Netlify inyecta `URL` / `DEPLOY_PRIME_URL` en Functions; el checkout las usa para `/pago/exito` y `/pago/error` (dominio del sitio, no el origin interno de la Function).

### Checklist previo a producción

- [ ] Proyecto Supabase creado; `supabase db push` con `Default Proyect/supabase/migrations`
- [ ] Seed / usuario admin (`supabase/seed/`)
- [ ] Keys de Stripe **test** primero; webhook apuntando a la URL de Netlify
- [ ] `VITE_*` y `SUPABASE_URL` coinciden con el mismo proyecto
- [ ] RLS de `contactos`: insert público, select solo admin (hoy el schema de arquitectura permite select público de leads)
- [ ] Probar SPA: recargar `/contacto`, `/admin`, `/pago/exito`
- [ ] Probar POST `/api/pagos/crear-sesion` y el webhook

### CLI local

Desde `Default Proyect/`:

```bash
npm ci
npm run build
npx netlify-cli deploy --dir=dist --functions=netlify/functions
# producción, solo cuando el draft esté validado:
npx netlify-cli deploy --dir=dist --functions=netlify/functions --prod
```

PowerShell: `.\deploy.ps1` (draft) o `.\deploy.ps1 -Prod`.

## Google Antigravity

Antigravity no publica el sitio por sí mismo. Usa el MCP / CLI de Netlify.

1. Abre el **Git root** (`Default_Project`) para que el `netlify.toml` con `base` aplique, **o** abre `Default Proyect` y en Netlify UI pon Base directory.
2. Instala el MCP de Netlify (`npx -y @netlify/mcp`) y un personal access token. Contexto actualizado: pedir al agente que lea `https://netlify.ai`.
3. No pegues secrets en el chat ni en markdown; usa el dashboard de Netlify o `netlify env:set`.
4. Primer pase: **draft** (`netlify deploy`). Producción: `netlify deploy --prod` solo después de validar Functions y webhook.
5. Si el agente no encuentra `package.json`, indícale la carpeta `"Default Proyect"` (espacio incluido).

## Docker (solo estáticos)

El `Dockerfile` en `Default Proyect/` genera Nginx con `dist`. Hay que pasar args de Vite en el build; no incluye Functions.

```bash
cd "Default Proyect"
docker build --build-arg VITE_SUPABASE_URL=https://xxxx.supabase.co --build-arg VITE_SUPABASE_ANON_KEY=eyJxxxx -t op-services .
```

## CI

`.github/workflows/deploy.yml` corre `npm ci` + `npm run build` en `"Default Proyect"` (Node 20). El publish a Netlify lo hace el hook de Netlify sobre el repo, no un deploy token en GitHub.

## Documentación de producto

- [`Documentacion/BRIEF.md`](Documentacion/BRIEF.md)
- [`Documentacion/Arquitectura.md`](Documentacion/Arquitectura.md)
- [`Documentacion/backend.md`](Documentacion/backend.md)
- [`Documentacion/frontend.md`](Documentacion/frontend.md)
- [`Default Proyect/README.md`](Default%20Proyect/README.md)
