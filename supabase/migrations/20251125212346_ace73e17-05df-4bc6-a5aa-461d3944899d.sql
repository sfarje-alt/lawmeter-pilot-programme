-- Temporarily allow public INSERT/UPDATE for testing
-- This allows creating and editing certificates without authentication

DROP POLICY IF EXISTS "Admin users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Admin and user can update clients" ON public.clients;
DROP POLICY IF EXISTS "Admin and user can insert certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin and user can update certificates" ON public.certificates;

-- Create temporary public policies for testing
CREATE POLICY "Public can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update clients"
  ON public.clients FOR UPDATE
  USING (true);

CREATE POLICY "Public can insert certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update certificates"
  ON public.certificates FOR UPDATE
  USING (true);

-- Update storage policies for public access during testing
DROP POLICY IF EXISTS "Authenticated users can view certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update certificate files" ON storage.objects;

CREATE POLICY "Public can view certificate files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificate-files');

CREATE POLICY "Public can upload certificate files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificate-files');

CREATE POLICY "Public can update certificate files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'certificate-files');
