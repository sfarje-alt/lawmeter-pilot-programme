-- Add tracking for bill updates via email
ALTER TABLE public.congress_bill_statuses
ADD COLUMN IF NOT EXISTS email_updated_at timestamptz,
ADD COLUMN IF NOT EXISTS has_email_update boolean DEFAULT false;

-- Create index for querying updated bills
CREATE INDEX IF NOT EXISTS idx_bill_statuses_email_updates 
ON public.congress_bill_statuses(has_email_update, email_updated_at) 
WHERE has_email_update = true;