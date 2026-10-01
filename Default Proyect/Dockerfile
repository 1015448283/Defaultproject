# ==========================================
# Multi-stage Dockerfile for Oliver Prada Services
# Static SPA only — Netlify Functions are not included.
# Pass Vite public env at build time (see DEPLOYMENT.md).
# ==========================================

# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Production Stage with Nginx
FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
