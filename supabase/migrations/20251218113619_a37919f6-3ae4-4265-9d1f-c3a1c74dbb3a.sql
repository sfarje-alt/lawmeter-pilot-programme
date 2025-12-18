-- Add transcription and analysis columns to session_recordings table
ALTER TABLE session_recordings ADD COLUMN IF NOT EXISTS transcription_text TEXT;
ALTER TABLE session_recordings ADD COLUMN IF NOT EXISTS transcription_status TEXT DEFAULT 'NOT_STARTED';
ALTER TABLE session_recordings ADD COLUMN IF NOT EXISTS analysis_result JSONB;
ALTER TABLE session_recordings ADD COLUMN IF NOT EXISTS analysis_status TEXT DEFAULT 'NOT_STARTED';
ALTER TABLE session_recordings ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMPTZ;