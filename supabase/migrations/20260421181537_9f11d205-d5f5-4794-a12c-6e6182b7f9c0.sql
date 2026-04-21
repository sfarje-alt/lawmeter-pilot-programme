
-- 1. Perfil primero (sin org/client todavía)
INSERT INTO public.profiles (id, email, full_name, account_type)
VALUES (
  '779d6e26-c27e-4490-97d0-75b2635f204c',
  'sergio.povesvidal@betssongroup.com',
  'Sergio Poves Vidal',
  'admin'
);

-- 2. Organización
INSERT INTO public.organizations (id, name, created_by)
VALUES ('b7e15500-0001-4000-8000-000000000001', 'Betsson Group', '779d6e26-c27e-4490-97d0-75b2635f204c');

-- 3. Cliente vacío
INSERT INTO public.clients (id, organization_id, client_name, legal_name, primary_country, industry, contact_person, contact_email, status, created_by)
VALUES (
  'b7e15500-0002-4000-8000-000000000001',
  'b7e15500-0001-4000-8000-000000000001',
  'Betsson Group',
  'Betsson Group',
  'Peru',
  'Gaming & Betting',
  'Sergio Poves Vidal',
  'sergio.povesvidal@betssongroup.com',
  'active',
  '779d6e26-c27e-4490-97d0-75b2635f204c'
);

-- 4. Vincular perfil
UPDATE public.profiles
SET organization_id = 'b7e15500-0001-4000-8000-000000000001',
    client_id = 'b7e15500-0002-4000-8000-000000000001'
WHERE id = '779d6e26-c27e-4490-97d0-75b2635f204c';

-- 5. Rol admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('779d6e26-c27e-4490-97d0-75b2635f204c', 'admin')
ON CONFLICT DO NOTHING;
