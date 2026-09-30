CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: portafolio
CREATE TABLE portafolio (
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

CREATE INDEX idx_portafolio_destacado ON portafolio(destacado);
CREATE INDEX idx_portafolio_activo ON portafolio(activo);

-- Tabla: testimonios
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

CREATE INDEX idx_testimonios_activo ON testimonios(activo);

-- Tabla: contenido
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

CREATE INDEX idx_contenido_tipo ON contenido(tipo);
CREATE INDEX idx_contenido_activo ON contenido(activo);
CREATE INDEX idx_contenido_slug ON contenido(slug);

-- Función: get_dashboard_metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON AS $$
SELECT json_build_object(
  'contactos_mes', (SELECT COUNT(*) FROM contactos WHERE created_at >= date_trunc('month', NOW())),
  'proyectos_activos', (SELECT COUNT(*) FROM proyectos WHERE estado IN ('pendiente', 'en_progreso')),
  'pagos_recibidos', (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 'completado' AND created_at >= date_trunc('month', NOW())),
  'agendamientos_proximos', (SELECT COUNT(*) FROM agendamientos WHERE fecha_hora >= NOW() AND estado IN ('programada', 'confirmada'))
);
$$ LANGUAGE sql;

-- Función: get_available_slots
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
  FROM generate_series(p_fecha_inicio, p_fecha_fin, '1 day') d.fecha;

  RETURN resultado;
END;
$$ LANGUAGE plpgsql;
