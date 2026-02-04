-- Create table for AI usage logging per client
CREATE TABLE public.ai_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  function_name TEXT NOT NULL,
  model_used TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  estimated_cost DECIMAL(10, 6),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient queries by client and date
CREATE INDEX idx_ai_usage_client_date ON public.ai_usage_logs(client_id, created_at DESC);
CREATE INDEX idx_ai_usage_org_date ON public.ai_usage_logs(organization_id, created_at DESC);
CREATE INDEX idx_ai_usage_function ON public.ai_usage_logs(function_name);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Org members can view their organization's usage
CREATE POLICY "Org members can view AI usage" 
ON public.ai_usage_logs 
FOR SELECT 
USING (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- Policy: Edge functions can insert (service role)
CREATE POLICY "Service role can insert AI usage" 
ON public.ai_usage_logs 
FOR INSERT 
WITH CHECK (true);

-- Create a view for monthly aggregated usage per client
CREATE OR REPLACE VIEW public.ai_usage_monthly AS
SELECT 
  client_id,
  organization_id,
  function_name,
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as call_count,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(estimated_cost) as total_cost
FROM public.ai_usage_logs
GROUP BY client_id, organization_id, function_name, DATE_TRUNC('month', created_at);