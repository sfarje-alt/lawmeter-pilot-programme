UPDATE public.alerts
SET fecha_publicacion = '2026-04-17',
    published_at = '2026-04-17T00:00:00Z'
WHERE legislation_type = 'norma'
  AND fecha_publicacion IS NULL
  AND ai_analysis -> 'fechas_identificadas' @> '[{"rol":"publicacion"}]'::jsonb;

-- Generic backfill: for any norma where fecha_publicacion is null, copy from fechas_identificadas[publicacion]
UPDATE public.alerts a
SET fecha_publicacion = (f.fecha)::date,
    published_at = COALESCE(a.published_at, (f.fecha)::timestamptz)
FROM (
  SELECT id, (elem ->> 'fecha') AS fecha
  FROM public.alerts,
       LATERAL jsonb_array_elements(ai_analysis -> 'fechas_identificadas') AS elem
  WHERE legislation_type = 'norma'
    AND fecha_publicacion IS NULL
    AND lower(elem ->> 'rol') IN ('publicacion','publicación','publication','published')
    AND (elem ->> 'fecha') ~ '^\d{4}-\d{2}-\d{2}'
) f
WHERE a.id = f.id;