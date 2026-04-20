-- Tabla para persistir el estado editorial de las sesiones (pin, follow-up, archivado, IA, revisión legal)
CREATE TABLE IF NOT EXISTS public.session_editorial_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_follow_up BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  editorial_state TEXT NOT NULL DEFAULT 'nueva',
  transcription_state TEXT NOT NULL DEFAULT 'no_solicitada',
  chatbot_state TEXT NOT NULL DEFAULT 'no_solicitado',
  legal_review JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_session_editorial_state_user
  ON public.session_editorial_state (user_id);
CREATE INDEX IF NOT EXISTS idx_session_editorial_state_session
  ON public.session_editorial_state (session_id);

ALTER TABLE public.session_editorial_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own session editorial state"
  ON public.session_editorial_state
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session editorial state"
  ON public.session_editorial_state
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session editorial state"
  ON public.session_editorial_state
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own session editorial state"
  ON public.session_editorial_state
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_session_editorial_state_updated_at
  BEFORE UPDATE ON public.session_editorial_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();