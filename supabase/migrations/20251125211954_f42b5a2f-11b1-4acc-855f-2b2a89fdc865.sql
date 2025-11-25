-- Temporarily allow public read access for testing
-- Replace the existing SELECT policies with public access

DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can view certificates" ON public.certificates;

-- Create public read policies for testing
CREATE POLICY "Public can view clients"
  ON public.clients FOR SELECT
  USING (true);

CREATE POLICY "Public can view certificates"
  ON public.certificates FOR SELECT
  USING (true);
