# Funciones Netlify

## create-checkout
- **Handler**: `netlify/functions/create-checkout.ts`
- **Eventos**: POST
- **Variables**: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- **Descripción**: Crea sesión Stripe Checkout

## stripe-webhook
- **Handler**: `netlify/functions/stripe-webhook.ts`
- **Eventos**: POST (firma Stripe)
- **Variables**: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- **Descripción**: Procesa eventos de pago de Stripe

## send-whatsapp
- **Handler**: `netlify/functions/send-whatsapp.ts`
- **Eventos**: POST
- **Variables**: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID
- **Descripción**: Envía mensajes WhatsApp

# Supabase Functions (Edge)
## get_dashboard_metrics
- **Tipo**: RPC SQL
- **Descripción**: Retorna métricas del dashboard

## get_available_slots
- **Tipo**: RPC SQL
- **Descripción**: Retorna slots disponibles para agendamiento
