import { ClientProfile } from "@/components/clients/types";
import { PRIMARY_CLIENT_ID, BACKUS_CLIENT_ID } from "./peruAlertsMockData";

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
    "farmacéutico", "medicamentos", "dispositivos médicos", "DIGEMID",
    "registro sanitario", "oncológico", "quimioterapia", "EsSalud",
    "MINSA", "licitación", "contratación pública", "genéricos",
    "bioequivalencia", "farmacovigilancia", "INEN", "hospitales",
    "precios de medicamentos", "importación"
  ],
  exclusions: ["Veterinario", "Cosméticos", "Suplementos dietéticos"],
  instrumentTypes: ["Ley", "Decreto Supremo", "Resolución", "Decreto de Urgencia"],
  watchedCommissions: [
    "Comisión de Salud y Población",
    "Comisión de Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
    "Comisión de Presupuesto y Cuenta General de la República",
  ],

  // Step 3: Custom Tag Categories
  tagCategories: [
    {
      id: "areas", name: "Áreas Internas", description: "Departamentos de la empresa",
      tags: ["Legal", "Compliance", "Operaciones", "Finanzas", "Comercial", "Asuntos Regulatorios"]
    },
    {
      id: "themes", name: "Temas de Interés", description: "Temas regulatorios prioritarios",
      tags: ["Oncología", "Contrataciones Públicas", "Registro Sanitario", "Precios"]
    }
  ],

  // Step 4: Client users
  clientUsers: [
    { id: "user-fs-001", name: "María Elena Quispe", email: "mquispe@farmasalud.com.pe", title: "Gerente Legal", phone: "+51 999 123 456" },
    { id: "user-fs-002", name: "Carlos Mendoza Ruiz", email: "cmendoza@farmasalud.com.pe", title: "Director de Asuntos Regulatorios", phone: "+51 999 234 567" },
    { id: "user-fs-003", name: "Patricia Vargas Torres", email: "pvargas@farmasalud.com.pe", title: "Jefe de Compliance", phone: "+51 999 345 678" },
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
  affectedAreas: [], lawBranches: [], additionalEntities: [],
  stakeholdersAffected: [], customerSegments: [], distributionChannels: [],
};

// Backus (AB InBev) - Data Privacy focused client
export const BACKUS_CLIENT_PROFILE: ClientProfile = {
  id: BACKUS_CLIENT_ID,

  legalName: "Unión de Cervecerías Peruanas Backus y Johnston S.A.A.",
  tradeName: "Backus",
  shortDescription: "Empresa líder en la industria cervecera peruana, subsidiaria de AB InBev. Opera plantas de producción en Lima, Arequipa, Cusco y Motupe. Procesa datos personales a gran escala de consumidores, empleados, distribuidores y programas de fidelización.",
  website: "https://www.backus.pe",
  locations: [
    { country: "PE", regions: ["Lima", "Arequipa", "Cusco", "Lambayeque"] }
  ],
  companyType: "S.A.A.",
  isRegulated: true,
  supervisingAuthorities: ["ANPD", "SUNAT", "INDECOPI", "PRODUCE"],

  primarySector: "Bebidas / Consumo masivo",
  secondarySectors: ["Manufactura", "Logística"],
  productsServices: [
    { name: "Cervezas", description: "Cristal, Pilsen Callao, Cusqueña, Backus Ice y otras marcas" },
    { name: "Bebidas no alcohólicas", description: "Aguas, gaseosas y maltas" },
    { name: "Programas de fidelización", description: "Plataformas digitales de engagement con consumidores" },
  ],
  isCrossBorder: true,
  crossBorderCountries: ["CO", "EC", "BO", "BE"],

  keywords: [
    "protección de datos", "datos personales", "privacidad", "LPDP",
    "Ley 29733", "ANPD", "DPO", "oficial de datos", "consentimiento",
    "brechas de seguridad", "ciberseguridad", "transferencia internacional",
    "ARCO", "banco de datos", "marketing directo", "fidelización",
    "evaluación de impacto", "EIPD", "sanciones ANPD"
  ],
  exclusions: ["Farmacéutico", "Dispositivos médicos"],
  instrumentTypes: ["Ley", "Decreto Supremo", "Resolución", "Directiva"],
  watchedCommissions: [
    "Comisión de Justicia y Derechos Humanos",
    "Comisión de Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
    "Comisión de Ciencia, Innovación y Tecnología",
  ],

  tagCategories: [
    {
      id: "areas", name: "Áreas Internas", description: "Departamentos de la empresa",
      tags: ["Legal", "Compliance", "IT", "Marketing", "Recursos Humanos", "DPO"]
    },
    {
      id: "themes", name: "Temas de Interés", description: "Temas regulatorios prioritarios",
      tags: ["Protección de Datos", "Ciberseguridad", "Marketing Digital", "Transferencias Internacionales"]
    }
  ],

  clientUsers: [
    { id: "user-bk-001", name: "Alejandro Rivas Montero", email: "arivas@backus.pe", title: "Director Legal", phone: "+51 998 100 200" },
    { id: "user-bk-002", name: "Lucía Paredes Soto", email: "lparedes@backus.pe", title: "Jefe de Compliance", phone: "+51 998 200 300" },
    { id: "user-bk-003", name: "Fernando Castillo Díaz", email: "fcastillo@backus.pe", title: "Data Protection Officer (DPO)", phone: "+51 998 300 400" },
  ],

  sourceAcknowledgement: true,
  primaryContactId: "user-bk-001",
  internalNotes: "Cliente corporativo multinacional (AB InBev). Enfoque principal en protección de datos personales y ciberseguridad. El DPO requiere alertas inmediatas sobre cambios normativos en LPDP.",

  status: "active",
  createdAt: "2025-02-01T10:00:00Z",
  updatedAt: "2025-03-05T14:30:00Z",

  affectedAreas: [], lawBranches: [], additionalEntities: [],
  stakeholdersAffected: [], customerSegments: [], distributionChannels: [],
};

// Export all mock client profiles
export const MOCK_CLIENT_PROFILES: ClientProfile[] = [
  FARMASALUD_CLIENT_PROFILE,
  BACKUS_CLIENT_PROFILE,
];
