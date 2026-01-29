// Types for Client Profile Management

export interface ClientLocation {
  country: string;
  regions?: string[];
}

export interface ProductService {
  name: string;
  description?: string;
}

export interface ClientArea {
  area: string;
  responsibilityNote?: string;
}

export interface ClientUser {
  id?: string;
  name: string;
  email: string;
  title?: string;
  area?: string;
  phone?: string;
}

export interface WeeklySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:mm format
}

export interface DeliveryChannels {
  email: boolean;
  whatsapp: boolean;
}

export interface EmailRecipients {
  daily: string[];
  weekly: string[];
}

export interface ReportFilters {
  areas?: string[];
  themes?: string[];
  sectors?: string[];
  types?: string[];
  stages?: string[];
  entities?: string[];
}

export interface ClientProfile {
  id?: string;
  // Step 1: Client basics
  legalName: string;
  tradeName?: string;
  shortDescription?: string;
  website?: string;
  locations: ClientLocation[];
  companyType?: string;
  isRegulated: boolean;
  supervisingAuthorities: string[];

  // Step 2: Business scope
  primarySector?: string;
  secondarySectors: string[];
  businessModelDescription?: string;
  productsServices: ProductService[];
  customerSegments: string[];
  distributionChannels: string[];
  isCrossBorder: boolean;
  crossBorderCountries: string[];

  // Step 3: Client Areas
  affectedAreas: ClientArea[];

  // Step 4: Monitoring scope
  monitoringObjective?: string;
  lawBranches: string[];
  keywords: string[];
  exclusions: string[];
  additionalEntities: string[];
  instrumentTypes: string[];

  // Step 5: Priority logic
  stakeholdersAffected: string[];
  highImpactDefinition?: string;
  highUrgencyDefinition?: string;

  // Step 6: Client users
  clientUsers: ClientUser[];

  // Step 7: Delivery settings
  deliveryChannels: DeliveryChannels;
  emailRecipients: EmailRecipients;
  whatsappRecipients: string[];
  dailyReportSchedule?: string; // HH:mm format
  weeklyReportSchedule?: WeeklySchedule;
  timezone: string;
  sendOnlyIfAlerts: boolean;

  // Step 8: Report defaults
  reportDefaultFilters?: ReportFilters;
  includeAnalytics: boolean;
  detailLevel: 'summary' | 'detailed' | 'comprehensive';
  includeExpertCommentary: boolean;
  pdfNamingConvention?: string;

  // Step 9: Confirmations
  whatsappConsent: boolean;
  sourceAcknowledgement: boolean;
  primaryContactId?: string;
  internalNotes?: string;

  // Meta
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export const WIZARD_STEPS = [
  { id: 1, title: 'Client basics', required: true },
  { id: 2, title: 'Business scope', required: true },
  { id: 3, title: 'Client Areas', required: true },
  { id: 4, title: 'Monitoring scope', required: true },
  { id: 5, title: 'Priority logic', required: true },
  { id: 6, title: 'Client users', required: true },
  { id: 7, title: 'Delivery settings', required: true },
  { id: 8, title: 'Report defaults', required: false },
  { id: 9, title: 'Confirmations', required: true },
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

export const LAW_BRANCHES = [
  'Derecho Corporativo',
  'Derecho Tributario',
  'Derecho Laboral',
  'Derecho Ambiental',
  'Derecho Bancario',
  'Derecho de Seguros',
  'Derecho de Telecomunicaciones',
  'Derecho Energético',
  'Derecho Minero',
  'Derecho de la Competencia',
  'Protección al Consumidor',
  'Propiedad Intelectual',
  'Derecho Penal Empresarial',
  'Compliance',
];

export const INSTRUMENT_TYPES = [
  'Ley',
  'Decreto Legislativo',
  'Decreto Supremo',
  'Resolución Ministerial',
  'Resolución de Superintendencia',
  'Proyecto de Ley',
  'Dictamen',
  'Circular',
  'Norma Técnica',
];

export const AREAS = [
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
  'Atención al Cliente',
];

export const TIMEZONES = [
  { value: 'America/Lima', label: 'Lima (GMT-5)' },
  { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
  { value: 'America/Santiago', label: 'Santiago (GMT-4)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
];

export const DETAIL_LEVELS = [
  { value: 'summary', label: 'Resumen' },
  { value: 'detailed', label: 'Detallado' },
  { value: 'comprehensive', label: 'Comprehensivo' },
];

export const DEFAULT_CLIENT_PROFILE: ClientProfile = {
  legalName: '',
  locations: [],
  isRegulated: false,
  supervisingAuthorities: [],
  secondarySectors: [],
  productsServices: [],
  customerSegments: [],
  distributionChannels: [],
  isCrossBorder: false,
  crossBorderCountries: [],
  affectedAreas: [],
  lawBranches: [],
  keywords: [],
  exclusions: [],
  additionalEntities: [],
  instrumentTypes: [],
  stakeholdersAffected: [],
  clientUsers: [],
  deliveryChannels: { email: true, whatsapp: false },
  emailRecipients: { daily: [], weekly: [] },
  whatsappRecipients: [],
  timezone: 'America/Lima',
  sendOnlyIfAlerts: true,
  includeAnalytics: true,
  detailLevel: 'detailed',
  includeExpertCommentary: true,
  whatsappConsent: false,
  sourceAcknowledgement: false,
};
