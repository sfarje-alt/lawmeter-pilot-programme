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
  watchedCommissions: string[];  // Congressional commissions to monitor for sessions

  // Step 3: Custom Tag Categories (flexible, replaces rigid Areas)
  tagCategories: TagCategory[];

  // Step 4: Confirmations
  sourceAcknowledgement: boolean;
  internalNotes?: string;

  // AI classification criteria (REQUIRED for impact/urgency tagging)
  highImpactCriteria: string;
  highUrgencyCriteria: string;

  // Deprecated — kept only to avoid breaking legacy serialized data
  clientUsers?: ClientUser[];
  primaryContactId?: string;

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
  { id: 1, title: 'Datos', required: true },
  { id: 2, title: 'Monitoreo', required: true },
  { id: 3, title: 'Etiquetas', required: false },
  { id: 4, title: 'Confirmar', required: true },
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
  watchedCommissions: [],
  tagCategories: [],
  highImpactCriteria: '',
  highUrgencyCriteria: '',
  sourceAcknowledgement: false,
  // Legacy defaults
  clientUsers: [],
  affectedAreas: [],
  lawBranches: [],
  additionalEntities: [],
  stakeholdersAffected: [],
  customerSegments: [],
  distributionChannels: [],
};

// Peru Congressional Commissions
export const PERU_COMMISSIONS = [
  "Comisión de Salud y Población",
  "Comisión de Economía, Banca, Finanzas e Inteligencia Financiera",
  "Comisión de Presupuesto y Cuenta General de la República",
  "Comisión de Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
  "Comisión de Trabajo y Seguridad Social",
  "Comisión de Educación, Juventud y Deporte",
  "Comisión de Justicia y Derechos Humanos",
  "Comisión de Constitución y Reglamento",
  "Comisión de Fiscalización y Contraloría",
  "Comisión de Comercio Exterior y Turismo",
  "Comisión de Producción, Micro y Pequeña Empresa y Cooperativas",
  "Comisión de Transportes y Comunicaciones",
  "Comisión de Vivienda y Construcción",
  "Comisión de Energía y Minas",
  "Comisión de Agraria",
  "Comisión de Ambiente",
  "Comisión de Ciencia, Innovación y Tecnología",
  "Comisión de Cultura y Patrimonio Cultural",
  "Comisión de Defensa Nacional, Orden Interno, Desarrollo Alternativo y Lucha Contra las Drogas",
  "Comisión de Descentralización, Regionalización, Gobiernos Locales y Modernización de la Gestión del Estado",
  "Comisión de Inclusión Social y Personas con Discapacidad",
  "Comisión de Inteligencia",
  "Comisión de la Mujer y Familia",
  "Comisión de Pueblos Andinos, Amazónicos y Afroperuanos, Ambiente y Ecología",
  "Comisión de Relaciones Exteriores",
];
