// Perfil rígido del cliente piloto: Betsson Group.
// Fuente: documento "Perfil Regulatorio: Betsson" provisto por el cliente.
// Esta es la fuente de verdad para el perfil mostrado en /perfil y en el
// portal cliente. Editar aquí si cambian los datos oficiales.

import { ClientProfile } from "@/components/clients/types";

export const BEDSON_ORGANIZATION_NAME = "Betsson Group";

export const BEDSON_CLIENT_PROFILE: ClientProfile = {
  id: "b7e15500-0002-4000-8000-000000000001",

  // ── Datos básicos ────────────────────────────────────────────────────────
  legalName: "Betsson Group",
  tradeName: "Betsson / Betsafe / Inkabet",
  shortDescription:
    "Operador de juegos a distancia y apuestas deportivas a distancia en el Perú. Ofrece sportsbook, casino online y casino en vivo bajo las marcas Betsson, Betsafe e Inkabet/InkaBet. Su actividad está sujeta al régimen jurídico especial de explotación de plataformas tecnológicas de juegos a distancia y apuestas deportivas a distancia, con autorización administrativa previa, supervisión y fiscalización continua de MINCETUR a través de la DGJCMT (homologación de sistemas, requisitos técnicos y obligaciones operativas permanentes). El modelo de negocio comprende gestión de cuentas de usuario, verificación de identidad y mayoría de edad, procesamiento de pagos (depósitos y retiros), uso de proveedores tecnológicos vinculados, prevención de LA/FT ante UIF-Perú y SBS, obligaciones tributarias sectoriales ante SUNAT y MEF, y normativa de protección al consumidor, publicidad, promociones, condiciones contractuales y protección de datos personales.",
  website: "https://www.betsson.com",
  locations: [
    { country: "PE", regions: ["Lima"] },
  ],
  companyType: "Grupo / holding (Betsson AB / Betsson Group)",
  isRegulated: true,
  supervisingAuthorities: [
    "MINCETUR",
    "DGJCMT",
    "SUNAT",
    "SBS",
    "UIF-Perú",
    "INDECOPI",
    "MEF",
  ],

  // ── Alcance de negocio ───────────────────────────────────────────────────
  primarySector: "Juegos a distancia / apuestas deportivas a distancia / casino online",
  secondarySectors: ["Entretenimiento digital", "Pagos electrónicos"],
  productsServices: [
    {
      name: "Apuestas deportivas (sportsbook)",
      description: "Apuestas deportivas a distancia, incluyendo apuestas en vivo y pre-partido, bajo marcas Betsson, Betsafe e Inkabet.",
    },
    {
      name: "Casino online",
      description: "Catálogo de juegos de casino a distancia (slots, ruleta, blackjack y otros) operados desde plataforma tecnológica autorizada.",
    },
    {
      name: "Casino en vivo",
      description: "Mesas de casino en vivo transmitidas en streaming con dealers reales.",
    },
  ],
  isCrossBorder: true,
  crossBorderCountries: [],

  // ── Monitoreo ────────────────────────────────────────────────────────────
  // Keywords core + sectoriales + AML/KYC + tributarias + negocio + técnicas
  keywords: [
    // Core
    "juegos a distancia",
    "apuestas deportivas a distancia",
    "casino online",
    "operador de juegos a distancia",
    "operador de apuestas deportivas a distancia",
    "plataforma tecnológica",
    "autorización de explotación",
    "renovación de autorización",
    "licencia",
    "homologación",
    "fiscalización",
    "sanción",
    "suspensión",
    "revocación",
    "proveedor de servicios vinculados",
    "juego responsable",
    "autoexclusión",
    "verificación de edad",
    "verificación de identidad",
    "KYC",
    "AML",
    "LA/FT",
    "oficial de cumplimiento",
    "medios de pago",
    "publicidad",
    "promociones",
    "bonos",
    "términos y condiciones",
    "política de privacidad",
    "cookies",
    "protección al consumidor",
    "datos personales",
    "fraude",
    "ciberseguridad",
    "pasarela de pago",
    "cuenta de jugador",
    "depósitos",
    "retiros",
    // Sectoriales
    "MINCETUR",
    "DGJCMT",
    "resolución directoral",
    "titular",
    "autorización",
    "renovación",
    "proveedor vinculado",
    "código de registro",
    "registro de usuarios",
    "verificación del jugador",
    "condición del jugador",
    "menores de edad",
    // AML / KYC
    "lavado de activos",
    "legitimación de capitales",
    "financiamiento del terrorismo",
    "Conozca a su Cliente",
    "UIF",
    "Unidad de Inteligencia Financiera",
    "sujeto obligado",
    "debida diligencia",
    "monitoreo transaccional",
    "medios adversos",
    "beneficiario final",
    "prevención del fraude",
    "agencias de crédito",
    // Tributarias
    "impuesto a los juegos a distancia",
    "impuesto a las apuestas deportivas a distancia",
    "impuesto selectivo al consumo",
    "ISC",
    "SUNAT",
    "MEF",
    "declaración tributaria",
    "formulario virtual",
    "RUC",
    "no domiciliado",
    "premios entregados",
    "devoluciones efectuadas",
    "gastos de mantenimiento de la plataforma",
    // Negocio / producto
    "sportsbook",
    "apuestas deportivas",
    "apuestas en vivo",
    "casino",
    "casino en vivo",
    "bono de bienvenida",
    "freebet",
    "club VIP",
    "aplicación móvil",
    "afiliados",
    "patrocinio",
    "sponsor",
    "patrocinio deportivo",
    "cashout",
    // Técnicas
    "PAM",
    "RGS",
    "agregador",
    "programa de juego",
    "modalidad de juego",
    "sistema progresivo",
    "generador de números aleatorios",
    "integración",
    "certificado de cumplimiento",
    "servidor remoto de juego",
    "terminal de apuesta deportiva",
    "administrador de cuenta de juego",
  ],
  exclusions: [
    "Juego presencial / casinos físicos",
    "Máquinas tragamonedas presenciales",
    "Bingos comunales",
    "Loterías benéficas",
  ],
  instrumentTypes: [
    "Leyes",
    "Decretos Supremos",
    "Decretos Legislativos",
    "Resoluciones Ministeriales",
    "Resoluciones Directorales",
    "Directivas",
    "Proyectos de Ley",
  ],
  watchedCommissions: [
    "Comisión de Comercio Exterior y Turismo",
    "Comisión de Economía, Banca, Finanzas e Inteligencia Financiera",
    "Comisión de Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
    "Comisión de Justicia y Derechos Humanos",
    "Comisión de Presupuesto y Cuenta General de la República",
  ],

  // ── Etiquetas internas ───────────────────────────────────────────────────
  tagCategories: [
    {
      id: "areas",
      name: "Áreas internas",
      description: "Áreas funcionales del negocio que reciben las alertas.",
      tags: ["Legal & Compliance", "AML", "Finanzas", "Tributario", "Operaciones", "Producto", "Marketing", "Tecnología"],
    },
    {
      id: "prioridad-comercial",
      name: "Prioridad comercial",
      description: "Categorías de impacto comercial directo.",
      tags: [
        "Continuidad de licencia",
        "Homologación de plataforma",
        "Costos tributarios",
        "Restricción publicitaria",
        "Medios de pago",
        "UX de jugador",
      ],
    },
  ],

  // ── Confirmaciones ───────────────────────────────────────────────────────
  sourceAcknowledgement: true,
  internalNotes:
    "Cliente piloto. Fuentes prioritarias: portal institucional MINCETUR/DGJCMT (juegos a distancia y apuestas deportivas), plataforma gob.pe, Diario Oficial El Peruano, SUNAT, SBS, MEF y Congreso de la República del Perú. Toda la data del Inbox, Sesiones y Analíticas debe provenir exclusivamente de estas fuentes oficiales. No usar datasets demo.",

  // ── Criterios IA ─────────────────────────────────────────────────────────
  highImpactCriteria:
    "Cualquier modificación normativa, regulatoria o criterio administrativo que afecte: (i) la obtención, renovación, modificación, suspensión o revocación de autorizaciones o licencias; (ii) la homologación o requisitos técnicos de la plataforma; (iii) la continuidad operativa; (iv) las obligaciones de juego responsable, autoexclusión y verificación del jugador; (v) el cumplimiento en materia de prevención de LA/FT ante UIF-Perú y SBS; (vi) el régimen tributario aplicable al sector; o (vii) restricciones o cambios relevantes en promociones, publicidad, bonos, términos y condiciones, medios de pago, prevención del fraude, ciberseguridad o protección de datos personales.",
  highUrgencyCriteria:
    "Cualquier disposición normativa o acto administrativo con vigencia inmediata o plazos de adecuación inferiores a treinta (30) días; cualquier resolución o actuación de MINCETUR/DGJCMT relativa a autorización, suspensión o sanción; cualquier obligación con plazo cierto impuesta por SUNAT, SBS o UIF-Perú; y cualquier exigencia técnica o regulatoria que impacte directamente la operación de la plataforma, integraciones tecnológicas, procesamiento de pagos, registro de usuarios, verificación del jugador o continuidad del negocio.",

  // ── Meta ─────────────────────────────────────────────────────────────────
  status: "active",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: new Date().toISOString(),
};
