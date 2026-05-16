
-- Diez Canseco tenant provisioning
DO $$
DECLARE
  v_org_id uuid := 'b7e15500-0006-4000-8000-000000000001';
  v_client_id uuid := 'b7e15500-0007-4000-8000-000000000001';
  v_user_id uuid := 'b7e15500-0008-4000-8000-000000000001';
  v_email text := 'pmalca@dclegal.pe';
  v_password text := '070398';
BEGIN
  -- Organization
  INSERT INTO public.organizations (id, name, max_users, max_clients)
  VALUES (v_org_id, 'Diez Canseco', 10, 5)
  ON CONFLICT (id) DO NOTHING;

  -- Client (empty)
  INSERT INTO public.clients (id, organization_id, client_name, status, primary_country)
  VALUES (v_client_id, v_org_id, 'Diez Canseco', 'active', 'PE')
  ON CONFLICT (id) DO NOTHING;

  -- Auth user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_password, gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('full_name', 'P. Malca', 'account_type', 'admin'),
    now(), now(), '', '', '', ''
  )
  ON CONFLICT (id) DO NOTHING;

  -- Auth identity
  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
    'email',
    now(), now(), now()
  )
  ON CONFLICT DO NOTHING;

  -- Profile
  INSERT INTO public.profiles (id, email, full_name, account_type, organization_id, client_id)
  VALUES (v_user_id, v_email, 'P. Malca', 'admin', v_org_id, NULL)
  ON CONFLICT (id) DO UPDATE
    SET organization_id = EXCLUDED.organization_id,
        account_type = 'admin',
        full_name = EXCLUDED.full_name;

  -- Role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT DO NOTHING;
END $$;
