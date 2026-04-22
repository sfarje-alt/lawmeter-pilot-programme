// Perfil rígido del cliente piloto: Bedson Group (Betsson Group).
// Reemplaza al perfil mock de FarmaSalud para todas las cuentas de la
// organización piloto. Si necesitas ajustar datos reales, edita este archivo
// directamente — los valores aquí son la fuente de verdad para el perfil
// mostrado en /perfil y en el portal cliente.
//
// NOTA: Pendiente recibir el documento Word con los datos finales de Bedson.
// Los valores actuales son placeholders coherentes con el sector
// (iGaming / apuestas online en Perú) basados en el alcance del piloto.

import { ClientProfile } from "@/components/clients/types";

export const BEDSON_ORGANIZATION_NAME = "Bedson Group";

export const BEDSON_CLIENT_PROFILE: ClientProfile = {
  id: "b7e15500-0002-4000-8000-000000000001",

  // ── Datos básicos ────────────────────────────────────────────────────────
  legalName: "Bedson Group",
  tradeName: "Bedson",
  shortDescription:
    "Operador internacional de juegos de azar y apuestas deportivas online con presencia regulada en Perú. Monitoreo enfocado en normativa de juego remoto, prevención de lavado de activos, protección al consumidor y régimen tributario aplicable a la actividad.",
  website: "https://www.bedsongroup.com",
  locations: [
    { country: "PE", regions: ["Lima"] },
  ],
  companyType: "S.A.C.",
  isRegulated: true,
  supervisingAuthorities: [
    "MINCETUR",
    "DGJCMT",
    "SUNAT",
    "UIF-Perú",
    "INDECOPI",
  ],

  // ── Alcance de negocio ───────────────────────────────────────────────────
  primarySector: "Juegos de azar y apuestas online",
  secondarySectors: ["Entretenimiento digital", "Pagos electrónicos"],
  productsServices: [
    {
      name: "Apuestas deportivas online",
      description: "Plataforma de apuestas en eventos deportivos en vivo y pre-partido.",
    },
    {
      name: "Casino online",
      description: "Catálogo de juegos de casino: slots, ruleta, blackjack y juegos en vivo.",
    },
    {
      name: "Poker online",
      description: "Sala de póker multi-mesa para mercado peruano.",
    },
  ],
  isCrossBorder: true,
  crossBorderCountries: ["AR", "CL", "CO", "MX"],

  // ── Monitoreo ────────────────────────────────────────────────────────────
  keywords: [
    "juegos de azar",
    "apuestas deportivas",
    "juego remoto",
    "casino online",
    "MINCETUR",
    "DGJCMT",
    "Ley 31557",
    "ISC apuestas",
    "impuesto al juego",
    "prevención de lavado de activos",
    "UIF",
    "publicidad de juego",
    "juego responsable",
    "protección al consumidor",
    "INDECOPI",
    "ludopatía",
    "registro de jugadores",
    "verificación de identidad",
    "KYC",
    "medios de pago",
  ],
  exclusions: [
    "Juego presencial / casinos físicos",
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
  ],

  // ── Etiquetas internas ───────────────────────────────────────────────────
  tagCategories: [
    {
      id: "areas",
      name: "Áreas internas",
      description: "Áreas funcionales del negocio que reciben las alertas.",
      tags: ["Legal & Compliance", "Finanzas", "Operaciones", "Producto", "Marketing", "AML"],
    },
    {
      id: "prioridad-comercial",
      name: "Prioridad comercial",
      description: "Categorías de impacto comercial directo.",
      tags: ["Continuidad de licencia", "Costos tributarios", "Restricción publicitaria", "UX de jugador"],
    },
  ],

  // ── Confirmaciones ───────────────────────────────────────────────────────
  sourceAcknowledgement: true,
  internalNotes:
    "Cliente piloto. Toda la data del Inbox, Sesiones y Analíticas debe provenir exclusivamente de fuentes oficiales sincronizadas (Congreso, El Peruano, MINCETUR). No usar datasets demo.",

  // ── Criterios IA ─────────────────────────────────────────────────────────
  highImpactCriteria:
    "Cualquier norma o proyecto que (1) modifique las condiciones de licencia para operadores de juego remoto, (2) altere el régimen tributario aplicable a apuestas (ISC, impuesto al juego, IGV), (3) restrinja la publicidad o medios de pago de operadores online, o (4) imponga nuevas obligaciones de KYC/AML.",
  highUrgencyCriteria:
    "Plazo de adecuación menor a 60 días, fechas de vigencia inminentes, sesiones de comisión con dictamen previsto en menos de 14 días, o normas con efecto inmediato sobre la operación.",

  // ── Meta ─────────────────────────────────────────────────────────────────
  status: "active",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: new Date().toISOString(),
};
