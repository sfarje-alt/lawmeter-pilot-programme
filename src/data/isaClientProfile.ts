// Perfil rígido del cliente piloto: ISA Energía (REP – Red de Energía del Perú).
// Esta es la fuente de verdad para el perfil mostrado en /perfil del portal
// cliente para la organización ISA Energía. Editar aquí si cambian los datos
// oficiales entregados por el equipo legal.

import { ClientProfile } from "@/components/clients/types";

export const ISA_ORGANIZATION_NAME = "ISA Energía";

export const ISA_CLIENT_PROFILE: ClientProfile = {
  id: "b7e15500-0004-4000-8000-000000000001",

  // ── Datos básicos ────────────────────────────────────────────────────────
  legalName: "ISA REP S.A.",
  tradeName: "ISA Energía · REP · ISA Perú",
  shortDescription:
    "Empresa concesionaria del Sistema Eléctrico Interconectado Nacional (SEIN) en el Perú, dedicada principalmente a la transmisión de energía eléctrica en alta y muy alta tensión. Su actividad está sujeta al régimen jurídico especial del subsector electricidad (Ley de Concesiones Eléctricas y su reglamento), con supervisión y fiscalización continua de OSINERGMIN, regulación tarifaria y de calidad, obligaciones ambientales y sociales (SENACE, OEFA, MINAM), gestión de servidumbres y derechos de vía sobre líneas de transmisión, relacionamiento con comunidades y autoridades locales, y obligaciones operativas permanentes coordinadas con el COES SINAC. El modelo de negocio comprende contratos de concesión de transmisión, proyectos de expansión adjudicados por ProInversión, mantenimiento de líneas y subestaciones, cumplimiento de estándares de calidad de servicio, normativa ambiental, seguridad y salud ocupacional, así como obligaciones tributarias sectoriales ante SUNAT.",
  website: "https://www.isaenergia.com.pe",
  locations: [
    { country: "PE", regions: ["Lima"] },
  ],
  companyType: "Sociedad anónima (filial del grupo ISA / Colombia)",
  isRegulated: true,
  supervisingAuthorities: [
    "MINEM",
    "OSINERGMIN",
    "COES SINAC",
    "SENACE",
    "OEFA",
    "MINAM",
    "ProInversión",
    "SUNAT",
    "INDECOPI",
  ],

  // ── Alcance de negocio ───────────────────────────────────────────────────
  primarySector: "Energía eléctrica · transmisión en alta y muy alta tensión",
  secondarySectors: ["Infraestructura energética", "Servicios públicos"],
  productsServices: [
    {
      name: "Transmisión de energía eléctrica",
      description:
        "Operación y mantenimiento de líneas de transmisión y subestaciones en alta y muy alta tensión integradas al SEIN bajo contratos de concesión.",
    },
    {
      name: "Proyectos de expansión de transmisión",
      description:
        "Desarrollo, construcción y puesta en operación de nuevos enlaces de transmisión adjudicados por ProInversión bajo el régimen de concesiones del sector eléctrico.",
    },
    {
      name: "Servicios asociados al sector eléctrico",
      description:
        "Servicios de operación, mantenimiento e ingeniería sobre activos de transmisión y conexión al SEIN.",
    },
  ],
  isCrossBorder: false,
  crossBorderCountries: [],

  // ── Monitoreo ────────────────────────────────────────────────────────────
  keywords: [
    // Core sector eléctrico
    "transmisión eléctrica",
    "líneas de transmisión",
    "subestaciones",
    "alta tensión",
    "muy alta tensión",
    "Sistema Eléctrico Interconectado Nacional",
    "SEIN",
    "concesión eléctrica",
    "concesión de transmisión",
    "Ley de Concesiones Eléctricas",
    "Reglamento de la Ley de Concesiones Eléctricas",
    "tarifa de transmisión",
    "peaje de transmisión",
    "remuneración de la transmisión",
    "calidad de servicio eléctrico",
    "Norma Técnica de Calidad de los Servicios Eléctricos",
    "NTCSE",
    "servidumbre eléctrica",
    "derecho de vía",
    "expansión de la transmisión",
    "Plan de Transmisión",
    // Reguladores y operadores
    "MINEM",
    "Ministerio de Energía y Minas",
    "OSINERGMIN",
    "COES",
    "COES SINAC",
    "Comité de Operación Económica del Sistema",
    "ProInversión",
    "concurso público",
    "adjudicación",
    // Ambiental y social
    "estudio de impacto ambiental",
    "EIA",
    "EIA-d",
    "EIA-sd",
    "SENACE",
    "OEFA",
    "MINAM",
    "instrumento de gestión ambiental",
    "modificación del EIA",
    "plan de manejo ambiental",
    "monitoreo ambiental",
    "consulta previa",
    "comunidades campesinas",
    "comunidades nativas",
    "relacionamiento comunitario",
    // Seguridad, operación y técnicas
    "seguridad y salud ocupacional",
    "SST",
    "sector eléctrico",
    "operación del sistema",
    "interconexión",
    "conexión al SEIN",
    "código nacional de electricidad",
    "puesta a tierra",
    "compatibilidad electromagnética",
    "indisponibilidad",
    "interrupción del suministro",
    // Tributarias y societarias
    "SUNAT",
    "impuesto a la renta",
    "regalías",
    "depreciación de activos",
    "concesión",
    "aporte por regulación",
    // Procedimientos administrativos
    "procedimiento administrativo sancionador",
    "supervisión",
    "fiscalización",
    "multa",
    "incumplimiento",
    "medida correctiva",
  ],
  exclusions: [
    "Distribución eléctrica domiciliaria",
    "Generación eléctrica",
    "Comercialización minorista de electricidad",
    "Hidrocarburos y gas natural",
    "Minería metálica y no metálica",
  ],
  instrumentTypes: [
    "Leyes",
    "Decretos Supremos",
    "Decretos Legislativos",
    "Resoluciones Ministeriales",
    "Resoluciones de Consejo Directivo (OSINERGMIN)",
    "Resoluciones Directorales",
    "Directivas",
    "Proyectos de Ley",
  ],
  watchedCommissions: [
    "Comisión de Energía y Minas",
    "Comisión de Pueblos Andinos, Amazónicos y Afroperuanos, Ambiente y Ecología",
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
      tags: [
        "Legal & Regulatorio",
        "Operaciones",
        "Proyectos y Expansión",
        "Ambiental y Social",
        "Seguridad y SST",
        "Finanzas",
        "Tributario",
        "Relaciones Institucionales",
      ],
    },
    {
      id: "prioridad-comercial",
      name: "Prioridad regulatoria",
      description: "Categorías de impacto regulatorio y operacional directo.",
      tags: [
        "Continuidad de concesión",
        "Tarifa y remuneración",
        "Calidad de servicio",
        "Servidumbres y derecho de vía",
        "Cumplimiento ambiental",
        "Relacionamiento comunitario",
        "Sanciones OSINERGMIN/OEFA",
      ],
    },
  ],

  // ── Confirmaciones ───────────────────────────────────────────────────────
  sourceAcknowledgement: true,
  internalNotes:
    "Cliente piloto. Fuentes prioritarias: portal institucional del MINEM, OSINERGMIN, COES SINAC, SENACE, OEFA, MINAM, ProInversión, plataforma gob.pe, Diario Oficial El Peruano, SUNAT y Congreso de la República del Perú. Toda la data del Inbox, Sesiones y Analíticas debe provenir exclusivamente de estas fuentes oficiales. No usar datasets demo.",

  // ── Criterios IA ─────────────────────────────────────────────────────────
  highImpactCriteria:
    "Cualquier modificación normativa, regulatoria o criterio administrativo que afecte: (i) la obtención, modificación, caducidad o revocación de concesiones eléctricas de transmisión; (ii) el régimen tarifario, peajes o remuneración de la transmisión; (iii) los estándares de calidad de servicio aplicables a la transmisión (NTCSE y normas conexas); (iv) las obligaciones ambientales y sociales sobre líneas y subestaciones (EIA, instrumentos de gestión ambiental, fiscalización de OEFA/SENACE); (v) el régimen de servidumbres, derechos de vía y expropiaciones; (vi) las obligaciones de operación y coordinación con el COES SINAC; (vii) el régimen tributario sectorial aplicable; o (viii) la responsabilidad administrativa, civil o penal de la empresa por incidentes operativos o ambientales.",
  highUrgencyCriteria:
    "Cualquier disposición normativa o acto administrativo con vigencia inmediata o plazos de adecuación inferiores a treinta (30) días; cualquier resolución de OSINERGMIN, OEFA, SENACE o MINEM que imponga obligaciones, medidas correctivas, sanciones o suspensiones a la actividad de transmisión; cualquier convocatoria o cambio en concursos de ProInversión que afecten la cartera de proyectos; cualquier obligación con plazo cierto impuesta por SUNAT; y cualquier exigencia técnica, ambiental o de seguridad que impacte directamente la operación del SEIN, la disponibilidad de líneas y subestaciones o la continuidad del servicio.",

  // ── Meta ─────────────────────────────────────────────────────────────────
  status: "active",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: new Date().toISOString(),
};
