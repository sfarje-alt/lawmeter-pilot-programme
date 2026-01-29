// Types for Client Profile Management

export interface ClientLocation {
  country: string;
  regions?: string[];
}

export interface ProductService {
  name: string;
  description?: string;
}

// Flexible tag category - replaces rigid ClientArea
export interface TagCategory {
  id: string;
  name: string;
  description?: string;
  tags: string[];
}

export interface ClientUser {
  id?: string;
  name: string;
  email: string;
  title?: string;
  area?: string;
  phone?: string;
}

export interface ClientProfile {
  id?: string;
  
  // Step 1: Client basics + Business scope (combined)
  legalName: string;
  tradeName?: string;
  shortDescription?: string;
  website?: string;
  locations: ClientLocation[];
  companyType?: string;
  isRegulated: boolean;
  supervisingAuthorities: string[];
  primarySector?: string;
  secondarySectors: string[];
  productsServices: ProductService[];
  isCrossBorder: boolean;
  crossBorderCountries: string[];

  // Step 2: Monitoring scope (AI-assisted keywords)
  keywords: string[];
  exclusions: string[];
  instrumentTypes: string[];

  // Step 3: Custom Tag Categories (flexible, replaces rigid Areas)
  tagCategories: TagCategory[];

  // Step 4: Client users
  clientUsers: ClientUser[];

  // Step 5: Confirmations
  sourceAcknowledgement: boolean;
  primaryContactId?: string;
  internalNotes?: string;

  // Meta
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
  
  // Legacy fields kept for backward compatibility
  affectedAreas?: { area: string; responsibilityNote?: string }[];
  lawBranches?: string[];
  additionalEntities?: string[];
  stakeholdersAffected?: string[];
  highImpactDefinition?: string;
  highUrgencyDefinition?: string;
  businessModelDescription?: string;
  customerSegments?: string[];
  distributionChannels?: string[];
}

export const WIZARD_STEPS = [
  { id: 1, title: 'Basics', required: true },
  { id: 2, title: 'Monitoring', required: true },
  { id: 3, title: 'Tags', required: false },
  { id: 4, title: 'Users', required: true },
  { id: 5, title: 'Confirm', required: true },
] as const;

export const COMPANY_TYPES = [
  'S.A.C.',
  'S.A.',
  'S.R.L.',
  'E.I.R.L.',
  'Sucursal',
  'Asociación',
  'Fundación',
  'ONG',
  'Otro',
];

export const SECTORS = [
  'Banca y Finanzas',
  'Seguros',
  'Telecomunicaciones',
  'Energía',
  'Minería',
  'Salud',
  'Farmacéutico',
  'Educación',
  'Retail',
  'Tecnología',
  'Manufactura',
  'Construcción',
  'Agricultura',
  'Transporte',
  'Turismo',
  'Otro',
];

export const INSTRUMENT_TYPES = [
  'Decreto de Urgencia',
  'Decreto Legislativo',
  'Decreto Ley',
  'Decreto Supremo',
  'Directiva',
  'Ley',
  'Resolución',
  'Resolución Administrativa',
  'Resolución Casa de Gobierno',
  'Resolución de Contraloría',
  'Resolución de la Oficina de Administración',
  'Resolución de Secretaría General',
  'Resolución Oficina de Recursos Humanos',
  'Resolución Subsecretaría General',
  'Resolución Suprema',
];

// Default tag category templates
export const DEFAULT_TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'areas',
    name: 'Áreas Internas',
    description: 'Departamentos de la empresa que deben recibir alertas',
    tags: []
  },
  {
    id: 'themes',
    name: 'Temas de Interés',
    description: 'Temas regulatorios prioritarios',
    tags: []
  }
];

export const SUGGESTED_AREA_TAGS = [
  'Finanzas',
  'Operaciones',
  'Recursos Humanos',
  'Legal',
  'Compliance',
  'IT',
  'Marketing',
  'Ventas',
  'Producción',
  'Logística',
];

export const DEFAULT_CLIENT_PROFILE: ClientProfile = {
  legalName: '',
  locations: [],
  isRegulated: false,
  supervisingAuthorities: [],
  secondarySectors: [],
  productsServices: [],
  isCrossBorder: false,
  crossBorderCountries: [],
  keywords: [],
  exclusions: [],
  instrumentTypes: [],
  tagCategories: [],
  clientUsers: [],
  sourceAcknowledgement: false,
  // Legacy defaults
  affectedAreas: [],
  lawBranches: [],
  additionalEntities: [],
  stakeholdersAffected: [],
  customerSegments: [],
  distributionChannels: [],
};
