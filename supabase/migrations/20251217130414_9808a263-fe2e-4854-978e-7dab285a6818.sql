-- Create tables for Legislative Session Monitoring MVP (Peru)

-- Table: peru_sessions - Stores imported session data
CREATE TABLE peru_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_session_id TEXT,
  commission_name TEXT NOT NULL,
  session_title TEXT,
  scheduled_at TIMESTAMPTZ,
  scheduled_date_text TEXT,
  agenda_url TEXT,
  documents_url TEXT,
  status TEXT DEFAULT 'unknown' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'unknown')),
  source_file_name TEXT,
  source TEXT DEFAULT 'PERU_CONGRESS_COMMISSION_SESSIONS',
  jurisdiction TEXT DEFAULT 'PERU',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(commission_name, scheduled_at, session_title)
);

-- Enable RLS
ALTER TABLE peru_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access for sessions
CREATE POLICY "Anyone can read peru sessions"
ON peru_sessions FOR SELECT
USING (true);

-- Table: session_watch - Tracks user-selected sessions for monitoring
CREATE TABLE session_watch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id UUID NOT NULL REFERENCES peru_sessions(id) ON DELETE CASCADE,
  watch_status TEXT DEFAULT 'SELECTED' CHECK (watch_status IN ('SELECTED', 'UNSELECTED')),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, session_id)
);

ALTER TABLE session_watch ENABLE ROW LEVEL SECURITY;

-- Users can manage their own watch selections
CREATE POLICY "Users can view their own session watches"
ON session_watch FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own session watches"
ON session_watch FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own session watches"
ON session_watch FOR UPDATE
USING (true);

CREATE POLICY "Users can delete their own session watches"
ON session_watch FOR DELETE
USING (true);

-- Table: session_recordings - Stores resolved video information
CREATE TABLE session_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES peru_sessions(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'YOUTUBE',
  channel_name TEXT,
  channel_id TEXT,
  expected_title TEXT,
  video_id TEXT,
  video_url TEXT,
  resolution_confidence TEXT CHECK (resolution_confidence IN ('HIGH', 'MEDIUM', 'LOW')),
  resolution_method TEXT CHECK (resolution_method IN ('EXACT_STRIP_EMOJI', 'CONTAINS', 'MANUAL')),
  resolved_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;

-- Anyone can read session recordings
CREATE POLICY "Anyone can read session recordings"
ON session_recordings FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert session recordings"
ON session_recordings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update session recordings"
ON session_recordings FOR UPDATE
USING (true);

-- Table: watched_commissions - User's commission watchlist
CREATE TABLE watched_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  commission_name TEXT NOT NULL,
  jurisdiction TEXT DEFAULT 'PERU',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, commission_name, jurisdiction)
);

ALTER TABLE watched_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view watched commissions"
ON watched_commissions FOR SELECT
USING (true);

CREATE POLICY "Users can insert watched commissions"
ON watched_commissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can delete watched commissions"
ON watched_commissions FOR DELETE
USING (true);

-- Table: bill_session_links - Manual linking of sessions to bills
CREATE TABLE bill_session_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id TEXT NOT NULL,
  session_id UUID NOT NULL REFERENCES peru_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(bill_id, session_id, user_id)
);

ALTER TABLE bill_session_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bill session links"
ON bill_session_links FOR SELECT
USING (true);

CREATE POLICY "Users can insert bill session links"
ON bill_session_links FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can delete bill session links"
ON bill_session_links FOR DELETE
USING (true);

-- Trigger for updated_at on peru_sessions
CREATE TRIGGER update_peru_sessions_updated_at
BEFORE UPDATE ON peru_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();