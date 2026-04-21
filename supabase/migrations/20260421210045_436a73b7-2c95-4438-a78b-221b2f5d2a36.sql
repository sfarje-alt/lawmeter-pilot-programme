-- Add optional columns to support tipo="pl" (proyectos de ley) and tipo="sesion"
ALTER TABLE public.alerts
  ADD COLUMN IF NOT EXISTS codigo TEXT,
  ADD COLUMN IF NOT EXISTS estado_actual TEXT,
  ADD COLUMN IF NOT EXISTS estado_anterior TEXT,
  ADD COLUMN IF NOT EXISTS es_cambio_estado BOOLEAN,
  ADD COLUMN IF NOT EXISTS seguimiento_hash TEXT,
  ADD COLUMN IF NOT EXISTS comision TEXT,
  ADD COLUMN IF NOT EXISTS fecha_sesion DATE,
  ADD COLUMN IF NOT EXISTS fecha_publicacion DATE,
  ADD COLUMN IF NOT EXISTS reference_number TEXT,
  ADD COLUMN IF NOT EXISTS entity TEXT,
  ADD COLUMN IF NOT EXISTS sumilla TEXT,
  ADD COLUMN IF NOT EXISTS fuente TEXT,
  ADD COLUMN IF NOT EXISTS url TEXT;

CREATE INDEX IF NOT EXISTS idx_alerts_tipo_status ON public.alerts(legislation_type, status);
CREATE INDEX IF NOT EXISTS idx_alerts_codigo ON public.alerts(codigo) WHERE codigo IS NOT NULL;

-- Cleanup smoke-test row
DELETE FROM public.alerts WHERE external_id = 'betsson-norma-SMOKETEST-000';