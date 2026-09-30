# DOCUMENTO TÉCNICO DE ARQUITECTURA DE SOFTWARE

**Proyecto:** Página Web Personal Brand - Servicios Técnicos
**Cliente:** Oliver Santiago Prada Gómez
**Arquitecto:** Chief Software Architect
**Versión:** 1.1
**Fecha:** 08 de Septiembre 2026
**Estado:** Aprobado para Desarrollo

---

## 1. RESUMEN EJECUTIVO

### 1.1 Objetivo del Documento

Este documento define la arquitectura técnica del sistema web para Oliver Santiago Prada Gómez, un técnico en sistemas que ofrece servicios de frontend development y manejo de bases de datos. El sistema implementará una presencia en línea profesional tipo Personal Brand con funcionalidades de conversión (formularios de contacto, calendarización, pagos) y integración con redes sociales.

### 1.2 Alcance del Sistema

- **Tipo:** Aplicación Web PWA (Progressive Web App)
- **Modelo:** JAMstack (JavaScript, APIs, Markup)
- **Enfoque:** Personal Brand para servicios técnicos
- **Presupuesto Desarrollo:** $20.000.000 COP
- **Meta Ingresos 12 Meses:** $8.000.000 COP
- **Plazo Desarrollo:** 1 mes (4 semanas)
- **Objetivo:** Captar 3-4 clientes, 3-4 proyectos simultáneos

### 1.3 Decisiones Arquitectónicas Clave

| Decisión | Selección | Justificación |
|----------|-----------|---------------|
| Arquitectura | JAMstack + PWA | Cumplimiento requisitos, escalabilidad, costo |
| Frontend | React (Vite) | Especificado en BRIEF, ecosistema robusto |
| Backend | Supabase (PostgreSQL) | Base de datos relacional como servicio |
| Hosting | Netlify/Vercel CDN | Planes compartidos/baratos, PWA nativo |
| Pagos | Stripe API | Estándar industria, integración directa |
| Autenticación | Supabase Auth | Incluido en Supabase, JWT nativo |

---

## 2. ARQUITECTURA GENERAL DEL SISTEMA

### 2.1 Diagrama de Arquitectura JAMstack + PWA

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN (FRONTEND)              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite)                     │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐            │   │
│  │  │ Componentes│ │  Hooks    │ │ Context   │            │   │
│  │  │   UI      │ │ Custom    │ │  API      │            │   │
│  │  └───────────┘ └───────────┘ └───────────┘            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Service Worker (PWA Features)              │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │Cache First  │ │Background   │ │ Push        │      │   │
│  │  │Strategy     │ │Sync         │ │ Notifications│     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE RED (CDN & EDGE)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Netlify/Vercel CDN Network                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │Edge Functions│ │SSL/TLS      │ │DDoS         │      │   │
│  │  │(Serverless) │ │Auto         │ │Protection   │      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE APIs (BACKEND AS A SERVICE)          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Supabase Platform                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │PostgreSQL   │ │Auth         │ │Storage      │      │   │
│  │  │Database     │ │(JWT/JWK)    │ │(Files)      │      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Integraciones Externas                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │Stripe API   │ │Calendar API │ │Social Media │      │   │
│  │  │(Pagos)      │ │(Google Cal) │ │(FB/IG/TK)   │      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos del Sistema

```
USUARIO → React SPA → Service Worker → CDN → Supabase API → PostgreSQL
                     ↘                                        ↙
                      → Stripe API → Webhook → Supabase Functions
```

### 2.3 Características de la Arquitectura

| Característica | Implementación |
|----------------|----------------|
| Desacoplamiento | Frontend (React) consume APIs HTTP/REST |
| Escalabilidad | CDN global + Supabase auto-escalable |
| Seguridad | JWT tokens, CORS, HTTPS obligatorio |
| Rendimiento | Static assets en CDN, lazy loading React |
| PWA | Service Worker + Web App Manifest |
| Offline | Cache-first para assets, fallback page |

---

## 3. STACK TECNOLÓGICO DETALLADO

### 3.1 Frontend Stack

| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| Framework | React | 18.x | Especificado en BRIEF |
| Build Tool | Vite | 5.x | Velocidad de desarrollo HMR |
| Routing | React Router | 6.x | Navegación SPA |
| Forms | React Hook Form | 7.x | Validación formularios |
| Styling | Tailwind CSS | 3.x | Utilidades CSS para diseño |
| State | Zustand | 4.x | Gestión estado ligera |
| HTTP Client | Axios | 1.x | Consumo APIs REST |
| Testing | Vitest | 1.x | Testing unitario React |
| PWA | Vite PWA Plugin | 0.x | Service Worker automático |

### 3.2 Backend Stack (Supabase)

| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| Database | PostgreSQL | 15.x | Base de datos relacional |
| Auth | Supabase Auth | - | JWT/JWK nativo |
| Storage | Supabase Storage | - | Imágenes, documentos |
| Functions | Edge Functions | - | Lógica serverless |
| Realtime | Supabase Realtime | - | Actualizaciones en vivo |
| API | REST API auto | - | Generada automáticamente |

### 3.3 Integraciones Externas

| Servicio | Proveedor | Uso | Costo Estimado |
|----------|-----------|-----|----------------|
| Pagos | Stripe | Cobro (Tarjeta + PSE + Nequi) | 2.9% + $0.30 por transacción |
| Calendario | Google Calendar | Solo lectura (disponibilidad) | Gratis |
| Analytics | Google Analytics | Métricas de uso | Gratis |
| Email | Resend | Notificaciones admin/cliente | Gratis hasta 100/mes |
| WhatsApp | WhatsApp Business API | Recordatorios de cita | ~$0.05/mensaje |
| Hosting | Netlify | CDN + Functions | Gratis (plan starter) |
| Dominio | Namecheap/Google | dominio.com | ~$12 año |

---

## 4. DISEÑO DEL BACKEND (SUPABASE)

### 4.1 Modelo de Datos Entity-Relationship

```
┌─────────────────────┐      ┌─────────────────────┐
│      CONTACTOS      │      │      PROYECTOS      │
├─────────────────────┤      ├─────────────────────┤
│ id (PK, UUID)       │──┐   │ id (PK, UUID)       │
│ nombre (VARCHAR)    │  │   │ titulo (VARCHAR)    │
│ email (VARCHAR)     │  │   │ descripcion (TEXT)  │
│ telefono (VARCHAR)  │  └──▶│ contacto_id (FK)    │
│ empresa (VARCHAR)   │      │ estado (ENUM)       │
│ mensaje (TEXT)      │      │ fecha_inicio (DATE) │
│ fuente (VARCHAR)    │      │ fecha_fin (DATE)    │
│ created_at (TIMESTAMPTZ)   │ presupuesto (DECIMAL)│
│ updated_at (TIMESTAMPTZ)   │ created_at (TIMESTAMPTZ)│
└─────────────────────┘      │ updated_at (TIMESTAMPTZ)│
                              └─────────────────────┘
                                       │
                                       ▼
┌─────────────────────┐      ┌─────────────────────┐
│      SERVICIOS      │      │    PAGOS            │
├─────────────────────┤      ├─────────────────────┤
│ id (PK, UUID)       │      │ id (PK, UUID)       │
│ nombre (VARCHAR)    │      │ proyecto_id (FK)    │
│ descripcion (TEXT)  │      │ monto (DECIMAL)     │
│ precio_base (DECIMAL│      │ moneda (VARCHAR)    │
│ duracion_estimada   │      │ metodo_pago (VARCHAR│
│ activo (BOOLEAN)    │      │ stripe_id (VARCHAR) │
│ created_at (TIMESTAMPTZ)   │ estado (ENUM)       │
│ updated_at (TIMESTAMPTZ)   │ created_at (TIMESTAMPTZ)│
└─────────────────────┘      │ updated_at (TIMESTAMPTZ)│
                              └─────────────────────┘
                                       │
                                       ▼
┌─────────────────────┐      ┌─────────────────────┐
│    PORTAFOLIO       │      │   AGENDAMIENTOS     │
├─────────────────────┤      ├─────────────────────┤
│ id (PK, UUID)       │      │ id (PK, UUID)       │
│ titulo (VARCHAR)    │      │ contacto_id (FK)    │
│ descripcion (TEXT)  │      │ fecha_hora (TIMESTAMPTZ)│
│ imagen_url (TEXT)   │      │ duracion (INTEGER)  │
│ tecnologias (TEXT)  │      │ tipo (VARCHAR)      │
│ enlace (VARCHAR)    │      │ estado (ENUM)       │
│ tipo (VARCHAR)      │      │ notas (TEXT)        │
│ destacado (BOOLEAN) │      │ created_at (TIMESTAMPTZ)│
│ activo (BOOLEAN)    │      │ updated_at (TIMESTAMPTZ)│
│ created_at (TIMESTAMPTZ)   └─────────────────────┘
│ updated_at (TIMESTAMPTZ)│
└─────────────────────┘

┌─────────────────────┐      ┌─────────────────────┐
│   TESTIMONIOS       │      │  CONTENIDO          │
├─────────────────────┤      ├─────────────────────┤
│ id (PK, UUID)       │      │ id (PK, UUID)       │
│ nombre (VARCHAR)    │      │ titulo (VARCHAR)    │
│ rol (VARCHAR)       │      │ tipo (VARCHAR)      │
│ empresa (VARCHAR)   │      │ contenido (TEXT)    │
│ contenido (TEXT)    │      │ slug (VARCHAR)      │
│ calificacion (INT)  │      │ fecha_publi (DATE)  │
│ activo (BOOLEAN)    │      │ activo (BOOLEAN)    │
│ created_at (TIMESTAMPTZ)   │ created_at (TIMESTAMPTZ)│
│ updated_at (TIMESTAMPTZ)   │ updated_at (TIMESTAMPTZ)│
└─────────────────────┘      └─────────────────────┘

                                       │
                                       ▼
┌─────────────────────┐      ┌─────────────────────┐
│  DISPONIBILIDAD     │      │   REDES_SOCIALES    │
├─────────────────────┤      ├─────────────────────┤
│ id (PK, UUID)       │      │ id (PK, UUID)       │
│ dia_semana (INT)    │      │ plataforma (VARCHAR)│
│ hora_inicio (TIME)  │      │ url_perfil (VARCHAR)│
│ hora_fin (TIME)     │      │ activo (BOOLEAN)    │
│ activo (BOOLEAN)    │      │ created_at (TIMESTAMPTZ)│
│ created_at (TIMESTAMPTZ)   │ updated_at (TIMESTAMPTZ)│
│ updated_at (TIMESTAMPTZ)   └─────────────────────┘
└─────────────────────┘
```

### 4.2 Tablas Principales - Especificación

#### Tabla: contactos
```sql
CREATE TABLE contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  empresa VARCHAR(100),
  mensaje TEXT,
  fuente VARCHAR(50) DEFAULT 'formulario_web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_contactos_email ON contactos(email);
CREATE INDEX idx_contactos_created ON contactos(created_at);
```

#### Tabla: proyectos
```sql
CREATE TABLE proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  contacto_id UUID REFERENCES contactos(id) ON DELETE SET NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' 
    CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
  fecha_inicio DATE,
  fecha_fin DATE,
  presupuesto DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas de estado
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_proyectos_contacto ON proyectos(contacto_id);
```

#### Tabla: usuarios (para autenticación y RLS)
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  rol VARCHAR(20) DEFAULT 'admin' 
    CHECK (rol IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Trigger para sincronizar con auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usuarios (id, email, nombre)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nombre');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### Tabla: servicios
```sql
CREATE TABLE servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(12, 2),
  duracion_estimada INTEGER, -- en días
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: proyecto_servicios (relación many-to-many)
```sql
CREATE TABLE proyecto_servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
  precio_acordado DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proyecto_id, servicio_id)
);

-- Índices
CREATE INDEX idx_proyecto_servicios_proyecto ON proyecto_servicios(proyecto_id);
CREATE INDEX idx_proyecto_servicios_servicio ON proyecto_servicios(servicio_id);
```

#### Tabla: disponibilidad (para agendamiento hybrid)
```sql
CREATE TABLE disponibilidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=domingo, 6=sábado
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (hora_inicio < hora_fin)
);

-- Índices
CREATE INDEX idx_disponibilidad_dia ON disponibilidad(dia_semana);

-- Datos iniciales (lunes a viernes, 9am-6pm)
INSERT INTO disponibilidad (dia_semana, hora_inicio, hora_fin) VALUES
  (1, '09:00', '18:00'), -- Lunes
  (2, '09:00', '18:00'), -- Martes
  (3, '09:00', '18:00'), -- Miércoles
  (4, '09:00', '18:00'), -- Jueves
  (5, '09:00', '18:00'); -- Viernes
```

#### Tabla: pagos
```sql
CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
  monto DECIMAL(12, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'COP',
  metodo_pago VARCHAR(50),
  stripe_payment_id VARCHAR(100),
  stripe_session_id VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas de pagos
CREATE INDEX idx_pagos_proyecto ON pagos(proyecto_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_stripe ON pagos(stripe_session_id);
```

#### Tabla: agendamientos
```sql
CREATE TABLE agendamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contacto_id UUID REFERENCES contactos(id) ON DELETE SET NULL,
  fecha_hora TIMESTAMPTZ NOT NULL,
  duracion INTEGER DEFAULT 30, -- minutos
  tipo VARCHAR(50) DEFAULT 'reunion_inicial',
  estado VARCHAR(20) DEFAULT 'programada'
    CHECK (estado IN ('programada', 'confirmada', 'completada', 'cancelada')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas de agenda
CREATE INDEX idx_agendamientos_fecha ON agendamientos(fecha_hora);
CREATE INDEX idx_agendamientos_estado ON agendamientos(estado);
```

#### Tabla: redes_sociales
```sql
CREATE TABLE redes_sociales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plataforma VARCHAR(50) NOT NULL,
  url_perfil VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO redes_sociales (plataforma, url_perfil) VALUES
   ('facebook', 'https://facebook.com/oliverprada'),
   ('instagram', 'https://instagram.com/oliverprada'),
   ('tiktok', 'https://tiktok.com/@oliverprada');
```

#### Tabla: portafolio
```sql
CREATE TABLE portafolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  tecnologias TEXT,
  enlace VARCHAR(255),
  tipo VARCHAR(50) DEFAULT 'proyecto'
    CHECK (tipo IN ('proyecto', 'servicio', 'caso_study')),
  destacado BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_portafolio_destacado ON portafolio(destacado);
CREATE INDEX idx_portafolio_activo ON portafolio(activo);
```

#### Tabla: testimonios
```sql
CREATE TABLE testimonios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(100),
  empresa VARCHAR(100),
  contenido TEXT NOT NULL,
  calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_testimonios_activo ON testimonios(activo);
```

#### Tabla: contenido
```sql
CREATE TABLE contenido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(200) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  contenido TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  fecha_publi DATE DEFAULT CURRENT_DATE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contenido_tipo ON contenido(tipo);
CREATE INDEX idx_contenido_activo ON contenido(activo);
CREATE INDEX idx_contenido_slug ON contenido(slug);
```

### 4.3 Relaciones entre Entidades

```
auth.users (1) ──── (1) usuarios
contactos (1) ──── (N) proyectos
contactos (1) ──── (N) agendamientos
proyectos (1) ──── (N) pagos
proyectos (N) ──── (N) servicios (a través de proyecto_servicios)
disponibilidad (1) ──── (N) agendamientos (implícita por dia/hora)
portafolio (N) ──── (N) proyectos (a través de relación implícita)
```

### 4.4 Políticas Row Level Security (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecto_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE redes_sociales ENABLE ROW LEVEL SECURITY;

-- Función helper para verificar rol de admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para usuarios
CREATE POLICY "usuarios_select_own" ON usuarios FOR SELECT 
  USING (auth.uid() = id);
CREATE POLICY "usuarios_update_own" ON usuarios FOR UPDATE 
  USING (auth.uid() = id);

-- Políticas para contactos: lectura pública, escritura autenticada
CREATE POLICY "contactos_select" ON contactos FOR SELECT USING (true);
CREATE POLICY "contactos_insert" ON contactos FOR INSERT WITH CHECK (true);
CREATE POLICY "contactos_update" ON contactos FOR UPDATE 
  USING (is_admin());
CREATE POLICY "contactos_delete" ON contactos FOR DELETE 
  USING (is_admin());

-- Políticas para proyectos: solo admin
CREATE POLICY "proyectos_select" ON proyectos FOR SELECT 
  USING (is_admin());
CREATE POLICY "proyectos_insert" ON proyectos FOR INSERT 
  WITH CHECK (is_admin());
CREATE POLICY "proyectos_update" ON proyectos FOR UPDATE 
  USING (is_admin());
CREATE POLICY "proyectos_delete" ON proyectos FOR DELETE 
  USING (is_admin());

-- Políticas para servicios: lectura pública solo activos
CREATE POLICY "servicios_select" ON servicios FOR SELECT 
  USING (activo = true);
CREATE POLICY "servicios_admin_all" ON servicios FOR ALL 
  USING (is_admin());

-- Políticas para proyecto_servicios: solo admin
CREATE POLICY "proyecto_servicios_admin" ON proyecto_servicios FOR ALL 
  USING (is_admin());

-- Políticas para pagos: solo admin
CREATE POLICY "pagos_select" ON pagos FOR SELECT 
  USING (is_admin());
CREATE POLICY "pagos_insert" ON pagos FOR INSERT 
  WITH CHECK (is_admin());
CREATE POLICY "pagos_update" ON pagos FOR UPDATE 
  USING (is_admin());

-- Políticas para agendamientos (no requiere auth del usuario)
CREATE POLICY "agendamientos_insert" ON agendamientos FOR INSERT 
  WITH CHECK (true); -- Público puede solicitar sin auth
CREATE POLICY "agendamientos_admin_all" ON agendamientos FOR ALL 
  USING (is_admin()); -- Solo admin puede ver/modificar

-- Políticas para disponibilidad: lectura pública
CREATE POLICY "disponibilidad_select" ON disponibilidad FOR SELECT 
  USING (activo = true);
CREATE POLICY "disponibilidad_admin" ON disponibilidad FOR ALL 
  USING (is_admin());

-- Políticas para redes sociales: lectura pública
CREATE POLICY "redes_sociales_select" ON redes_sociales FOR SELECT 
  USING (activo = true);
CREATE POLICY "redes_sociales_admin" ON redes_sociales FOR ALL 
  USING (is_admin());

-- Políticas para portafolio: lectura pública (activos), escritura admin
CREATE POLICY "portafolio_select" ON portafolio FOR SELECT 
  USING (activo = true);
CREATE POLICY "portafolio_admin" ON portafolio FOR ALL 
  USING (is_admin());

-- Políticas para testimonios: lectura pública (activos), escritura admin
CREATE POLICY "testimonios_select" ON testimonios FOR SELECT 
  USING (activo = true);
CREATE POLICY "testimonios_admin" ON testimonios FOR ALL 
  USING (is_admin());

-- Políticas para contenido: lectura pública (activo), escritura admin
CREATE POLICY "contenido_select" ON contenido FOR SELECT 
  USING (activo = true);
CREATE POLICY "contenido_admin" ON contenido FOR ALL 
  USING (is_admin());
```

---

## 5. DISEÑO DE APIs

### 5.1 Endpoints Principales

#### Contactos API
```
POST   /api/contactos          → Crear contacto (lead)
GET    /api/contactos           → Listar contactos (admin)
GET    /api/contactos/:id       → Obtener contacto (admin)
PUT    /api/contactos/:id       → Actualizar contacto (admin)
DELETE /api/contactos/:id       → Eliminar contacto (admin)
```

#### Proyectos API
```
POST   /api/proyectos           → Crear proyecto (admin)
GET    /api/proyectos           → Listar proyectos (admin)
GET    /api/proyectos/:id       → Obtener proyecto (admin)
PUT    /api/proyectos/:id       → Actualizar proyecto (admin)
DELETE /api/proyectos/:id       → Eliminar proyecto (admin)
```

#### Servicios API
```
GET    /api/servicios           → Listar servicios (público)
GET    /api/servicios/:id       → Obtener servicio (público)
```

#### Pagos API
```
POST   /api/pagos/crear-sesión  → Crear sesión Stripe Checkout
POST   /api/pagos/webhook       → Webhook Stripe (confirmación)
GET    /api/pagos               → Listar pagos (admin)
GET    /api/pagos/:id           → Obtener pago (admin)
POST   /api/pagos/:id/reembolsar → Reembolsar pago (admin)
```

#### Agendamiento API
```
POST   /api/agendamientos       → Crear agendamiento (público)
GET    /api/agendamientos/disponibilidad → Ver slots disponibles
GET    /api/agendamientos       → Listar agendamientos (admin)
PUT    /api/agendamientos/:id   → Actualizar estado (admin)
DELETE /api/agendamientos/:id   → Cancelar agendamiento (admin)
```

#### Portafolio API
```
GET    /api/portafolio           → Listar portafolio (público, activos)
GET    /api/portafolio/:id       → Obtener proyecto (público)
POST   /api/portafolio           → Crear portafolio (admin)
PUT    /api/portafolio/:id       → Actualizar portafolio (admin)
DELETE /api/portafolio/:id       → Eliminar portafolio (admin)
```

#### Testimonios API
```
GET    /api/testimonios          → Listar testimonios (público, activos)
POST   /api/testimonios          → Crear testimonio (admin)
PUT    /api/testimonios/:id      → Actualizar testimonio (admin)
DELETE /api/testimonios/:id      → Eliminar testimonio (admin)
```

#### Contenido API
```
GET    /api/contenido            → Listar contenido (público, activo)
GET    /api/contenido/:slug      → Obtener contenido por slug (público)
POST   /api/contenido            → Crear contenido (admin)
PUT    /api/contenido/:id        → Actualizar contenido (admin)
DELETE /api/contenido/:id        → Eliminar contenido (admin)
```

#### Autenticación API
```
POST   /api/auth/login          → Login email/password
POST   /api/auth/logout         → Cerrar sesión
GET    /api/auth/me             → Obtener usuario actual
PUT    /api/auth/password       → Cambiar contraseña
```

### 5.2 Estructura de Request/Response

#### POST /api/contactos
```json
// Request
{
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "telefono": "+57 300 1234567",
  "empresa": "Mi Empresa S.A.S",
  "mensaje": "Necesito un sitio web para mi negocio",
  "fuente": "formulario_web"
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "nombre": "Juan Pérez",
    "email": "juan@empresa.com",
    "created_at": "2026-09-01T20:00:00Z"
  },
  "message": "Contacto registrado exitosamente"
}
```

#### POST /api/pagos/crear-sesión
```json
// Request
{
  "proyecto_id": "uuid-proyecto",
  "monto": 5000000,
  "moneda": "COP",
  "descripcion": "Desarrollo web completo"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "session_id": "cs_test_abc123",
    "url": "https://checkout.stripe.com/pay/cs_test_abc123",
    "expires_at": "2026-09-01T21:00:00Z"
  }
}
```

### 5.3 Estructura de Errores Estándar

```json
// Error 400 - Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": [
      { "field": "email", "message": "El email es obligatorio" },
      { "field": "nombre", "message": "Mínimo 2 caracteres" }
    ]
  }
}

// Error 401 - Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticación requerido"
  }
}

// Error 403 - Forbidden
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para realizar esta acción"
  }
}

// Error 404 - Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Recurso no encontrado"
  }
}

// Error 409 - Conflict
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "El email ya está registrado"
  }
}

// Error 429 - Rate Limited
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Demasiadas solicitudes, intenta más tarde",
    "retry_after": 60
  }
}

// Error 500 - Internal Server Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor"
  }
}
```

### 5.4 Paginación

```
GET /api/contactos?page=1&limit=20&sort=created_at&order=desc
```

#### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| page | integer | 1 | Número de página |
| limit | integer | 20 | Elementos por página (máx 100) |
| sort | string | created_at | Campo para ordenar |
| order | string | desc | asc o desc |
| search | string | - | Búsqueda por nombre/email |

#### Response con Paginación

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### 5.5 Rate Limiting

| Endpoint | Límite | Ventana | Acción |
|----------|--------|---------|--------|
| POST /api/contactos | 5 req | 1 min | Bloquear |
| POST /api/pagos/crear-sesión | 3 req | 1 min | Bloquear |
| POST /api/agendamientos | 5 req | 1 min | Bloquear |
| GET /api/* | 100 req | 1 min | Bloquear |
| POST /api/pagos/webhook | Sin límite | - | - |
| POST /api/auth/login | 5 req | 15 min | Bloquear |

### 5.6 Webhook Stripe - Flujo Completo

#### 5.6.1 Eventos Manejados

| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | Marcar pago como completado, actualizar proyecto |
| `payment_intent.payment_failed` | Marcar pago como fallido |
| `charge.refunded` | Marcar pago como reembolsado |
| `invoice.payment_succeeded` | Registrar pago recurrente (futuro) |

#### 5.6.2 Implementación Webhook

```javascript
// Edge Function: /api/pagos/webhook
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  // 1. Verificar firma del webhook
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ 
      success: false,
      error: { code: 'INVALID_SIGNATURE', message: 'Firma inválida' }
    });
  }

  // 2. Procesar evento
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await handleRefund(charge);
        break;
      }
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error procesando webhook:', err);
    return res.status(500).json({ 
      success: false,
      error: { code: 'WEBHOOK_ERROR', message: 'Error procesando webhook' }
    });
  }
}

// 3. Handlers
async function handleCheckoutCompleted(session) {
  const { supabase } = await import('../services/supabase');
  
  // Actualizar pago en Supabase
  const { error } = await supabase
    .from('pagos')
    .update({
      estado: 'completado',
      stripe_payment_id: session.payment_intent,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_session_id', session.id);

  if (error) throw error;

  // Actualizar estado del proyecto si es necesario
  const pago = await supabase
    .from('pagos')
    .select('proyecto_id')
    .eq('stripe_session_id', session.id)
    .single();

  if (pago.data?.proyecto_id) {
    await supabase
      .from('proyectos')
      .update({ estado: 'en_progreso' })
      .eq('id', pago.data.proyecto_id)
      .eq('estado', 'pendiente');
  }
}

async function handlePaymentFailed(paymentIntent) {
  const { supabase } = await import('../services/supabase');
  
  await supabase
    .from('pagos')
    .update({
      estado: 'fallido',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_id', paymentIntent.id);
}

async function handleRefund(charge) {
  const { supabase } = await import('../services/supabase');
  
  await supabase
    .from('pagos')
    .update({
      estado: 'reembolsado',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_payment_id', charge.payment_intent);
}
```

#### 5.6.3 Crear Sesión Stripe Checkout (Netlify Function)

```javascript
// netlify/functions/create-checkout.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Solo accesible desde Netlify Functions (secret key segura)
export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { proyecto_id, monto, moneda = 'COP', descripcion } = await request.json();

    // 1. Registrar pago pendiente en Supabase (con transacción SQL)
    const { data: pago, error: pagoError } = await supabase
      .from('pagos')
      .insert({
        proyecto_id,
        monto,
        moneda,
        estado: 'pendiente'
      })
      .select()
      .single();

    if (pagoError) throw pagoError;

    // 2. Crear sesión de Stripe (múltiples métodos de pago)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pse', 'nequi'],
      line_items: [{
        price_data: {
          currency: moneda.toLowerCase(),
          product_data: {
            name: descripcion || 'Servicios de Desarrollo',
            description: `Proyecto: ${proyecto_id}`
          },
          unit_amount: monto
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${new URL(request.url).origin}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/pago/cancelado`,
      metadata: {
        proyecto_id,
        pago_id: pago.id
      }
    });

    // 3. Actualizar pago con session_id
    await supabase
      .from('pagos')
      .update({ stripe_session_id: session.id })
      .eq('id', pago.id);

    return new Response(JSON.stringify({
      success: true,
      data: {
        session_id: session.id,
        url: session.url,
        expires_at: new Date(session.expires_at * 1000).toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'CHECKOUT_ERROR', message: error.message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### 5.3 Autenticación y Autorización

#### 5.3.1 Flujo de Autenticación Admin

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Login     │───▶│   Supabase  │───▶│   JWT       │───▶│   RLS       │
│   Email/    │    │   Auth      │    │   Token     │    │   Policies  │
│   Password  │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 5.3.2 Configuración Supabase Auth

```javascript
// services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### 5.3.3 Login con Email/Password

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signIn, signOut };
};
```

#### 5.3.4 Middleware de Autenticación (Edge Functions)

```javascript
// Middleware de autenticación
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token requerido' }
    });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ 
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token inválido' }
    });
  }

  req.user = user;
  next();
};

// Middleware de autorización (admin)
const authorizeAdmin = async (req, res, next) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', req.user.id)
    .single();

  if (error || data?.rol !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: { code: 'FORBIDDEN', message: 'Acceso denegado' }
    });
  }

  req.userRole = data.rol;
  next();
};
```

---

## 6. DISEÑO DEL FRONTEND (REACT)

### 6.1 Estructura de Componentes

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── forms/
│   │   ├── ContactForm.jsx
│   │   ├── BookingForm.jsx
│   │   └── PaymentForm.jsx
│   └── sections/
│       ├── Hero.jsx
│       ├── Services.jsx
│       ├── Portfolio.jsx
│       └── Testimonials.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Portfolio.jsx
│   ├── Contact.jsx
│   ├── Booking.jsx
│   ├── Payment.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── Contacts.jsx
│       ├── Projects.jsx
│       └── Payments.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useContact.js
│   └── usePayment.js
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── supabase.js
│   ├── contactService.js
│   ├── projectService.js
│   └── paymentService.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── styles/
│   └── globals.css
├── App.jsx
└── main.jsx
```

### 6.2 Configuración PWA

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Oliver Prada - Servicios Técnicos',
        short_name: 'OP Services',
        description: 'Frontend Development & Database Management',
        theme_color: '#1E40AF', // Azul
        background_color: '#000000', // Negro
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 5 * 60 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
});
```

### 6.2.1 Estrategia de Caché (Service Worker)

| Recurso | Estrategia | TTL | Notas |
|---------|------------|-----|-------|
| Assets estáticos (JS, CSS) | Cache First | 1 año | Build versionado |
| Imágenes | Cache First | 30 días | LRU eviction |
| API - Servicios | Cache First | 5 minutos | Datos semi-estáticos |
| API - Contactos | Network First | - | Datos dinámicos |
| API - Pagos | Network Only | - | Siempre fresco |
| API - Agendamientos | Network First | - | Datos dinámicos |
| HTML (navegación) | Network First | - | Siempre intentar red |

```javascript
// service-worker.js (configuración Workbox)
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Cache de servicios (datos semi-estáticos)
registerRoute(
  ({ url }) => url.pathname === '/api/servicios',
  new CacheFirst({
    cacheName: 'servicios-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 5, maxAgeSeconds: 5 * 60 })
    ]
  })
);

// Cache de contactos (datos dinámicos)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/contactos'),
  new NetworkFirst({
    cacheName: 'contactos-cache',
    networkTimeoutSeconds: 3
  })
);
```

### 6.3 Estilos con Tailwind CSS (Colores Azul y Negro)

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Azul principal
          900: '#1e3a8a',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#000000', // Negro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 7. SEGURIDAD

### 7.1 Medidas de Seguridad Implementadas

| Capa | Medida | Implementación |
|------|--------|----------------|
| Transporte | HTTPS/SSL | Netlify auto-SSL |
| Autenticación | JWT Tokens | Supabase Auth (email/password) |
| Autorización | RLS Policies | PostgreSQL Row Level Security |
| API | Rate Limiting | Netlify Functions (ver 5.5) |
| Backend Secrets | Netlify Functions | Stripe secret key nunca expuesta al frontend |
| Datos | Encriptación | Supabase at-rest encryption |
| Frontend | XSS Protection | React auto-escaping |
| Forms | CSRF Protection | SameSite cookies |
| Pagos | PCI Compliance | Stripe (no toca datos tarjeta) |
| Webhook | Firma Stripe | Verificación de firma obligatoria |
| Transacciones | SQL Transactions | Atomicidad en operaciones de pago |

### 7.2 Variables de Entorno Requeridas

```env
# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx  # Solo Netlify Functions
SUPABASE_URL=https://xxxx.supabase.co  # Solo Netlify Functions

# Stripe (solo en Netlify Functions, nunca en frontend)
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxx  # Solo para mostrar logo

# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Email (Notificaciones - Resend)
RESEND_API_KEY=re_xxxx
ADMIN_EMAIL=oliver@ejemplo.com

# WhatsApp (Recordatorios - WhatsApp Business API)
WHATSAPP_API_TOKEN=xxxx
WHATSAPP_PHONE_NUMBER_ID=xxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=xxxx

# Google Calendar (Solo lectura)
GOOGLE_CALENDAR_API_KEY=xxxx
GOOGLE_CALENDAR_ID=primary
```

---

## 8. DESPLIEGUE E INFRAESTRUCTURA

### 8.1 Pipeline de Despliegue

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  CÓDIGO │───▶│  BUILD  │───▶│  TEST   │───▶│ DEPLOY  │
│  (Git)  │    │ (Vite)  │    │(Vitest) │    │(Netlify)│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
  GitHub      npm run build   npm test     CDN Global
```

### 8.2 Configuración de Hosting

**Netlify (Recomendado):**
- Plan: Starter (Gratis)
- Build Command: `npm run build`
- Publish Directory: `dist`
- Node Version: 18.x
- Environment Variables: Configurar en dashboard

**Alternativa - Vercel:**
- Plan: Hobby (Gratis)
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### 8.3 Costos Estimados de Infraestructura

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Netlify CDN | Starter | $0 |
| Supabase | Free Tier | $0 |
| Stripe | Pay-as-you-go | 2.9% + $0.30/transacción |
| Dominio | Namecheap | ~$1 (anual ~$12) |
| Email (Resend) | Free | $0 |
| **Total Fijo** | - | **~$1/mes** |

### 8.4 Backup y Retención de Datos

| Componente | Estrategia | Frecuencia | Retención |
|------------|------------|------------|-----------|
| PostgreSQL (Supabase) | Backup automático | Diario | 30 días |
| Archivos (Storage) | Versionamiento | Continuo | 30 días |
| Código fuente | Git | Continuo | Indefinido |
| Variables de entorno | Exportación manual | Mensual | - |

#### Configuración de Backup Supabase

```bash
# Exportar backup manual
supabase db dump --db-url postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -d postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres < backup_20260901.sql
```

---

## 9. FUNCIONALIDADES DEL SISTEMA

### 9.1 Autenticación

| Característica | Implementación |
|----------------|----------------|
| Método | Email/Password via Supabase Auth |
| Usuarios | Múltiples con roles (admin, viewer) |
| Creación primer admin | Script SQL directo |
| Sesiones | JWT tokens con refresh automático |
| Password reset | Email con link de recuperación |

### 9.2 Sistema de Pagos

| Característica | Implementación |
|----------------|----------------|
| Proveedor | Stripe Checkout |
| Eventos manejados | Todos los eventos de pago |
| Datos almacenados | Monto + estado + ID en Supabase |
| Reembolsos | Sí, con endpoint admin |
| Moneda | COP (Peso Colombiano) |
| Webhook | Verificación de firma + reconciliación |

### 9.3 Agendamiento

| Característica | Implementación |
|----------------|----------------|
| Tipo | Hybrid (slots predefinidos, admin confirma) |
| Autenticación | No requiere login (solo email) |
| Flujo | Usuario ve slots → selecciona → ingresa email → admin confirma |
| Integración Google Calendar | Solo lectura (verificar disponibilidad) |
| Recordatorios | Email 24h antes + WhatsApp 1h antes |
| Slots | Configurables por admin (tabla disponibilidad L-V 9-18) |

#### Flujo de Agendamiento

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Usuario    │───▶│  Verificar  │───▶│  Seleccionar│───▶│  Enviar     │
│  Solicita   │    │  Slots      │    │  Slot       │    │  Solicitud  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                        (sin auth)                              │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  WhatsApp   │◀──│  Email      │◀──│  Admin       │◀──│  Notificar  │
│  1h antes   │    │  24h antes  │    │  Confirma    │    │  Admin      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 9.4 Notificaciones

| Tipo | Canal | Destinatario | Trigger |
|------|-------|--------------|---------|
| Nuevo contacto | Email + Dashboard | Admin | Formulario enviado |
| Pago completado | Email + Dashboard | Admin | Webhook Stripe |
| Agendamiento | Email | Admin + Cliente | Solicitud/Confirmación |
| Recordatorio cita | Email 24h + WhatsApp 1h | Cliente | Antes de cita |

#### Implementación de Notificaciones

```javascript
// services/notificationService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email
export const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: 'Oliver Prada <notificaciones@oliverprada.com>',
    to,
    subject,
    html
  });
  
  if (error) throw error;
  return data;
};

// WhatsApp (via Netlify Function)
export const sendWhatsApp = async ({ to, message }) => {
  const response = await fetch('/.netlify/functions/send-whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message })
  });
  return response.json();
};

// Templates de email
export const templates = {
  nuevoContacto: (contacto) => ({
    subject: 'Nuevo contacto desde tu web',
    html: `
      <h2>Nuevo lead registrado</h2>
      <p><strong>Nombre:</strong> ${contacto.nombre}</p>
      <p><strong>Email:</strong> ${contacto.email}</p>
      <p><strong>Empresa:</strong> ${contacto.empresa || 'N/A'}</p>
      <p><strong>Mensaje:</strong> ${contacto.mensaje}</p>
    `
  }),
  
  pagoCompletado: (pago) => ({
    subject: 'Pago recibido',
    html: `
      <h2>Pago confirmado</h2>
      <p><strong>Monto:</strong> $${pago.monto.toLocaleString()} ${pago.moneda}</p>
      <p><strong>Proyecto:</strong> ${pago.proyecto_id}</p>
    `
  }),
  
  recordatorioCita: (cita) => ({
    subject: 'Recordatorio de cita',
    html: `
      <h2>Tienes una cita mañana</h2>
      <p><strong>Fecha:</strong> ${cita.fecha_hora}</p>
      <p><strong>Tipo:</strong> ${cita.tipo}</p>
      <p><strong>Notas:</strong> ${cita.notas || 'N/A'}</p>
    `
  })
};
```

### 9.5 Contenido

| Característica | Implementación |
|----------------|----------------|
| Tipo | Todo hardcodeado en React |
| Actualización | Panel de administración |
| Estructura | Componentes reutilizables |
| Imágenes | Supabase Storage |

### 9.6 SEO

| Característica | Implementación |
|----------------|----------------|
| Sitemap | Sí, pre-generado |
| Meta tags | Configurados por página |
| Open Graph | Implementado |
| Robots.txt | Configurado |

---

## 10. ROADMAP DE IMPLEMENTACIÓN

### Semana 1: Diseño y Arquitectura
- [ ] Configurar proyecto React + Vite
- [ ] Instalar dependencias (Tailwind, React Router, Zustand, Axios)
- [ ] Configurar Supabase (URL, keys)
- [ ] Diseñar modelo de datos completo (8 tablas)
- [ ] Crear tablas y políticas RLS (incluyendo agendamientos sin auth)
- [ ] Configurar autenticación email/password (solo admin)
- [ ] Crear usuario admin inicial (script SQL)
- [ ] Crear Wireframes de páginas principales
- [ ] Configurar Service Worker con estrategia de caché

### Semana 2: Desarrollo Core
- [ ] Implementar Header/Footer/Navbar
- [ ] Desarrollar página Home (Hero, Services, Portfolio)
- [ ] Crear formulario de contacto con React Hook Form
- [ ] Integrar formulario con Supabase API
- [ ] Implementar login admin con Supabase Auth
- [ ] Crear panel de administración básico
- [ ] Desarrollar CRUD de proyectos
- [ ] Implementar gestión de servicios

### Semana 3: Pagos, Agendamiento y Notificaciones
- [ ] Implementar Stripe Checkout en Netlify Functions
- [ ] Configurar múltiples métodos de pago (Tarjeta + PSE + Nequi)
- [ ] Crear webhook de confirmación de pago (con transacciones SQL)
- [ ] Manejar todos los eventos de Stripe
- [ ] Implementar endpoint de reembolsos
- [ ] Desarrollar sistema de agendamiento con slots predefinidos
- [ ] Integrar disponibilidad con Google Calendar (solo lectura)
- [ ] Configurar notificaciones por email (Resend)
- [ ] Implementar recordatorios por WhatsApp (WhatsApp Business API)

### Semana 4: Testing, Despliegue y Capacitación
- [ ] Testing unitario con Vitest
- [ ] Testing de componentes con React Testing Library
- [ ] Pruebas de integración con Supabase
- [ ] Testing de flujo de pago completo
- [ ] Testing de flujo de agendamiento
- [ ] Corrección de bugs
- [ ] Optimización de rendimiento
- [ ] Pruebas de PWA (Lighthouse)
- [ ] Desplegar en Netlify (Functions + CDN)
- [ ] Configurar dominio personalizado
- [ ] Configurar backup automático (Supabase)
- [ ] Configurar Google Analytics
- [ ] Documentar proceso de administración
- [ ] Capacitación sobre actualización de contenido
- [ ] Entrega final y retroalimentación

---

## 11. INDICADORES DE ÉXITO

### 11.1 Métricas Técnicas
| Métrica | Objetivo |
|---------|----------|
| Lighthouse Score | > 90 en todas las categorías |
| First Contentful Paint | < 1.5 segundos |
| Largest Contentful Paint | < 2.5 segundos |
| Time to Interactive | < 3.5 segundos |
| Cumulative Layout Shift | < 0.1 |

### 11.2 Métricas de Negocio
| Métrica | Objetivo 12 meses |
|---------|-------------------|
| Clientes captados | 3-4 |
| Ingresos generados | > $8.000.000 COP |
| Formularios recibidos | > 50 |
| Tasa de conversión | > 5% |

---

## 12. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Curva aprendizaje React | Media | Alto | Capacitación Semana 1, documentación |
| Integración pagos | Baja | Alto | Usar Stripe Checkout (no custom) |
| Hosting compartido límites | Baja | Medio | Supabase maneja escalamiento |
| PWA no funcione | Baja | Medio | Testing Lighthouse continuo |
| Plazo insuficiente | Media | Alto | Priorizar MVP, features secundarias |

---

## 13. CONCLUSIONES

### 13.1 Resumen de Decisiones

La arquitectura **JAMstack + PWA con React y Supabase** es la óptima para este proyecto porque:

1. **Cumple al 100%** los requisitos del BRIEF (React, PWA, base de datos relacional)
2. **Escalable** para crecer de 3-4 a 50+ clientes
3. **Rentable** con costos de infraestructura mínimos (~$1/mes)
4. **Moderna** y alineada con estándares de la industria
5. **Educativa** para aprender conceptos valiosos de arquitectura

### 13.2 Próximos Pasos

1. Aprobar este documento de arquitectura
2. Crear repositorio en GitHub
3. Configurar proyecto base
4. Iniciar desarrollo Semana 1

---

## 14. DECISIONES DEL USUARIO (BACKEND ENGINEER REVIEW)

### 14.1 Resumen de Decisiones Tomadas

| # | Decisión | Respuesta | Implementación |
|---|----------|-----------|----------------|
| 1 | Agendamiento auth | No requiere auth | Solo con email (sin login) |
| 2 | Creación primer admin | Script SQL directo | Inserción en auth.users + trigger |
| 3 | Múltiples admins | Solo el primero manual | Resto se crea desde panel admin |
| 4 | Tipo checkout | Stripe Checkout | Redirección a página Stripe |
| 5 | Métodos de pago | Tarjeta + PSE + Nequi | Múltiples métodos en Checkout |
| 6 | Facturación DIAN | Futuro | No incluido en MVP |
| 7 | Disponibilidad | Slots predefinidos | Tabla disponibilidad (L-V 9-18) |
| 8 | Google Calendar | Solo lectura | Verificar disponibilidad |
| 9 | Recordatorios | Email + WhatsApp | Resend + WhatsApp Business API |
| 10 | Ubicación Functions | Netlify Functions | No Supabase Edge Functions |
| 11 | Caché API | Service Worker | Cache-first strategy |
| 12 | Monitoreo | Google Analytics | Métricas básicas de uso |
| 13 | Transacciones pagos | SQL transactions | Atomicidad en creación de pago |
| 14 | Auth por lead | No, solo admin | Leads no tienen cuenta auth |

### 14.2 Correcciones Técnicas Aplicadas

1. **Tabla usuarios creada** - Necesaria para RLS y autenticación
2. **Tabla proyecto_servicios** - Relación many-to-many servicios-proyectos
3. **Tabla disponibilidad** - Para sistema de agendamiento con slots predefinidos
4. **Políticas RLS corregidas** - Agendamientos no requiere auth (solo admin lectura)
5. **Estructura de errores API** - Estándar para todos los endpoints
6. **Paginación implementada** - Query params y response format
7. **Rate limiting definido** - Por endpoint y ventana de tiempo
8. **Webhook Stripe completo** - Verificación firma + handlers
9. **Stripe en Netlify Functions** - Secret key nunca expuesta al frontend
10. **Transacciones SQL** - Atomicidad en operaciones de pago
11. **Métodos de pago múltiples** - Tarjeta + PSE + Nequi
12. **Recordatorios multi-canal** - Email (Resend) + WhatsApp Business
13. **Caché Service Worker** - Cache-first para API responses
14. **Google Analytics** - Monitoreo de métricas de uso
15. **Backup configurado** - 30 días retención

---

**APROBACIONES:**

| Rol | Nombre | Estado | Fecha |
|-----|--------|--------|-------|
| Arquitecto Software | Chief Software Architect | ✅ Aprobado | 01/09/2026 |
| Cliente | Oliver Santiago Prada Gómez | ⏳ Pendiente | - |
| Gerente Producto | Senior Product Manager | ⏳ Pendiente | - |
| Ingeniero Backend | Senior Backend Engineer | ✅ Aprobado | 08/09/2026 |

---

*Documento generado por Chief Software Architect - OpenCode Workspace Framework v1.2*
*Actualizado por Senior Backend Engineer - 08/09/2026*
