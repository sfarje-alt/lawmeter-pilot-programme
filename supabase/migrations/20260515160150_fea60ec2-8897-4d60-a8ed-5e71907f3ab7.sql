
-- 1. Crear usuario en auth.users con contraseña bcrypt
INSERT INTO auth.users (
  id,
  instance_id,
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
)
VALUES (
  'b7e15500-0003-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'joliveros@rep.com.pe',
  crypt('pilotoISA2026', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"J. Oliveros","account_type":"admin"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'b7e15500-0003-4000-8000-000000000001',
  'b7e15500-0003-4000-8000-000000000001',
  format('{"sub":"%s","email":"%s"}', 'b7e15500-0003-4000-8000-000000000001', 'joliveros@rep.com.pe')::jsonb,
  'email',
  now(),
  now(),
  now()
);

-- 2. Perfil
INSERT INTO public.profiles (id, email, full_name, account_type)
VALUES (
  'b7e15500-0003-4000-8000-000000000001',
  'joliveros@rep.com.pe',
  'J. Oliveros',
  'admin'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Organización ISA
INSERT INTO public.organizations (id, name, created_by)
VALUES ('b7e15500-0004-4000-8000-000000000001', 'ISA', 'b7e15500-0003-4000-8000-000000000001');

-- 4. Cliente vacío ISA
INSERT INTO public.clients (id, organization_id, client_name, legal_name, primary_country, industry, contact_person, contact_email, status, created_by)
VALUES (
  'b7e15500-0005-4000-8000-000000000001',
  'b7e15500-0004-4000-8000-000000000001',
  'ISA',
  'ISA',
  'Peru',
  'Energía / Transmisión eléctrica',
  'J. Oliveros',
  'joliveros@rep.com.pe',
  'active',
  'b7e15500-0003-4000-8000-000000000001'
);

-- 5. Vincular perfil a org y cliente
UPDATE public.profiles
SET organization_id = 'b7e15500-0004-4000-8000-000000000001',
    client_id = 'b7e15500-0005-4000-8000-000000000001'
WHERE id = 'b7e15500-0003-4000-8000-000000000001';

-- 6. Rol admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('b7e15500-0003-4000-8000-000000000001', 'admin')
ON CONFLICT DO NOTHING;
