-- Enable realtime for congress_bill_statuses table
ALTER TABLE public.congress_bill_statuses REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.congress_bill_statuses;