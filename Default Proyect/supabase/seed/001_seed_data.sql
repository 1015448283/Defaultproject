-- Datos iniciales: Portafolio
INSERT INTO portafolio (titulo, descripcion, imagen_url, tecnologias, tipo, destacado, activo) VALUES
  ('Landing Page E-commerce', 'Diseño y desarrollo de landing page para e-commerce', 'https://via.placeholder.com/600x400/1e40af/ffffff?text=E-commerce', 'React, Tailwind, Supabase', 'proyecto', true, true),
  ('Dashboard de Analytics', 'Dashboard de métricas con React Query y Supabase', 'https://via.placeholder.com/600x400/1e3a8a/ffffff?text=Analytics', 'React, TanStack Query, Recharts', 'proyecto', false, true),
  ('Sistema de Pagos', 'Integración Stripe Checkout con PSE y Nequi', 'https://via.placeholder.com/600x400/1d4ed8/ffffff?text=Payments', 'Stripe, Supabase, Netlify', 'servicio', false, true);

-- Datos iniciales: Testimonios
INSERT INTO testimonios (nombre, rol, empresa, contenido, calificacion, activo) VALUES
  ('Ana García', 'Dueña de negocio', 'Moda Express', 'Excelente trabajo. La página web aumentó mis contactos un 200%.', 5, true),
  ('Carlos López', 'Emprendedor', 'Tech Solutions', 'Profesionalismo total. Cumplió con todos los plazos.', 5, true),
  ('María Rodríguez', 'Gerente', 'Retail Colombia', 'Muy satisfecha con el sistema de pagos integrado.', 4, true);

-- Datos iniciales: Contenido
INSERT INTO contenido (titulo, tipo, contenido, slug, fecha_publi, activo) VALUES
  ('Cómo empezar en Frontend', 'blog', 'Guía completa para iniciarte en el desarrollo frontend...', 'como-empezar-frontend', '2026-09-01', true),
  'Base de datos relacionales', 'articulo', 'Entendiendo modelos entidad-relación...', 'entendiendo-bases-relacionales', '2026-09-05', true),
  ('Factores clave de éxito', 'guia', 'Los 5 factores que marcan la diferencia...', 'factores-clave-exito', '2026-09-10', true);

-- Datos iniciales: Servicios
INSERT INTO servicios (nombre, descripcion, precio_base, duracion_estimada, activo) VALUES
  ('Frontend Development', 'Desarrollo de interfaces web modernas con React', 5000000, 30, true),
  ('Base de Datos', 'Diseño e implementación de bases de datos relacionales', 3000000, 15, true),
  ('Proyectos Completos', 'Soluciones full-stack end-to-end', 15000000, 60, true);
