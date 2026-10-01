-- ==========================================================
-- SCRIPT PARA CREAR EL USUARIO ADMINISTRADOR INICIAL
-- Ejecutar en el SQL Editor de Supabase
-- ==========================================================

-- NOTA: Reemplaza 'tu-password-seguro' y 'admin@oliverprada.com' con tus credenciales deseadas.
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'admin@oliverprada.com';
  admin_password TEXT := 'Admin2026*Secure!';
BEGIN
  -- Verificar si el usuario ya existe en auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    -- Insertar en auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"nombre":"Oliver Prada","rol":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Insertar en public.usuarios con rol 'admin'
    INSERT INTO public.usuarios (id, email, nombre, rol)
    VALUES (new_user_id, admin_email, 'Oliver Prada', 'admin')
    ON CONFLICT (id) DO UPDATE
    SET rol = 'admin';

    RAISE NOTICE 'Usuario administrador creado exitosamente: %', admin_email;
  ELSE
    -- Asegurar que el rol sea 'admin' en public.usuarios
    UPDATE public.usuarios
    SET rol = 'admin'
    WHERE email = admin_email;

    RAISE NOTICE 'El usuario ya existía. Se actualizó el rol a admin para: %', admin_email;
  END IF;
END $$;
