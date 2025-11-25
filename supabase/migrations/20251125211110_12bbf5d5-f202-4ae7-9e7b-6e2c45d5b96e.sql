-- Create enum for certificate types
CREATE TYPE public.certificate_type AS ENUM (
  'CE', 'FCC', 'UL', 'UKCA', 'CB', 'EMC', 'RF', 'Safety', 'Eco-design', 'Other'
);

-- Create enum for certificate status
CREATE TYPE public.certificate_status AS ENUM (
  'Valid', 'Expiring Soon', 'Expired', 'In Progress'
);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  primary_country TEXT,
  industry TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  internal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  certificate_name TEXT NOT NULL,
  certificate_type certificate_type NOT NULL,
  product_name TEXT NOT NULL,
  product_model TEXT,
  country_or_region TEXT NOT NULL,
  regulatory_standard TEXT,
  certification_body TEXT,
  certificate_number TEXT,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  status certificate_status DEFAULT 'In Progress',
  internal_responsible TEXT,
  internal_notes TEXT,
  certificate_file_url TEXT,
  certificate_file_key TEXT,
  external_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create indexes
CREATE INDEX idx_certificates_client_id ON public.certificates(client_id);
CREATE INDEX idx_certificates_status ON public.certificates(status);
CREATE INDEX idx_certificates_expiration_date ON public.certificates(expiration_date);
CREATE INDEX idx_certificates_country ON public.certificates(country_or_region);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for clients
CREATE POLICY "Authenticated users can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin and user can update clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'user'));

CREATE POLICY "Only admin can delete clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for certificates
CREATE POLICY "Authenticated users can view certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and user can insert certificates"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'user'));

CREATE POLICY "Admin and user can update certificates"
  ON public.certificates FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'user'));

CREATE POLICY "Only admin can delete certificates"
  ON public.certificates FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Only admin can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for certificate files
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-files', 'certificate-files', false);

-- Storage policies for certificate files
CREATE POLICY "Authenticated users can view certificate files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'certificate-files');

CREATE POLICY "Authenticated users can upload certificate files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'certificate-files');

CREATE POLICY "Authenticated users can update certificate files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'certificate-files');

CREATE POLICY "Only admin can delete certificate files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'certificate-files' AND
    public.has_role(auth.uid(), 'admin')
  );