-- Add UNIQUE constraint on external_session_id for deduplication
-- This allows the sync process to identify existing sessions

-- First, ensure the column exists (it should from previous schema)
-- If there are any null values, generate a default external_id
UPDATE peru_sessions 
SET external_session_id = 'PERU-LEGACY-' || id::text
WHERE external_session_id IS NULL;

-- Add NOT NULL constraint
ALTER TABLE peru_sessions 
ALTER COLUMN external_session_id SET NOT NULL;

-- Add UNIQUE constraint
ALTER TABLE peru_sessions
ADD CONSTRAINT peru_sessions_external_session_id_unique 
UNIQUE (external_session_id);

-- Create index for fast lookups during sync
CREATE INDEX IF NOT EXISTS idx_peru_sessions_external_session_id 
ON peru_sessions(external_session_id);