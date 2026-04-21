
ALTER TABLE public.alerts
  ADD COLUMN IF NOT EXISTS autores TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS proponente TEXT,
  ADD COLUMN IF NOT EXISTS fecha_presentacion DATE,
  ADD COLUMN IF NOT EXISTS impacto INTEGER,
  ADD COLUMN IF NOT EXISTS urgencia INTEGER,
  ADD COLUMN IF NOT EXISTS impacto_categoria TEXT,
  ADD COLUMN IF NOT EXISTS urgencia_categoria TEXT,
  ADD COLUMN IF NOT EXISTS area_de_interes TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS racional TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS fechas_identificadas JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS comentario TEXT;
