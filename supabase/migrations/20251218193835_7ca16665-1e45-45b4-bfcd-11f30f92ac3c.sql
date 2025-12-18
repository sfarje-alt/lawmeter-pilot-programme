-- Add unique constraint on session_id for session_recordings table
-- This allows upsert operations with onConflict: 'session_id'
ALTER TABLE public.session_recordings 
ADD CONSTRAINT session_recordings_session_id_key UNIQUE (session_id);