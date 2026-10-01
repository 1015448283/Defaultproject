-- ==========================================================
-- OLIVER PRADA - SERVICIOS TÉCNICOS
-- DATOS INICIALES (SEED DATA)
-- ==========================================================

-- 1. Disponibilidad inicial (Lunes a Viernes, 09:00 a 18:00)
INSERT INTO disponibilidad (dia_semana, hora_inicio, hora_fin, activo) VALUES
  (1, '09:00', '18:00', true), -- Lunes
  (2, '09:00', '18:00', true), -- Martes
  (3, '09:00', '18:00', true), -- Miércoles
  (4, '09:00', '18:00', true), -- Jueves
  (5, '09:00', '18:00', true)  -- Viernes
ON CONFLICT DO NOTHING;

-- 2. Redes Sociales iniciales
INSERT INTO redes_sociales (plataforma, url_perfil, activo) VALUES
  ('facebook', 'https://facebook.com/oliverprada', true),
  ('instagram', 'https://instagram.com/oliverprada', true),
  ('tiktok', 'https://tiktok.com/@oliverprada', true)
ON CONFLICT DO NOTHING;

-- 3. Servicios iniciales
INSERT INTO servicios (nombre, descripcion, precio_base, duracion_estimada, activo) VALUES
  (
    'Desarrollo Frontend con React',
    'Construcción de aplicaciones web SPA y PWA responsivas, de alto rendimiento y accesibles con React, TypeScript y Tailwind CSS.',
    5000000,
    30,
    true
  ),
  (
    'Diseño y Optimización de Bases de Datos',
    'Modelado entidad-relación, esquemas PostgreSQL en Supabase, funciones SQL, triggers y políticas de seguridad RLS.',
    3000000,
    15,
    true
  ),
  (
    'Solución Full-Stack End-to-End',
    'Desarrollo completo de presencia web tipo Personal Brand con pasarela de pagos Stripe, agendamiento de citas y panel de administración.',
    15000000,
    60,
    true
  )
ON CONFLICT DO NOTHING;

-- 4. Portafolio inicial
INSERT INTO portafolio (titulo, descripcion, imagen_url, tecnologias, tipo, destacado, activo) VALUES
  (
    'Landing Page E-Commerce',
    'Plataforma web moderna con catálogo interactivo y checkout directo para una marca local.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    'React, Tailwind CSS, Supabase',
    'proyecto',
    true,
    true
  ),
  (
    'Dashboard de Métricas & Analytics',
    'Panel de administración con gráficos en vivo, gestión de clientes y seguimiento de ingresos.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    'React, TanStack Query, PostgreSQL',
    'proyecto',
    true,
    true
  ),
  (
    'Módulo de Pagos con Stripe & PSE',
    'Integración completa de pagos en línea con soporte para transferencias bancarias y tarjetas.',
    'https://images.unsplash.com/photo-1556742049-0a67e557224b?w=600&auto=format&fit=crop&q=80',
    'Stripe Checkout, Netlify Functions, Node.js',
    'servicio',
    false,
    true
  )
ON CONFLICT DO NOTHING;

-- 5. Testimonios iniciales
INSERT INTO testimonios (nombre, rol, empresa, contenido, calificacion, activo) VALUES
  (
    'Ana García',
    'Fundadora & Directora',
    'Moda Express S.A.S',
    'Excelente trabajo. La página web desarrollada aumentó la captación de contactos en más del 200%. Entrega a tiempo y con excelente calidad.',
    5,
    true
  ),
  (
    'Carlos López',
    'Emprendedor',
    'Tech Solutions',
    'Profesionalismo total en la estructuración de la base de datos PostgreSQL. Cumplió con cada requerimiento y resolvió dudas con claridad.',
    5,
    true
  ),
  (
    'María Rodríguez',
    'Gerente de Operaciones',
    'Retail Colombia',
    'Muy satisfecha con la integración del sistema de pagos y el agendamiento automatizado. La plataforma es rápida y fácil de usar.',
    5,
    true
  )
ON CONFLICT DO NOTHING;

-- 6. Contenido / Blog inicial
INSERT INTO contenido (titulo, tipo, contenido, slug, fecha_publi, activo) VALUES
  (
    'Cómo estructurar una aplicación Frontend moderna en 2026',
    'blog',
    'Al desarrollar aplicaciones web profesionales, la arquitectura es fundamental. La combinación de React 18, Vite y TypeScript proporciona una base sólida para crear interfaces reactivas y rápidas.\n\nEn este artículo analizamos cómo desacoplar la capa de servicios, gestionar el estado del servidor con React Query y mantener componentes limpios y reutilizables.',
    'como-estructurar-frontend-moderno',
    '2026-09-01',
    true
  ),
  (
    'Bases de Datos Relacionales: Modelado y Seguridad con RLS',
    'articulo',
    'PostgreSQL y Supabase ofrecen Row Level Security (RLS), una de las herramientas más potentes para proteger datos a nivel de base de datos.\n\nEn lugar de depender exclusivamente de la lógica del backend, RLS permite definir políticas granulares directamente sobre las tablas.',
    'bases-datos-relacionales-rls',
    '2026-09-05',
    true
  ),
  (
    'Guía para Integrar Stripe Checkout con Netlify Functions',
    'guia',
    'La seguridad en pagos en línea requiere que las credenciales secretas nunca se expongan al navegador del usuario.\n\nUtilizar serverless functions como Netlify Functions permite crear sesiones de Stripe Checkout seguras y procesar webhooks de confirmación con idempotencia garantizada.',
    'guia-stripe-checkout-netlify',
    '2026-09-10',
    true
  )
ON CONFLICT DO NOTHING;
