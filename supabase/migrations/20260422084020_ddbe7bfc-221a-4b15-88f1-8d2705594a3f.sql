ALTER PUBLICATION supabase_realtime ADD TABLE public.sesiones;
ALTER TABLE public.sesiones REPLICA IDENTITY FULL;