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
    { country: "PE", regions: ["Lima", "Arequipa", "Trujillo", "Cusco", "Piura"] }
  ],
  companyType: "S.A.C.",
  isRegulated: true,
  supervisingAuthorities: ["DIGEMID", "SUNAT", "INDECOPI", "SUSALUD"],

  // Business scope
  primarySector: "Farmacéutico",
  secondarySectors: ["Salud"],
  productsServices: [
    { name: "Medicamentos Oncológicos", description: "Línea completa de tratamientos oncológicos" },
    { name: "Medicamentos Genéricos", description: "Portafolio de más de 500 medicamentos genéricos" },
    { name: "Dispositivos Médicos", description: "Equipamiento hospitalario y dispositivos de diagnóstico" },
  ],
  isCrossBorder: true,
  crossBorderCountries: ["CO", "EC", "BO", "CL"],

  // Step 2: Monitoring scope
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
  instrumentTypes: [
    "Ley",
    "Decreto Supremo",
    "Resolución",
    "Decreto de Urgencia",
  ],

  // Step 3: Custom Tag Categories
  tagCategories: [
    {
      id: "areas",
      name: "Áreas Internas",
      description: "Departamentos de la empresa",
      tags: ["Legal", "Compliance", "Operaciones", "Finanzas", "Comercial", "Asuntos Regulatorios"]
    },
    {
      id: "themes",
      name: "Temas de Interés",
      description: "Temas regulatorios prioritarios",
      tags: ["Oncología", "Contrataciones Públicas", "Registro Sanitario", "Precios"]
    }
  ],

  // Step 4: Client users
  clientUsers: [
    {
      id: "user-fs-001",
      name: "María Elena Quispe",
      email: "mquispe@farmasalud.com.pe",
      title: "Gerente Legal",
      phone: "+51 999 123 456"
    },
    {
      id: "user-fs-002",
      name: "Carlos Mendoza Ruiz",
      email: "cmendoza@farmasalud.com.pe",
      title: "Director de Asuntos Regulatorios",
      phone: "+51 999 234 567"
    },
    {
      id: "user-fs-003",
      name: "Patricia Vargas Torres",
      email: "pvargas@farmasalud.com.pe",
      title: "Jefe de Compliance",
      phone: "+51 999 345 678"
    },
  ],

  // Step 5: Confirmations
  sourceAcknowledgement: true,
  primaryContactId: "user-fs-001",
  internalNotes: "Cliente prioritario. Gerencia Legal requiere alertas sobre oncológicos y contrataciones públicas con máxima urgencia.",

  // Meta
  status: "active",
  createdAt: "2024-06-15T10:00:00Z",
  updatedAt: "2025-01-20T14:30:00Z",
  
  // Legacy fields for backward compatibility
  affectedAreas: [],
  lawBranches: [],
  additionalEntities: [],
  stakeholdersAffected: [],
  customerSegments: [],
  distributionChannels: [],
};

// Export all mock client profiles
export const MOCK_CLIENT_PROFILES: ClientProfile[] = [
  FARMASALUD_CLIENT_PROFILE
];
