
DO $$
DECLARE
  isa_org uuid := 'b7e15500-0004-4000-8000-000000000001';
  isa_client uuid := 'b7e15500-0005-4000-8000-000000000001';
  u1 uuid := 'b7e15500-0003-4000-8000-000000000002';
  u2 uuid := 'b7e15500-0003-4000-8000-000000000003';
  pwd text := 'pilotoISA2026';
BEGIN
  -- User 1: dramos@rep.com.pe
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', u1, 'authenticated', 'authenticated',
    'dramos@rep.com.pe', crypt(pwd, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name','D. Ramos','account_type','admin'),
    '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), u1,
    jsonb_build_object('sub', u1::text, 'email', 'dramos@rep.com.pe', 'email_verified', true),
    'email', u1::text, now(), now(), now())
  ON CONFLICT DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name, account_type, organization_id, client_id)
  VALUES (u1, 'dramos@rep.com.pe', 'D. Ramos', 'admin', isa_org, isa_client)
  ON CONFLICT (id) DO UPDATE SET organization_id = isa_org, client_id = isa_client, account_type = 'admin';

  INSERT INTO public.user_roles (user_id, role) VALUES (u1, 'admin') ON CONFLICT DO NOTHING;

  -- User 2: vgalindo@rep.com.pe
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', u2, 'authenticated', 'authenticated',
    'vgalindo@rep.com.pe', crypt(pwd, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name','V. Galindo','account_type','admin'),
    '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), u2,
    jsonb_build_object('sub', u2::text, 'email', 'vgalindo@rep.com.pe', 'email_verified', true),
    'email', u2::text, now(), now(), now())
  ON CONFLICT DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name, account_type, organization_id, client_id)
  VALUES (u2, 'vgalindo@rep.com.pe', 'V. Galindo', 'admin', isa_org, isa_client)
  ON CONFLICT (id) DO UPDATE SET organization_id = isa_org, client_id = isa_client, account_type = 'admin';

  INSERT INTO public.user_roles (user_id, role) VALUES (u2, 'admin') ON CONFLICT DO NOTHING;
END $$;
