-- New sesiones table for Congress sessions (replaces peru_sessions flow per spec)
CREATE TABLE public.sesiones (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id            TEXT NOT NULL UNIQUE,
  organization_id        UUID NOT NULL,
  client_id              UUID NOT NULL,

  -- Datos del Congreso
  commission_name        TEXT NOT NULL,
  commission_normalized  TEXT NOT NULL,
  session_title          TEXT,
  scheduled_at           TIMESTAMPTZ,
  scheduled_date_text    TEXT,
  agenda_url             TEXT,
  agenda_markdown        TEXT,
  agenda_scraped_at      TIMESTAMPTZ,
  video_url              TEXT,
  video_resolved_at      TIMESTAMPTZ,

  -- Bandeja prefiltro
  es_de_interes          BOOLEAN NOT NULL DEFAULT FALSE,

  -- Estado del análisis IA (on-demand)
  analysis_status        TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
  analysis_requested_at  TIMESTAMPTZ,
  analysis_requested_by  UUID,
  analysis_started_at    TIMESTAMPTZ,
  analysis_completed_at  TIMESTAMPTZ,
  analysis_error         TEXT,

  -- Resultado del análisis
  impacto                INT,
  urgencia               INT,
  impacto_categoria      TEXT,
  urgencia_categoria     TEXT,
  resumen_ejecutivo      TEXT,
  comentario             TEXT,
  puntos_clave           JSONB,
  area_de_interes        TEXT[],
  racional               TEXT[],
  recomendaciones        TEXT[],
  transcript_excerpt     TEXT,

  -- Metadata del run de IA
  analysis_model         TEXT,
  analysis_cost_usd      NUMERIC(10, 6),
  transcript_duration_s  INT,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT sesiones_analysis_status_check CHECK (
    analysis_status IN ('NOT_REQUESTED', 'REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED')
  )
);

CREATE INDEX idx_sesiones_org_client ON public.sesiones (organization_id, client_id);
CREATE INDEX idx_sesiones_scheduled_at ON public.sesiones (scheduled_at DESC);
CREATE INDEX idx_sesiones_es_de_interes ON public.sesiones (es_de_interes) WHERE es_de_interes = TRUE;
CREATE INDEX idx_sesiones_analysis_status ON public.sesiones (analysis_status);
CREATE INDEX idx_sesiones_commission ON public.sesiones (commission_normalized);

-- Trigger updated_at
CREATE TRIGGER sesiones_set_updated_at
  BEFORE UPDATE ON public.sesiones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view sesiones"
  ON public.sesiones FOR SELECT
  USING (organization_id IN (
    SELECT profiles.organization_id FROM profiles WHERE profiles.id = auth.uid()
  ));

CREATE POLICY "Org members can manage sesiones"
  ON public.sesiones FOR ALL
  USING (organization_id IN (
    SELECT profiles.organization_id FROM profiles WHERE profiles.id = auth.uid()
  ));