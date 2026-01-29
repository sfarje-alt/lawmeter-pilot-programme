import { ClientProfile } from "@/components/clients/types";
import { PRIMARY_CLIENT_ID } from "./peruAlertsMockData";

// FarmaSalud Perú - Primary mock client profile
// This client is assigned to all alerts in the Inbox
export const FARMASALUD_CLIENT_PROFILE: ClientProfile = {
  id: PRIMARY_CLIENT_ID,
  
  // Step 1: Client basics
  legalName: "FarmaSalud Perú S.A.C.",
  tradeName: "FarmaSalud",
  shortDescription: "Empresa farmacéutica y de distribución de dispositivos médicos con operaciones en todo el Perú. Especializada en productos oncológicos, medicamentos genéricos y equipamiento hospitalario.",
  website: "https://www.farmasalud.com.pe",
  locations: [
    { country: "Perú", regions: ["Lima", "Arequipa", "Trujillo", "Cusco", "Piura"] }
  ],
  companyType: "S.A.C.",
  isRegulated: true,
  supervisingAuthorities: ["DIGEMID", "SUNAT", "INDECOPI", "SUSALUD"],

  // Step 2: Business scope
  primarySector: "Farmacéutico",
  secondarySectors: ["Dispositivos Médicos", "Oncología", "Seguros"],
  businessModelDescription: "FarmaSalud opera como una empresa farmacéutica integrada verticalmente, con actividades de importación, fabricación, distribución y comercialización de productos farmacéuticos y dispositivos médicos. Suministra a hospitales públicos (EsSalud, MINSA) y clínicas privadas a nivel nacional.",
  productsServices: [
    { name: "Medicamentos Oncológicos", description: "Línea completa de tratamientos oncológicos, incluyendo quimioterapias e inmunoterapias" },
    { name: "Medicamentos Genéricos", description: "Portafolio de más de 500 medicamentos genéricos de alta calidad" },
    { name: "Dispositivos Médicos", description: "Equipamiento hospitalario y dispositivos de diagnóstico" },
    { name: "Distribución Hospitalaria", description: "Servicio de logística y distribución a instituciones de salud" }
  ],
  customerSegments: ["Hospitales públicos", "Clínicas privadas", "Farmacias", "EPS", "Instituciones de Salud"],
  distributionChannels: ["Venta directa", "Licitaciones públicas", "Distribuidores autorizados", "E-commerce B2B"],
  isCrossBorder: true,
  crossBorderCountries: ["Colombia", "Ecuador", "Bolivia", "Chile"],

  // Step 3: Client Areas
  affectedAreas: [
    { area: "Legal", responsibilityNote: "Monitoreo de cambios regulatorios, cumplimiento normativo, contratos con el Estado" },
    { area: "Compliance", responsibilityNote: "Buenas prácticas de manufactura, farmacovigilancia, trazabilidad de productos" },
    { area: "Operaciones", responsibilityNote: "Licencias de funcionamiento, permisos sanitarios, importaciones" },
    { area: "Finanzas", responsibilityNote: "Tributación farmacéutica, exoneraciones, precios de transferencia" },
    { area: "Comercial", responsibilityNote: "Licitaciones públicas, contratos marco, registro de productos" },
    { area: "Asuntos Regulatorios", responsibilityNote: "Registro sanitario, estudios clínicos, bioequivalencia" }
  ],

  // Step 4: Monitoring scope
  monitoringObjective: "Monitoreo integral del entorno regulatorio farmacéutico y de dispositivos médicos para anticipar cambios normativos, identificar oportunidades de negocio en contrataciones públicas, y garantizar el cumplimiento regulatorio continuo.",
  lawBranches: [
    "Derecho de Salud",
    "Derecho Tributario",
    "Derecho de Contrataciones Públicas",
    "Derecho Administrativo",
    "Derecho de Propiedad Intelectual",
    "Derecho de la Competencia"
  ],
  keywords: [
    "farmacéutico",
    "medicamentos",
    "dispositivos médicos",
    "DIGEMID",
    "registro sanitario",
    "oncológico",
    "quimioterapia",
    "EsSalud",
    "MINSA",
    "licitación",
    "contratación pública",
    "genéricos",
    "bioequivalencia",
    "farmacovigilancia",
    "INEN",
    "hospitales",
    "precios de medicamentos",
    "importación"
  ],
  exclusions: ["Veterinario", "Cosméticos", "Suplementos dietéticos"],
  additionalEntities: ["DIGEMID", "SUSALUD", "EsSalud", "MINSA", "INEN", "SIS", "INS", "CENARES"],
  instrumentTypes: [
    "Ley",
    "Decreto Supremo",
    "Resolución Ministerial",
    "Resolución de Superintendencia",
    "Proyecto de Ley",
    "Dictamen"
  ],

  // Step 5: Priority logic
  stakeholdersAffected: ["Accionistas", "Clientes", "Reguladores", "Proveedores", "Directorio", "Gerencia"],
  highImpactDefinition: "Legislación que afecte: (1) Precios o márgenes de medicamentos, (2) Requisitos de registro sanitario, (3) Procesos de licitación pública con entidades de salud, (4) Normativa de farmacovigilancia o trazabilidad, (5) Tratamientos oncológicos o enfermedades raras que representen >15% del portafolio.",
  highUrgencyDefinition: "Alertas con: (1) Plazos de cumplimiento menores a 30 días, (2) Licitaciones públicas en proceso de convocatoria, (3) Proyectos de ley en etapa de Pleno o Trámite Final, (4) Normas publicadas con vigencia inmediata que afecten operaciones.",

  // Step 6: Client users
  clientUsers: [
    {
      id: "user-fs-001",
      name: "María Elena Quispe",
      email: "mquispe@farmasalud.com.pe",
      title: "Gerente Legal",
      area: "Legal",
      phone: "+51 999 123 456"
    },
    {
      id: "user-fs-002",
      name: "Carlos Mendoza Ruiz",
      email: "cmendoza@farmasalud.com.pe",
      title: "Director de Asuntos Regulatorios",
      area: "Asuntos Regulatorios",
      phone: "+51 999 234 567"
    },
    {
      id: "user-fs-003",
      name: "Patricia Vargas Torres",
      email: "pvargas@farmasalud.com.pe",
      title: "Jefe de Compliance",
      area: "Compliance",
      phone: "+51 999 345 678"
    },
    {
      id: "user-fs-004",
      name: "Roberto Salazar Díaz",
      email: "rsalazar@farmasalud.com.pe",
      title: "Gerente Comercial",
      area: "Comercial",
      phone: "+51 999 456 789"
    }
  ],

  // Step 7: Delivery settings
  deliveryChannels: { email: true, whatsapp: true },
  emailRecipients: {
    daily: ["mquispe@farmasalud.com.pe", "cmendoza@farmasalud.com.pe"],
    weekly: ["mquispe@farmasalud.com.pe", "cmendoza@farmasalud.com.pe", "pvargas@farmasalud.com.pe", "rsalazar@farmasalud.com.pe"]
  },
  whatsappRecipients: ["+51 999 123 456", "+51 999 234 567", "+51 999 456 789"],
  dailyReportSchedule: "08:00",
  weeklyReportSchedule: { dayOfWeek: 1, time: "09:00" },
  timezone: "America/Lima",
  sendOnlyIfAlerts: false,

  // Step 8: Report defaults
  reportDefaultFilters: {
    areas: ["Legal", "Compliance", "Asuntos Regulatorios"],
    sectors: ["Farmacéutico", "Dispositivos Médicos", "Oncología"],
    types: ["Proyecto de Ley", "Decreto Supremo", "Resolución Ministerial"]
  },
  includeAnalytics: true,
  detailLevel: "detailed",
  includeExpertCommentary: true,
  pdfNamingConvention: "FARMASALUD_[FECHA]_[TIPO]_Reporte",

  // Step 9: Confirmations
  whatsappConsent: true,
  sourceAcknowledgement: true,
  primaryContactId: "user-fs-001",
  internalNotes: "Cliente prioritario. Gerencia Legal requiere alertas sobre oncológicos y contrataciones públicas con máxima urgencia. Reunión de seguimiento quincenal los martes.",

  // Meta
  status: "active",
  createdAt: "2024-06-15T10:00:00Z",
  updatedAt: "2025-01-20T14:30:00Z"
};

// Export all mock client profiles
export const MOCK_CLIENT_PROFILES: ClientProfile[] = [
  FARMASALUD_CLIENT_PROFILE
];
