export type CertificateType = 
  | 'CE' 
  | 'FCC' 
  | 'UL' 
  | 'UKCA' 
  | 'CB' 
  | 'EMC' 
  | 'RF' 
  | 'Safety' 
  | 'Eco-design' 
  | 'Other';

export type CertificateStatus = 
  | 'Valid' 
  | 'Expiring Soon' 
  | 'Expired' 
  | 'In Progress';

export type AppRole = 'admin' | 'user';

export interface Client {
  id: string;
  client_name: string;
  primary_country: string | null;
  industry: string | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  internal_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  client_id: string;
  certificate_name: string;
  certificate_type: CertificateType;
  product_name: string;
  product_model: string | null;
  country_or_region: string;
  regulatory_standard: string | null;
  certification_body: string | null;
  certificate_number: string | null;
  issue_date: string;
  expiration_date: string | null;
  status: CertificateStatus;
  internal_responsible: string | null;
  internal_notes: string | null;
  certificate_file_url: string | null;
  certificate_file_key: string | null;
  external_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  clients?: Client;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface CertificateFilters {
  clientId?: string;
  countryOrRegion?: string;
  certificateType?: CertificateType;
  status?: CertificateStatus;
  expirationRange?: '30' | '60' | '90' | 'all';
  search?: string;
}
