
-- Create BCP organization and client for Peru
INSERT INTO public.organizations (id, name, max_users, max_clients)
VALUES ('b7e15500-0008-4000-8000-000000000001', 'BCP', 20, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clients (
  id, organization_id, client_name, primary_country, status
) VALUES (
  'b7e15500-0009-4000-8000-000000000001',
  'b7e15500-0008-4000-8000-000000000001',
  'BCP',
  'PE',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Clean up the probe rows used to verify ingest-alerts
DELETE FROM public.alerts WHERE external_id IN ('probe-pl-1','probe-norma-1','probe-ses-1','probe-1');
