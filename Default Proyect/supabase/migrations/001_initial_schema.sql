-- ==========================================================
-- OLIVER PRADA - SERVICIOS TÉCNICOS
-- ESQUEMA DE BASE DE DATOS COMPLETO (SUPABASE / POSTGRESQL 15)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Tabla: usuarios (Sincronizada con auth.users)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  rol VARCHAR(20) DEFAULT 'admin' CHECK (rol IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Trigger de sincronización de nuevos usuarios con auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usuarios (id, email, nombre, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'admin')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      nombre = EXCLUDED.nombre;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Tabla: contactos (Leads recibidos)
CREATE TABLE IF NOT EXISTS contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  empresa VARCHAR(100),
  mensaje TEXT,
  fuente VARCHAR(50) DEFAULT 'formulario_web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contactos_email ON contactos(email);
CREATE INDEX IF NOT EXISTS idx_contactos_created ON contactos(created_at);

-- 4. Tabla: proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  contacto_id UUID REFERENCES contactos(id) ON DELETE SET NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
  fecha_inicio DATE,
  fecha_fin DATE,
  presupuesto DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_proyectos_contacto ON proyectos(contacto_id);

-- 5. Tabla: servicios
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(12, 2),
  duracion_estimada INTEGER, -- en días
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios(activo);

-- 6. Tabla: proyecto_servicios (Relación Many-to-Many)
CREATE TABLE IF NOT EXISTS proyecto_servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
  precio_acordado DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proyecto_id, servicio_id)
);

CREATE INDEX IF NOT EXISTS idx_ps_proyecto ON proyecto_servicios(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_ps_servicio ON proyecto_servicios(servicio_id);

-- 7. Tabla: disponibilidad (Slots semanales de agendamiento)
CREATE TABLE IF NOT EXISTS disponibilidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=domingo, 1=lunes, ..., 6=sábado
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (hora_inicio < hora_fin)
);

CREATE INDEX IF NOT EXISTS idx_disponibilidad_dia ON disponibilidad(dia_semana);

-- 8. Tabla: pagos
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
  monto DECIMAL(12, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'COP',
  metodo_pago VARCHAR(50),
  stripe_payment_id VARCHAR(100),
  stripe_session_id VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagos_proyecto ON pagos(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_stripe ON pagos(stripe_session_id);

-- 9. Tabla: agendamientos (Citas con o sin registro de cliente)
CREATE TABLE IF NOT EXISTS agendamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contacto_id UUID REFERENCES contactos(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  fecha_hora TIMESTAMPTZ NOT NULL,
  duracion INTEGER DEFAULT 30, -- minutos
  tipo VARCHAR(50) DEFAULT 'reunion_inicial',
  estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'confirmada', 'completada', 'cancelada')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agendamientos_fecha ON agendamientos(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_agendamientos_estado ON agendamientos(estado);

-- 10. Tabla: redes_sociales
CREATE TABLE IF NOT EXISTS redes_sociales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plataforma VARCHAR(50) NOT NULL,
  url_perfil VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Tabla: portafolio
CREATE TABLE IF NOT EXISTS portafolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  tecnologias TEXT,
  enlace VARCHAR(255),
  tipo VARCHAR(50) DEFAULT 'proyecto' CHECK (tipo IN ('proyecto', 'servicio', 'caso_study')),
  destacado BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portafolio_destacado ON portafolio(destacado);
CREATE INDEX IF NOT EXISTS idx_portafolio_activo ON portafolio(activo);

-- 12. Tabla: testimonios
CREATE TABLE IF NOT EXISTS testimonios (
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

CREATE INDEX IF NOT EXISTS idx_testimonios_activo ON testimonios(activo);

-- 13. Tabla: contenido (Blog y guías técnicas)
CREATE TABLE IF NOT EXISTS contenido (
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

CREATE INDEX IF NOT EXISTS idx_contenido_tipo ON contenido(tipo);
CREATE INDEX IF NOT EXISTS idx_contenido_activo ON contenido(activo);
CREATE INDEX IF NOT EXISTS idx_contenido_slug ON contenido(slug);

-- ==========================================================
-- FUNCIONES RPC
-- ==========================================================

-- Función Helper de Seguridad para RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función RPC: Métricas del Dashboard
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON AS $$
SELECT json_build_object(
  'contactos_mes', (SELECT COUNT(*) FROM contactos WHERE created_at >= date_trunc('month', NOW())),
  'proyectos_activos', (SELECT COUNT(*) FROM proyectos WHERE estado IN ('pendiente', 'en_progreso')),
  'pagos_recibidos', (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 'completado' AND created_at >= date_trunc('month', NOW())),
  'agendamientos_proximos', (SELECT COUNT(*) FROM agendamientos WHERE fecha_hora >= NOW() AND estado IN ('programada', 'confirmada'))
);
$$ LANGUAGE sql SECURITY DEFINER;

-- Función RPC: Disponibilidad y slots para agendamiento
CREATE OR REPLACE FUNCTION get_available_slots(
  p_fecha_inicio DATE,
  p_fecha_fin DATE
)
RETURNS JSON AS $$
DECLARE
  resultado JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'fecha', d.fecha,
      'dia_semana', EXTRACT(DOW FROM d.fecha),
      'slots', (
        SELECT json_agg(
          json_build_object(
            'hora', slot.hora,
            'disponible', NOT EXISTS (
              SELECT 1 FROM agendamientos a
              WHERE a.fecha_hora::date = d.fecha
                AND a.fecha_hora::time = slot.hora
                AND a.estado != 'cancelada'
            )
          )
        )
        FROM (
          SELECT generate_series(
            d2.hora_inicio,
            d2.hora_fin - interval '30 minutes',
            interval '30 minutes'
          )::time AS hora
          FROM disponibilidad d2
          WHERE d2.dia_semana = EXTRACT(DOW FROM d.fecha)
            AND d2.activo = true
        ) slot
      )
    )
  )
  INTO resultado
  FROM generate_series(p_fecha_inicio, p_fecha_fin, '1 day') d(fecha);

  RETURN COALESCE(resultado, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecto_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE redes_sociales ENABLE ROW LEVEL SECURITY;
ALTER TABLE portafolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenido ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios
CREATE POLICY "usuarios_select_own" ON usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "usuarios_update_own" ON usuarios FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "usuarios_admin_all" ON usuarios FOR ALL USING (is_admin());

-- Políticas: contactos (Público puede insertar leads, solo admin puede ver/editar/borrar)
CREATE POLICY "contactos_insert_public" ON contactos FOR INSERT WITH CHECK (true);
CREATE POLICY "contactos_admin_select" ON contactos FOR SELECT USING (is_admin());
CREATE POLICY "contactos_admin_update" ON contactos FOR UPDATE USING (is_admin());
CREATE POLICY "contactos_admin_delete" ON contactos FOR DELETE USING (is_admin());

-- Políticas: proyectos (Solo admin)
CREATE POLICY "proyectos_admin_all" ON proyectos FOR ALL USING (is_admin());

-- Políticas: servicios (Público lee activos, admin gestiona todo)
CREATE POLICY "servicios_select_public" ON servicios FOR SELECT USING (activo = true);
CREATE POLICY "servicios_admin_all" ON servicios FOR ALL USING (is_admin());

-- Políticas: proyecto_servicios (Solo admin)
CREATE POLICY "proyecto_servicios_admin" ON proyecto_servicios FOR ALL USING (is_admin());

-- Políticas: disponibilidad (Público lee activos, admin gestiona)
CREATE POLICY "disponibilidad_select_public" ON disponibilidad FOR SELECT USING (activo = true);
CREATE POLICY "disponibilidad_admin" ON disponibilidad FOR ALL USING (is_admin());

-- Políticas: pagos (Solo admin o service role de Netlify Functions)
CREATE POLICY "pagos_admin_all" ON pagos FOR ALL USING (is_admin());

-- Políticas: agendamientos (Público inserta citas sin auth, admin gestiona todo)
CREATE POLICY "agendamientos_insert_public" ON agendamientos FOR INSERT WITH CHECK (true);
CREATE POLICY "agendamientos_admin_all" ON agendamientos FOR ALL USING (is_admin());

-- Políticas: redes_sociales (Público lee activos, admin gestiona)
CREATE POLICY "redes_sociales_select_public" ON redes_sociales FOR SELECT USING (activo = true);
CREATE POLICY "redes_sociales_admin" ON redes_sociales FOR ALL USING (is_admin());

-- Políticas: portafolio (Público lee activos, admin gestiona)
CREATE POLICY "portafolio_select_public" ON portafolio FOR SELECT USING (activo = true);
CREATE POLICY "portafolio_admin_all" ON portafolio FOR ALL USING (is_admin());

-- Políticas: testimonios (Público lee activos, admin gestiona)
CREATE POLICY "testimonios_select_public" ON testimonios FOR SELECT USING (activo = true);
CREATE POLICY "testimonios_admin_all" ON testimonios FOR ALL USING (is_admin());

-- Políticas: contenido (Público lee activos, admin gestiona)
CREATE POLICY "contenido_select_public" ON contenido FOR SELECT USING (activo = true);
CREATE POLICY "contenido_admin_all" ON contenido FOR ALL USING (is_admin());
