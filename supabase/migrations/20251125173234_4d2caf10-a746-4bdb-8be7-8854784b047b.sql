-- Create table for caching scraped bill statuses
CREATE TABLE IF NOT EXISTS public.congress_bill_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  congress integer NOT NULL,
  bill_type text NOT NULL,
  bill_number text NOT NULL,
  current_stage text NOT NULL,
  stages jsonb NOT NULL,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(congress, bill_type, bill_number)
);

-- Enable RLS
ALTER TABLE public.congress_bill_statuses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read statuses (public data from Congress.gov)
CREATE POLICY "Anyone can read bill statuses"
  ON public.congress_bill_statuses
  FOR SELECT
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_bill_statuses_lookup ON public.congress_bill_statuses(congress, bill_type, bill_number);