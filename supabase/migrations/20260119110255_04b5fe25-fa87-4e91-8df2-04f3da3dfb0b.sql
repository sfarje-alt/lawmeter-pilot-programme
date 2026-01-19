-- Phase 1: LawMeter Peru Restructuring - Core Schema

-- 1.1 Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  account_type public.app_role NOT NULL DEFAULT 'user',
  organization_id UUID,
  client_id UUID,
  last_login_at TIMESTAMPTZ,
  last_daily_popup_shown DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 Create organizations table (for legal teams)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_users INTEGER DEFAULT 5,
  max_clients INTEGER DEFAULT 10,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key for profiles.organization_id after organizations exists
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

-- 1.3 Expand clients table with comprehensive fields
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS legal_name TEXT,
ADD COLUMN IF NOT EXISTS trade_name TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS locations JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS company_type TEXT,
ADD COLUMN IF NOT EXISTS is_regulated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS supervising_authorities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS primary_sector TEXT,
ADD COLUMN IF NOT EXISTS secondary_sectors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS business_model_description TEXT,
ADD COLUMN IF NOT EXISTS products_services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS customer_segments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS distribution_channels TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_cross_border BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cross_border_countries TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS affected_areas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS monitoring_objective TEXT,
ADD COLUMN IF NOT EXISTS law_branches TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS exclusions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS additional_entities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS instrument_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS stakeholders_affected TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS high_impact_definition TEXT,
ADD COLUMN IF NOT EXISTS high_urgency_definition TEXT,
ADD COLUMN IF NOT EXISTS delivery_channels JSONB DEFAULT '{"email": true, "whatsapp": false}'::jsonb,
ADD COLUMN IF NOT EXISTS email_recipients JSONB DEFAULT '{"daily": [], "weekly": []}'::jsonb,
ADD COLUMN IF NOT EXISTS whatsapp_recipients JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS daily_report_schedule TIME,
ADD COLUMN IF NOT EXISTS weekly_report_schedule JSONB,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Lima',
ADD COLUMN IF NOT EXISTS send_only_if_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS report_default_filters JSONB,
ADD COLUMN IF NOT EXISTS include_analytics BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS detail_level TEXT DEFAULT 'detailed',
ADD COLUMN IF NOT EXISTS include_expert_commentary BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS pdf_naming_convention TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS source_acknowledgement BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS primary_contact_id UUID,
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id),
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Copy client_name to legal_name if not set
UPDATE public.clients SET legal_name = client_name WHERE legal_name IS NULL;

-- 1.4 Create client_users table (link users to client companies)
CREATE TABLE public.client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  area TEXT,
  whatsapp_enabled BOOLEAN DEFAULT false,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.5 Create alerts table (inbox workflow)
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legislation_id TEXT,
  legislation_type TEXT,
  legislation_title TEXT NOT NULL,
  legislation_summary TEXT,
  source_url TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inbox',
  risk_level TEXT DEFAULT 'medium',
  urgency_level TEXT DEFAULT 'medium',
  ai_summary TEXT,
  ai_analysis JSONB,
  review_notes TEXT,
  expert_commentary TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  deadline DATE,
  affected_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.6 Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT DEFAULT 'custom',
  period_start DATE,
  period_end DATE,
  alert_ids UUID[] DEFAULT '{}',
  include_analytics BOOLEAN DEFAULT true,
  detail_level TEXT DEFAULT 'detailed',
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for organizations (legal team members can access their org)
CREATE POLICY "Org members can view their organization"
ON public.organizations FOR SELECT
USING (id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org creators can update their organization"
ON public.organizations FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can create organizations"
ON public.organizations FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for client_users
CREATE POLICY "Org members can view client users"
ON public.client_users FOR SELECT
USING (client_id IN (
  SELECT c.id FROM public.clients c
  JOIN public.profiles p ON p.organization_id = c.organization_id
  WHERE p.id = auth.uid()
));

CREATE POLICY "Org members can manage client users"
ON public.client_users FOR ALL
USING (client_id IN (
  SELECT c.id FROM public.clients c
  JOIN public.profiles p ON p.organization_id = c.organization_id
  WHERE p.id = auth.uid()
));

-- RLS Policies for alerts
CREATE POLICY "Org members can view alerts"
ON public.alerts FOR SELECT
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can manage alerts"
ON public.alerts FOR ALL
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- RLS Policies for reports
CREATE POLICY "Org members can view reports"
ON public.reports FOR SELECT
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can manage reports"
ON public.reports FOR ALL
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Update clients RLS to be organization-based
DROP POLICY IF EXISTS "Public can view certificates" ON public.clients;
DROP POLICY IF EXISTS "Public can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Public can update clients" ON public.clients;
DROP POLICY IF EXISTS "Only admin can delete clients" ON public.clients;

CREATE POLICY "Org members can view their clients"
ON public.clients FOR SELECT
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can insert clients"
ON public.clients FOR INSERT
WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can update their clients"
ON public.clients FOR UPDATE
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can delete their clients"
ON public.clients FOR DELETE
USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Trigger for auto-creating profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'account_type')::app_role, 'user')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();