-- Create table to track STT usage per month
CREATE TABLE public.stt_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month VARCHAR(7) NOT NULL, -- '2025-01' format
  google_minutes_used DECIMAL(10,2) DEFAULT 0,
  whisper_minutes_used DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(month)
);

-- Enable RLS
ALTER TABLE public.stt_usage ENABLE ROW LEVEL SECURITY;

-- Allow reading usage from edge functions (public read)
CREATE POLICY "Anyone can read stt usage"
ON public.stt_usage
FOR SELECT
USING (true);

-- Allow inserting/updating from edge functions
CREATE POLICY "Anyone can insert stt usage"
ON public.stt_usage
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update stt usage"
ON public.stt_usage
FOR UPDATE
USING (true);