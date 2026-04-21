-- Agregar columnas faltantes para ingest-alerts
ALTER TABLE public.alerts 
ADD COLUMN IF NOT EXISTS external_id text,
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS ingested_at timestamp with time zone DEFAULT now();

-- Crear índice para búsquedas rápidas por external_id
CREATE INDEX IF NOT EXISTS idx_alerts_external_id ON public.alerts(external_id);

-- Eliminar la fila de smoke test
DELETE FROM public.alerts WHERE external_id = 'betsson-norma-SMOKETEST-000';