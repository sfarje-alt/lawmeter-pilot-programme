-- Drop old reports table
DROP TABLE IF EXISTS public.reports CASCADE;

-- New reports table (shape from external backend)
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  cliente_slug text NOT NULL,
  cliente_nombre text NOT NULL,
  periodo_desde date NOT NULL,
  periodo_hasta date NOT NULL,
  modelo text NOT NULL,
  formatos text[] NOT NULL DEFAULT '{}',
  idioma text NOT NULL DEFAULT 'es',
  paises text[] NOT NULL DEFAULT '{}',
  pipelines text[] NOT NULL DEFAULT '{}',
  total_pl int NOT NULL DEFAULT 0,
  total_normas int NOT NULL DEFAULT 0,
  total_sesiones int NOT NULL DEFAULT 0,
  decisiones_requeridas int NOT NULL DEFAULT 0,
  expert_comments_count int NOT NULL DEFAULT 0,
  archivos jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX reports_unique_key ON public.reports (organization_id, client_id, periodo_hasta, modelo);
CREATE INDEX reports_client_idx ON public.reports (client_id, periodo_hasta DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY reports_select_by_org ON public.reports
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY reports_all_by_org ON public.reports
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- Email recipients table
CREATE TABLE public.client_email_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  email text NOT NULL,
  nombre text,
  kind text NOT NULL DEFAULT 'to',
  activo boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX recipients_unique ON public.client_email_recipients (client_id, lower(email), kind);
CREATE INDEX recipients_client_idx ON public.client_email_recipients (client_id) WHERE activo;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_email_recipients TO authenticated;
GRANT ALL ON public.client_email_recipients TO service_role;

ALTER TABLE public.client_email_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY recipients_select_by_org ON public.client_email_recipients
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY recipients_all_by_org ON public.client_email_recipients
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- updated_at triggers
CREATE TRIGGER reports_set_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER recipients_set_updated_at
  BEFORE UPDATE ON public.client_email_recipients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for reports (public read-only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Reports bucket public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reports');

CREATE POLICY "Reports bucket service write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reports');
