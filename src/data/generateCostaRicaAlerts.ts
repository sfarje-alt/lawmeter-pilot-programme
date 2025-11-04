import { Alert, PGRPronouncement } from "@/types/legislation";

// Mock PGR Pronouncements for starred alerts
const mockPGRPronouncements: Record<string, PGRPronouncement[]> = {
  "7786": [
    {
      consultation_number: "C-213-2005",
      date: "2005-08-15",
      type: "Dictamen",
      issuer: "Dra. María Eugenia Gutiérrez Solís",
      issuer_position: "Procuradora Adjunta",
      conclusion_summary: [
        "La presente consulta se refiere a la aplicación de la Ley de Legitimación de Capitales en el contexto de transferencias internacionales.",
        "Se concluye que las transferencias de fondos a terceros países requieren autorización previa de la autoridad competente cuando superen los umbrales establecidos.",
        "Las entidades financieras deben implementar medidas de seguridad técnicas y organizativas adecuadas antes de realizar cualquier transferencia transfronteriza."
      ],
      relevance_level: "high",
      link: "https://www.pgr.go.cr/pronunciamientos/C-213-2005",
      is_new: true,
      scraped_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 días atrás
    },
    {
      consultation_number: "OJ-087-2023",
      date: "2023-03-22",
      type: "Opinión Jurídica",
      issuer: "Lic. Carlos Alberto Méndez Rojas",
      issuer_position: "Procurador Auxiliar",
      conclusion_summary: [
        "Se analiza la compatibilidad de las nuevas disposiciones con el marco regulatorio vigente en materia de prevención de legitimación de capitales.",
        "Se recomienda la implementación gradual de los cambios normativos para permitir la adaptación de los sujetos obligados.",
        "Es conveniente establecer un periodo de transición de 6 meses para la plena aplicación de estas disposiciones."
      ],
      relevance_level: "medium",
      link: "https://www.pgr.go.cr/pronunciamientos/OJ-087-2023"
    }
  ],
  "9635": [
    {
      consultation_number: "C-142-2024",
      date: "2024-01-18",
      type: "Dictamen",
      issuer: "Dr. José Francisco Ramírez Arce",
      issuer_position: "Procurador General",
      conclusion_summary: [
        "El presente dictamen establece criterios vinculantes sobre la interpretación de las obligaciones tributarias bajo esta normativa.",
        "Las entidades financieras deben reportar todas las operaciones superiores al umbral establecido sin excepción.",
        "El incumplimiento de estas disposiciones genera responsabilidad administrativa y potencialmente penal."
      ],
      relevance_level: "high",
      link: "https://www.pgr.go.cr/pronunciamientos/C-142-2024"
    }
  ],
  "8220": [
    {
      consultation_number: "OJ-156-2023",
      date: "2023-11-05",
      type: "Opinión Jurídica",
      issuer: "Licda. Patricia Mora Castellanos",
      issuer_position: "Procuradora Adjunta",
      conclusion_summary: [
        "Se evalúa la necesidad de actualizar los procedimientos internos conforme a los cambios normativos recientes.",
        "Se sugiere la implementación de controles adicionales en los procesos de validación documental.",
        "La opinión recomienda fortalecer los mecanismos de supervisión y auditoría interna."
      ],
      relevance_level: "medium",
      link: "https://www.pgr.go.cr/pronunciamientos/OJ-156-2023"
    },
    {
      consultation_number: "C-089-2024",
      date: "2024-02-14",
      type: "Dictamen",
      issuer: "Lic. Roberto Alvarado Núñez",
      issuer_position: "Procurador Adjunto",
      conclusion_summary: [
        "La aplicación de las sanciones administrativas previstas en esta ley requiere el cumplimiento estricto del debido proceso.",
        "Las autoridades competentes deben garantizar el derecho de defensa en todas las etapas del procedimiento sancionatorio.",
        "Se establece que el plazo para presentar descargos es de 15 días hábiles contados a partir de la notificación."
      ],
      relevance_level: "high",
      link: "https://www.pgr.go.cr/pronunciamientos/C-089-2024"
    }
  ],
  "9416": [
    {
      consultation_number: "C-078-2024",
      date: "2024-03-10",
      type: "Dictamen",
      issuer: "Dra. Ana Lorena Brenes Esquivel",
      issuer_position: "Procuradora General Adjunta",
      conclusion_summary: [
        "Se establece que el tratamiento de datos personales en el sector financiero debe cumplir estrictamente con los principios de legalidad, finalidad y proporcionalidad.",
        "Las entidades deben obtener consentimiento expreso e informado de los titulares antes de procesar sus datos personales.",
        "Se recomienda la designación de un Oficial de Protección de Datos en cada entidad financiera."
      ],
      relevance_level: "high",
      link: "https://www.pgr.go.cr/pronunciamientos/C-078-2024"
    }
  ],
  "7558": [
    {
      consultation_number: "OJ-234-2023",
      date: "2023-09-18",
      type: "Opinión Jurídica",
      issuer: "Lic. Fernando Castillo Víquez",
      issuer_position: "Procurador Auxiliar",
      conclusion_summary: [
        "Se analiza el alcance de las facultades del Banco Central en materia de supervisión del sistema financiero nacional.",
        "La opinión sugiere fortalecer los mecanismos de coordinación entre el BCCR y las superintendencias del sistema financiero.",
        "Se recomienda actualizar los protocolos de comunicación y reporte de información financiera."
      ],
      relevance_level: "medium",
      link: "https://www.pgr.go.cr/pronunciamientos/OJ-234-2023"
    }
  ]
};

// Helper to generate dates relative to today
function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function pastDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const ministries = [
  "Banco Central de Costa Rica",
  "SUGEF (Superintendencia General de Entidades Financieras)",
  "SUGEVAL (Superintendencia General de Valores)",
  "Ministerio de Hacienda",
  "CONASSIF (Consejo Nacional de Supervisión del Sistema Financiero)",
  "ICD (Instituto Costarricense sobre Drogas)",
  "Ministerio de Justicia y Paz"
];

const lawsData = [
  { 
    number: "7786", 
    name: "Ley sobre Estupefacientes, Sustancias Psicotrópicas, Drogas de Uso No Autorizado, Legitimación de Capitales y Actividades Conexas",
    ministry: "ICD (Instituto Costarricense sobre Drogas)",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/25280.pdf"
  },
  { 
    number: "8204", 
    name: "Ley sobre Estupefacientes, Sustancias Psicotrópicas, Drogas de Uso No Autorizado, Legitimación de Capitales y Actividades Conexas (Reforma)",
    ministry: "ICD (Instituto Costarricense sobre Drogas)",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/18543.pdf"
  },
  { 
    number: "9416", 
    name: "Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales",
    ministry: "Ministerio de Justicia y Paz",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/20463.pdf"
  },
  { 
    number: "7558", 
    name: "Ley Orgánica del Banco Central de Costa Rica",
    ministry: "Banco Central de Costa Rica",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/15487.pdf"
  },
  { 
    number: "8204", 
    name: "Ley de Prevención de Lavado de Activos y Financiamiento del Terrorismo",
    ministry: "ICD (Instituto Costarricense sobre Drogas)",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/18543.pdf"
  },
  { 
    number: "7732", 
    name: "Ley Reguladora del Mercado de Valores",
    ministry: "SUGEVAL (Superintendencia General de Valores)",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/16789.pdf"
  },
  { 
    number: "7472", 
    name: "Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor",
    ministry: "Ministerio de Economía, Industria y Comercio",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/14523.pdf"
  },
  { 
    number: "8634", 
    name: "Ley del Sistema de Banca para el Desarrollo",
    ministry: "Banco Central de Costa Rica",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/19234.pdf"
  },
  { 
    number: "7391", 
    name: "Ley Reguladora de la Actividad de Intermediación Financiera de las Organizaciones Cooperativas",
    ministry: "SUGEF (Superintendencia General de Entidades Financieras)",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/13956.pdf"
  },
  { 
    number: "8000", 
    name: "Ley de Protección al Ciudadano del Exceso de Requisitos y Trámites Administrativos",
    ministry: "Ministerio de Hacienda",
    type: "Ley" as const,
    billProjectLink: "https://d1qqtien6gys07.cloudfront.net/wp-content/uploads/2025/11/17890.pdf"
  },
];

// Reglamentos (Decretos Ejecutivos)
const regulationsData = [
  {
    number: "27548",
    name: "Crea la Comisión Nacional para el Estudio de Políticas Preventivas Contra la Legitimación de Capitales Provenientes del Narcotráfico",
    ministry: "ICD (Instituto Costarricense sobre Drogas)",
    type: "Decreto Ejecutivo" as const,
    relatedLaw: "7786"
  },
  {
    number: "38233",
    name: "Reglamento para el Control de Operaciones Sospechosas en el Sistema Financiero Nacional",
    ministry: "SUGEF (Superintendencia General de Entidades Financieras)",
    type: "Decreto Ejecutivo" as const,
    relatedLaw: "8204"
  },
  {
    number: "41710",
    name: "Reglamento de Protección de Datos Personales en Entidades del Sistema Financiero",
    ministry: "Banco Central de Costa Rica",
    type: "Decreto Ejecutivo" as const,
    relatedLaw: "9416"
  },
  {
    number: "39913",
    name: "Reglamento de Requisitos de Capital y Liquidez para Entidades Financieras",
    ministry: "SUGEF (Superintendencia General de Entidades Financieras)",
    type: "Decreto Ejecutivo" as const,
    relatedLaw: "7558"
  },
  {
    number: "42670",
    name: "Reglamento de Debida Diligencia del Cliente en el Sector Financiero",
    ministry: "CONASSIF (Consejo Nacional de Supervisión del Sistema Financiero)",
    type: "Decreto Ejecutivo" as const,
    relatedLaw: "8204"
  }
];

// Generate alerts for all quadrants
export function generateCostaRicaAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let id = 5000;

  // High Impact, High Urgency (10 alerts) - Rige muy pronto - Temas críticos bancarios
  const criticalTopics = [
    {
      law: lawsData[0],
      title: "Actualización Urgente: Umbrales de Reporte de Operaciones Sospechosas en Transacciones Digitales",
      summary: "Se modifican los Artículos 15, 16 y 17 de la Ley 7786 estableciendo nuevos umbrales obligatorios para el reporte de operaciones sospechosas en canales digitales y billeteras electrónicas. Los nuevos límites incluyen: transacciones superiores a $5,000 USD en canales no presenciales, transferencias internacionales por montos acumulados superiores a $10,000 USD en 30 días, y operaciones con criptoactivos. Las entidades financieras deben actualizar sus sistemas de monitoreo transaccional y reportar retroactivamente operaciones de los últimos 90 días que cumplan los nuevos criterios.",
      bullets: [
        "Nuevos umbrales: $5,000 USD en canales digitales, $10,000 USD acumulado mensual",
        "Inclusión obligatoria de monitoreo de criptoactivos y stablecoins",
        "Reporte retroactivo de 90 días desde entrada en vigencia",
        "Actualización de sistemas de detección automática requerida",
        "Sanciones: multas de hasta ₡500 millones por incumplimiento"
      ],
      units: ["Prevención de Lavado", "Cumplimiento", "TI", "Operaciones Digitales"],
      riskScore: 95
    },
    {
      law: lawsData[4],
      title: "Reforma Crítica: Protocolo Know Your Customer (KYC) con Verificación Biométrica Obligatoria",
      summary: "Reforma al Reglamento de KYC que establece la obligatoriedad de verificación biométrica para todas las cuentas nuevas y actualización de cuentas existentes de alto riesgo. Se requiere implementación de sistemas de reconocimiento facial, huella digital o iris, integrados con el Registro Civil. Las entidades deben completar la actualización del 100% de sus cuentas de riesgo alto en 60 días y del total de la cartera en 12 meses. Incluye obligación de verificación continua mediante transacciones sensibles.",
      bullets: [
        "Verificación biométrica obligatoria para todas las cuentas nuevas desde el día de vigencia",
        "60 días para actualizar cuentas de alto riesgo existentes (empresas, PEPs, negocios internacionales)",
        "12 meses para actualización total de cartera de clientes",
        "Integración obligatoria con Registro Civil y TSE",
        "Verificación biométrica requerida en transacciones >₡5,000,000"
      ],
      units: ["Cumplimiento", "TI", "Operaciones", "Experiencia del Cliente", "Seguridad"],
      riskScore: 92
    },
    {
      law: lawsData[2],
      title: "Urgente: Nueva Normativa de Protección de Datos Financieros - Consentimiento Explícito",
      summary: "Reforma integral a la Ley 9416 que establece requisitos estrictos de consentimiento explícito para el procesamiento de datos financieros. Se prohíbe el uso de consentimientos implícitos o por términos y condiciones generales. Cada uso específico de datos (análisis crediticio, marketing, venta cruzada, perfilamiento) requiere consentimiento separado y revocable. Las entidades deben obtener nuevo consentimiento de clientes actuales en 45 días o cesar el procesamiento de datos. Multas de hasta 4% de ingresos anuales por violaciones.",
      bullets: [
        "Prohibición de consentimientos implícitos - cada uso requiere autorización explícita",
        "45 días para re-consentimiento de toda la base de clientes actual",
        "Consentimientos separados: crédito, marketing, scoring, venta cruzada, análisis de riesgo",
        "Portal de gestión de consentimientos obligatorio para clientes",
        "Multas hasta 4% de ingresos anuales globales por incumplimiento"
      ],
      units: ["Legal", "Cumplimiento", "TI", "Marketing", "Riesgos", "Experiencia del Cliente"],
      riskScore: 90
    },
    {
      law: lawsData[3],
      title: "Reforma BCCR: Nuevos Requerimientos de Liquidez y Reservas Mínimas",
      summary: "El Banco Central modifica los coeficientes de liquidez obligatorios incrementando el Coeficiente de Cobertura de Liquidez (LCR) del 90% al 110% para entidades sistémicamente importantes. Adicionalmente, se establece un nuevo Coeficiente de Fondeo Estable Neto (NSFR) mínimo del 100% y reservas adicionales del 2% para exposiciones en moneda extranjera. Las entidades deben alcanzar cumplimiento total en 30 días, con reportes semanales de posición de liquidez al BCCR.",
      bullets: [
        "LCR aumenta de 90% a 110% - impacto inmediato en gestión de tesorería",
        "NSFR mínimo del 100% - reestructuración de portafolio de inversiones requerida",
        "Reserva adicional 2% en operaciones moneda extranjera",
        "30 días para cumplimiento total - posibles restricciones de crédito",
        "Reportes semanales obligatorios de posición de liquidez"
      ],
      units: ["Tesorería", "Finanzas", "Riesgos", "ALM", "Cumplimiento Regulatorio"],
      riskScore: 93
    },
    {
      law: lawsData[5],
      title: "SUGEVAL: Protocolo de Ciberseguridad para Operaciones con Valores",
      summary: "Nueva normativa que establece estándares obligatorios de ciberseguridad para todas las entidades que operan valores y gestión de inversiones. Incluye certificación ISO 27001 obligatoria, pruebas de penetración trimestrales, segmentación de redes, autenticación multifactor para todos los accesos, y encriptación end-to-end en comunicaciones con clientes. Las entidades deben presentar plan de cumplimiento en 15 días e implementación completa en 45 días. Suspensión de operaciones por incumplimiento.",
      bullets: [
        "Certificación ISO 27001 obligatoria - proceso de 6-9 meses debe iniciar inmediatamente",
        "15 días para plan de cumplimiento detallado a SUGEVAL",
        "45 días para implementación completa de controles técnicos",
        "Pruebas de penetración trimestrales por terceros certificados",
        "Suspensión de licencia operativa por incumplimiento"
      ],
      units: ["TI", "Seguridad de la Información", "Casa de Valores", "Cumplimiento", "Legal"],
      riskScore: 88
    },
    {
      law: lawsData[1],
      title: "Actualización ICD: Lista de Personas Políticamente Expuestas (PEPs) Ampliada",
      summary: "Se amplía significativamente la definición de PEP incluyendo funcionarios de tercer nivel de gobierno, alcaldes municipales, directores de empresas públicas, miembros de juntas directivas de instituciones autónomas, y sus familiares hasta segundo grado de consanguinidad. Las entidades deben reclasificar su base de clientes en 30 días, aplicar debida diligencia reforzada retroactiva, y establecer monitoreo continuo. Incluye obligación de reporte trimestral de todas las operaciones de PEPs al ICD.",
      bullets: [
        "Ampliación a funcionarios nivel 3, alcaldes, directores empresas públicas",
        "Familiares hasta 2do grado de consanguinidad incluidos",
        "30 días para reclasificación completa de base de clientes",
        "Debida diligencia reforzada retroactiva para PEPs identificados",
        "Reportes trimestrales obligatorios de transacciones PEPs al ICD"
      ],
      units: ["Cumplimiento", "Prevención Lavado", "Operaciones", "Crédito", "TI"],
      riskScore: 87
    },
    {
      law: lawsData[6],
      title: "Ley Consumidor Financiero: Transparencia en Tasas de Interés y Comisiones",
      summary: "Nueva regulación que obliga a la divulgación clara y destacada de la Tasa Anual Equivalente (TAE) real en todos los productos financieros, incluyendo costos ocultos, seguros obligatorios, y comisiones. Se establece un formato estandarizado de divulgación pre-contractual con simuladores de pago obligatorios. Las entidades deben actualizar todos sus contratos, materiales de marketing, y plataformas digitales en 20 días. Incluye derecho de retracto de 10 días en todos los productos financieros.",
      bullets: [
        "TAE real obligatoria incluyendo TODOS los costos (seguros, comisiones, cargos)",
        "20 días para actualización de contratos, materiales y plataformas digitales",
        "Simuladores de pago obligatorios en todos los canales de venta",
        "Derecho de retracto 10 días - impacto en procesos de originación",
        "Sanciones y posibles demandas colectivas por incumplimiento"
      ],
      units: ["Legal", "Productos", "Cumplimiento", "Marketing", "TI", "Operaciones"],
      riskScore: 85
    },
    {
      law: lawsData[4],
      title: "SUGEF: Provisiones Adicionales para Créditos en Sectores de Alto Riesgo Post-Pandemia",
      summary: "La SUGEF establece provisiones adicionales del 15% para carteras de crédito en sectores identificados como de alto riesgo: turismo, aviación, entretenimiento, y comercio minorista tradicional. Adicionalmente, se incrementan provisiones genéricas del 1% al 2% para cartera total. Se requiere análisis individual de exposiciones superiores a ₡100 millones en estos sectores con planes de recuperación detallados. Impacto estimado en suficiencia de capital y restricción de nuevo crédito a estos sectores.",
      bullets: [
        "Provisiones adicionales 15% en turismo, aviación, entretenimiento, retail",
        "Provisión genérica aumenta de 1% a 2% para cartera total",
        "Análisis individual de créditos >₡100M en sectores afectados",
        "30 días para cálculo y constitución de provisiones - impacto en resultados",
        "Restricciones de crédito nuevo en sectores de alto riesgo"
      ],
      units: ["Riesgos", "Crédito", "Finanzas", "Negocios", "Cumplimiento Regulatorio"],
      riskScore: 89
    },
    {
      law: lawsData[7],
      title: "Banca Desarrollo: Incremento de Cuota Obligatoria y Nuevos Sectores Prioritarios",
      summary: "Se incrementa la contribución obligatoria al Sistema de Banca para el Desarrollo del 5% al 7% de la cartera de crédito total. Se añaden sectores prioritarios: tecnología verde, innovación digital, y emprendimientos liderados por mujeres. Las entidades deben alcanzar el nuevo porcentaje en 45 días y reasignar al menos 30% de su portafolio SBD a los nuevos sectores en 6 meses. Incluye requisitos de reporte trimestral detallado de impacto social y ambiental de los créditos otorgados.",
      bullets: [
        "Contribución aumenta del 5% al 7% de cartera total de crédito",
        "45 días para alcanzar nuevo nivel - impacto en rentabilidad y liquidez",
        "30% a nuevos sectores: tech verde, innovación digital, mujeres empresarias",
        "6 meses para reasignación de portafolio SBD",
        "Reportes trimestrales de impacto social/ambiental requeridos"
      ],
      units: ["Banca Desarrollo", "Crédito", "Finanzas", "Sostenibilidad", "Cumplimiento"],
      riskScore: 84
    },
    {
      law: lawsData[8],
      title: "CONASSIF: Open Banking - Compartición Obligatoria de Datos Financieros",
      summary: "Regulación de Open Banking que obliga a todas las entidades financieras a compartir datos de clientes mediante APIs estandarizadas con terceros autorizados, previa autorización del cliente. Se establecen 4 fases de implementación: (1) datos de productos en 30 días, (2) datos de cuentas en 90 días, (3) iniciación de pagos en 180 días, y (4) datos de crédito en 12 meses. Las entidades deben desarrollar infraestructura técnica, políticas de seguridad, y obtener certificación de APIs. Representa transformación fundamental del modelo de negocio bancario.",
      bullets: [
        "30 días: APIs de productos disponibles (cuentas, tarjetas, préstamos)",
        "90 días: compartición de datos de cuentas y transacciones",
        "180 días: iniciación de pagos por terceros - impacto en comisiones",
        "Inversión significativa en infraestructura técnica y seguridad",
        "Riesgo competitivo: entrada facilitada de fintechs y competidores digitales"
      ],
      units: ["TI", "Estrategia Digital", "Productos", "Legal", "Seguridad", "Cumplimiento"],
      riskScore: 91
    }
  ];

  criticalTopics.forEach((topic, i) => {
    const rigeDate = futureDate(5 + i * 3);
    alerts.push({
      title: topic.title,
      law_number: `Ley ${topic.law.number}`,
      detail_link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      gaceta_link: `https://www.imprentanacional.go.cr/gaceta/`,
      bill_project_link: (topic.law as any).billProjectLink,
      title_id: `LEY-${topic.law.number}-${id}`,
      publication_date: pastDate(Math.floor(Math.random() * 15)),
      effective_date: rigeDate,
      version: `Versión ${i + 1}`,
      norm_type: topic.law.type,
      link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      issuing_entity: topic.law.ministry,
      scraped_at: new Date().toISOString(),
      source: "SINALEVI",
      search_source: "sinalevi_monitoring",
      csv_in_force: "Sí",
      ministry: topic.law.ministry,
      affected_norms: [
        `Ley ${parseInt(topic.law.number) - 100} - Ley anterior que modifica`,
        `Decreto Ejecutivo ${id - 200} - Reglamentación complementaria`
      ],
      modifying_norms: [
        `Ley ${parseInt(topic.law.number) + 200} - Reforma posterior`,
        `Ley ${parseInt(topic.law.number) + 150} - Ley modificatoria`
      ],
      concordances: [
        `Ley ${parseInt(topic.law.number) + 50} - Normativa relacionada`,
        `Reglamento ${id + 100} - Disposiciones complementarias`,
        `Circular SUGEF ${id}-2024 - Lineamientos técnicos`
      ],
      regulations: [
        `Decreto Ejecutivo ${id}-BCCR`,
        `Reglamento ${id + 50}`
      ],
      transitory_articles: `Artículo Transitorio I: Las entidades financieras dispondrán de un plazo de ${5 + i * 3} días naturales, contados a partir de la publicación de esta reforma, para cumplir con las nuevas obligaciones establecidas.\n\nArtículo Transitorio II: Los sistemas tecnológicos y de información deberán estar actualizados en un plazo máximo de ${30 + i * 15} días naturales.\n\nArtículo Transitorio III: La capacitación del personal responsable deberá completarse dentro de los primeros ${15 + i * 5} días naturales de vigencia de esta normativa.`,
      text: `LA ASAMBLEA LEGISLATIVA DE LA REPÚBLICA DE COSTA RICA\nDECRETA:\n\n${topic.law.name.toUpperCase()}\n\nCAPÍTULO I\nDISPOSICIONES GENERALES\n\nArtículo 1º—Objeto. La presente ley tiene por objeto establecer los mecanismos de control y supervisión necesarios para garantizar el cumplimiento de las obligaciones en materia de ${topic.law.ministry.toLowerCase()}.\n\nArtículo 2º—Ámbito de aplicación. Esta ley será de aplicación obligatoria para todas las entidades financieras supervisadas, incluyendo bancos comerciales públicos y privados, cooperativas de ahorro y crédito, mutuales de ahorro y préstamo, y demás entidades autorizadas para realizar intermediación financiera.\n\nArtículo 3º—Definiciones. Para los efectos de esta ley, se entenderá por:\n\na) Entidad financiera: Toda persona jurídica autorizada para realizar actividades de intermediación financiera bajo la supervisión de la Superintendencia General de Entidades Financieras (SUGEF).\n\nb) Cliente: Toda persona física o jurídica que mantiene una relación comercial con una entidad financiera.\n\nc) Operación sospechosa: Aquella transacción que, por sus características, no concuerda con el perfil económico del cliente o presenta inconsistencias con el origen lícito de los fondos.\n\nCAPÍTULO II\nOBLIGACIONES DE LAS ENTIDADES FINANCIERAS\n\nArtículo 4º—Debida diligencia. Las entidades financieras deberán implementar medidas reforzadas de debida diligencia del cliente, que incluyan:\n\na) Verificación de identidad mediante documentos oficiales y sistemas biométricos cuando corresponda.\n\nb) Determinación del origen de los fondos y la actividad económica del cliente.\n\nc) Monitoreo continuo de las transacciones y actualización periódica de la información del cliente.\n\nArtículo 5º—Sistemas de información. Las entidades deberán contar con sistemas tecnológicos que permitan la detección automática de operaciones inusuales o sospechosas, con capacidad de generar alertas en tiempo real.\n\nArtículo 6º—Capacitación. Todo el personal que tenga contacto con clientes o acceso a información financiera deberá recibir capacitación especializada en prevención de lavado de activos y financiamiento del terrorismo, con una frecuencia mínima semestral.\n\nArtículo 7º—Reporte de operaciones. Las entidades financieras deberán reportar al Instituto Costarricense sobre Drogas (ICD) todas las operaciones sospechosas dentro de las 24 horas siguientes a su detección.\n\nCAPÍTULO III\nSUPERVISIÓN Y CONTROL\n\nArtículo 8º—Facultades de supervisión. La SUGEF tendrá amplias facultades para supervisar el cumplimiento de las obligaciones establecidas en esta ley, incluyendo la realización de inspecciones in situ y la solicitud de información.\n\nArtículo 9º—Intercambio de información. Las autoridades supervisoras podrán intercambiar información con entidades internacionales en el marco de convenios de cooperación, respetando siempre el secreto bancario y la protección de datos personales.\n\nCAPÍTULO IV\nSANCIONES\n\nArtículo 10—Infracciones graves. Se considerarán infracciones graves:\n\na) El incumplimiento de las obligaciones de debida diligencia establecidas en el artículo 4º.\n\nb) La falta de implementación de sistemas adecuados de detección conforme al artículo 5º.\n\nc) El retraso en el reporte de operaciones sospechosas más allá del plazo establecido.\n\nArtículo 11—Multas. Las infracciones graves serán sancionadas con multas de hasta el 2% de los ingresos brutos anuales de la entidad, sin que la sanción pueda ser inferior a quinientos millones de colones.\n\nArtículo 12—Suspensión de operaciones. En casos de incumplimiento reiterado o cuando se detecten deficiencias graves que pongan en riesgo el sistema financiero, la SUGEF podrá ordenar la suspensión temporal de operaciones específicas.\n\nCAPÍTULO V\nDISPOSICIONES TRANSITORIAS\n\nArtículo Transitorio I—Plazo de implementación. Las entidades financieras dispondrán de un plazo de ${5 + i * 3} días naturales, contados a partir de la publicación de esta reforma, para cumplir con las nuevas obligaciones establecidas.\n\nArtículo Transitorio II—Actualización tecnológica. Los sistemas tecnológicos y de información deberán estar actualizados y en pleno funcionamiento en un plazo máximo de ${30 + i * 15} días naturales contados desde la entrada en vigencia de esta ley.\n\nArtículo Transitorio III—Capacitación del personal. La capacitación del personal responsable de la aplicación de esta normativa deberá completarse dentro de los primeros ${15 + i * 5} días naturales de vigencia.\n\nArtículo Transitorio IV—Clientes existentes. Las entidades financieras deberán actualizar la información de sus clientes actuales conforme a los nuevos requisitos en un plazo que no excederá de doce meses, priorizando los clientes de mayor riesgo.\n\nCAPÍTULO VI\nDISPOSICIONES FINALES\n\nArtículo 13—Vigencia. Esta ley rige a partir de su publicación en el Diario Oficial La Gaceta.\n\nArtículo 14—Derogatorias. Se derogan todas las disposiciones que se opongan a la presente ley.\n\nRige a partir de su publicación.\n\nDado en la Presidencia de la República, San José, a los ${Math.floor(Math.random() * 28) + 1} días del mes de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][Math.floor(Math.random() * 12)]} de dos mil veinticinco.`,
      is_relevant: true,
      ministry_matches: [
        { portfolio: topic.law.ministry, pattern: "bancario" }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: topic.riskScore,
        confidence: 0.92 + Math.random() * 0.05,
        reasons: ["Impacto crítico en operaciones bancarias", "Plazo urgente de implementación", "Sanciones significativas por incumplimiento"],
        is_relevant_for_client: true,
        client_relevance_level: "high",
        client_relevance_reasons: ["Cumplimiento regulatorio obligatorio para sector bancario", "Impacto operativo inmediato"],
        affected_units: topic.units,
        portfolio_priority: "high",
        legal_stage: "enacted",
        change_type: ["cumplimiento", "operacional", "tecnológico"],
        summary: topic.summary,
        alert_title: `URGENTE: ${topic.title}`,
        alert_bullets: topic.bullets,
        risk_level: "high",
        risk_score_hint: topic.riskScore,
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo",
      pgr_pronouncements: mockPGRPronouncements[topic.law.number]
    });
    id++;
  });

  // High Impact, Low Urgency (10 alerts) - Planificación estratégica bancaria
  const strategicTopics = [
    {
      law: lawsData[3],
      title: "Reforma BCCR 2026: Requisitos de Capital Basilea IV - Transición a Nuevos Estándares",
      summary: "El Banco Central anuncia la adopción completa de estándares Basilea IV para 2026, incrementando los requisitos de capital de nivel 1 del 10.5% al 13% para bancos sistémicamente importantes. Se introducen nuevos cargos por riesgo operacional, riesgo de crédito de contraparte, y exposiciones fuera de balance. Las entidades deben presentar plan de capitalización en 6 meses y alcanzar cumplimiento gradual: 11% en 2025, 12% a mediados de 2025, y 13% en enero 2026. Impacto significativo en dividendos, crecimiento de cartera, y necesidades de capital adicional.",
      bullets: [
        "Capital Nivel 1 aumenta de 10.5% a 13% - brecha promedio de 2.5 puntos",
        "Implementación gradual: 11% (2025), 12% (mid-2025), 13% (2026)",
        "Nuevos cargos: riesgo operacional, CVA, exposiciones fuera de balance",
        "Plan de capitalización debido en 6 meses - opciones: utilidades retenidas, emisión de capital",
        "Restricción de dividendos probable durante período de transición"
      ],
      units: ["Finanzas", "Riesgos", "Estrategia", "ALM", "Relaciones Inversionistas"],
      riskScore: 86
    },
    {
      law: lawsData[2],
      title: "Protección Datos 2026: Derecho al Olvido y Portabilidad de Datos Financieros",
      summary: "Reforma que introduce el derecho al olvido para datos financieros históricos (más de 7 años de antigüedad) y portabilidad completa de datos de clientes a otras entidades. Los clientes podrán solicitar eliminación de datos antiguos excepto aquellos requeridos por normativa de prevención de lavado. La portabilidad incluye historial de transacciones, scoring crediticio, y preferencias del cliente en formato estandarizado. Las entidades tienen hasta enero 2026 para desarrollar sistemas de gestión de solicitudes, con procesamiento obligatorio en máximo 15 días.",
      bullets: [
        "Derecho al olvido para datos >7 años excepto AML",
        "Portabilidad completa: transacciones, scoring, preferencias",
        "Enero 2026 para sistemas de gestión de solicitudes",
        "15 días máximo para procesar solicitudes de clientes",
        "Impacto en modelos de scoring y análisis de comportamiento histórico"
      ],
      units: ["TI", "Legal", "Cumplimiento", "Riesgos de Crédito", "Experiencia del Cliente"],
      riskScore: 78
    }
  ];

  strategicTopics.forEach((topic, i) => {
    const rigeDate = futureDate(400 + i * 30);
    for (let j = 0; j < 5; j++) {
      const law = lawsData[(i + j) % lawsData.length];
      alerts.push({
        title: j === 0 ? topic.title : `${law.name} - Reforma Estructural 2026`,
        law_number: `Ley ${law.number}`,
        detail_link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
        gaceta_link: `https://www.imprentanacional.go.cr/gaceta/`,
        bill_project_link: (law as any).billProjectLink,
        title_id: `LEY-${law.number}-${id}`,
        publication_date: pastDate(Math.floor(Math.random() * 60)),
        effective_date: rigeDate,
        version: `Versión ${i + 2}`,
        norm_type: law.type,
        link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
        issuing_entity: law.ministry,
        scraped_at: new Date().toISOString(),
        source: "SINALEVI",
        search_source: "sinalevi_monitoring",
        csv_in_force: "No",
        ministry: law.ministry,
        affected_norms: [
          `Ley ${parseInt(law.number) - 50} - Normativa anterior afectada`,
          `Ley ${parseInt(law.number) + 200} - Disposiciones complementarias`
        ],
        modifying_norms: [
          `Ley ${parseInt(law.number) + 300} - Reforma futura`,
          `Decreto ${id + 1000} - Modificación ejecutiva`
        ],
        concordances: [
          `Ley ${parseInt(law.number) + 100} - Concordancia principal`,
          `Decreto ${id + 500} - Disposición relacionada`
        ],
        regulations: [
          `Reglamento ${id}-BCCR`
        ],
        transitory_articles: `Artículo Transitorio I: Las entidades financieras contarán con un plazo de ${400 + i * 30} días naturales para implementar las disposiciones establecidas en esta normativa.\n\nArtículo Transitorio II: Durante el período de transición, las entidades deberán presentar informes trimestrales de avance al regulador.\n\nArtículo Transitorio III: La capacitación del personal deberá iniciarse dentro de los primeros 90 días de publicada esta norma.`,
        is_relevant: true,
        ministry_matches: [
          { portfolio: law.ministry, pattern: "bancario" }
        ],
        AI_triage: {
          processed: true,
          skipped: null,
          decision: "RELEVANT",
          score: j === 0 ? topic.riskScore : 75 + Math.floor(Math.random() * 8),
          confidence: 0.85 + Math.random() * 0.08,
          reasons: ["Planificación estratégica requerida", "Impacto operativo significativo a largo plazo"],
          is_relevant_for_client: true,
          client_relevance_level: "high",
          client_relevance_reasons: ["Transformación operativa necesaria", "Inversión significativa en sistemas y procesos"],
          affected_units: j === 0 ? topic.units : ["Estrategia", "Operaciones", "Finanzas"],
          portfolio_priority: "high",
          legal_stage: "proposal",
          change_type: ["estratégico", "planificación"],
          summary: j === 0 ? topic.summary : `Reforma estructural a la ${law.name} con entrada en vigencia en 2026. Establece nuevos estándares operativos y de gobernanza para el sector financiero con período extendido de implementación que permite planificación estratégica adecuada.`,
          alert_title: `Planificación 2026: ${j === 0 ? topic.title : law.name}`,
          alert_bullets: j === 0 ? topic.bullets : [
            `Entrada en vigencia: ${rigeDate}`,
            "Tiempo suficiente para planificación e implementación",
            "Coordinación inter-departamental requerida",
            "Inversión en sistemas y capacitación necesaria"
          ],
          risk_level: "high",
          risk_score_hint: j === 0 ? topic.riskScore : 75 + Math.floor(Math.random() * 8),
          deadline_detected: rigeDate,
          recommended_action: "ALERT_NOW"
        },
        monitoring_use: "costa_rica_demo"
      });
      id++;
    }
  });

  // Low/Medium Impact, High Urgency (10 alerts) - Cambios administrativos
  const adminTopics = [
    "Actualización de formatos de reporte financiero a SUGEF",
    "Nuevos formularios de solicitud de crédito hipotecario",
    "Modificación de plazos de respuesta a consultas de clientes",
    "Actualización de políticas de archivo de documentación",
    "Cambios en procedimientos de cierre de cuentas inactivas",
    "Nuevos requisitos de divulgación en estados de cuenta",
    "Modificación de horarios de atención en sucursales",
    "Actualización de procedimientos de reclamos de clientes",
    "Cambios en formato de contratos de tarjetas de crédito",
    "Nuevos estándares de señalización de seguridad en sucursales"
  ];

  adminTopics.forEach((topic, i) => {
    const law = lawsData[i % lawsData.length];
    const rigeDate = futureDate(10 + i * 2);
    
    alerts.push({
      title: `${topic} - Reglamento ${law.name}`,
      law_number: `Decreto Ejecutivo ${id}`,
      detail_link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      gaceta_link: `https://www.imprentanacional.go.cr/gaceta/`,
      title_id: `DE-${id}`,
      publication_date: pastDate(Math.floor(Math.random() * 10)),
      effective_date: rigeDate,
      version: "Versión 1",
      norm_type: "Decreto Ejecutivo",
      link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      issuing_entity: law.ministry,
      scraped_at: new Date().toISOString(),
      source: "SINALEVI",
      search_source: "sinalevi_monitoring",
      csv_in_force: "Sí",
      ministry: law.ministry,
      affected_norms: [`Ley ${law.number} - Normativa principal`],
      modifying_norms: [
        `Decreto ${id - 50} - Modificación previa`
      ],
      concordances: [
        `Ley ${parseInt(law.number) - 10} - Normativa relacionada`,
        `Decreto ${id - 100} - Disposición complementaria`
      ],
      regulations: [],
      transitory_articles: `Artículo Transitorio Único: Las entidades reguladas dispondrán de un plazo de ${10 + i * 2} días naturales para implementar los cambios administrativos y procedimentales establecidos en este decreto.`,
      is_relevant: true,
      ministry_matches: [
        { portfolio: law.ministry, pattern: "bancario" }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 55 + Math.floor(Math.random() * 15),
        confidence: 0.75 + Math.random() * 0.1,
        reasons: ["Actualización administrativa requerida", "Plazo de implementación corto"],
        is_relevant_for_client: true,
        client_relevance_level: "medium",
        client_relevance_reasons: ["Ajuste procedimental", "Actualizaciones de documentación"],
        affected_units: ["Operaciones", "Cumplimiento", "Experiencia del Cliente"],
        portfolio_priority: "medium",
        legal_stage: "enacted",
        change_type: ["administrativo", "procedimental"],
        summary: `Se establece ${topic.toLowerCase()} según reforma al reglamento de la ${law.name}. Los cambios son principalmente administrativos y requieren actualización de procedimientos internos, documentación y capacitación del personal. Impacto operativo limitado pero cumplimiento obligatorio.`,
        alert_title: `Acción Requerida: ${topic}`,
        alert_bullets: [
          `Actualización de procedimientos y documentación requerida`,
          `Plazo de implementación: ${rigeDate}`,
          `Capacitación de personal necesaria`,
          `Impacto operativo limitado`
        ],
        risk_level: i % 2 === 0 ? "medium" : "low",
        risk_score_hint: 50 + Math.floor(Math.random() * 20),
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  });

  // Pronunciamientos PGR are not shown as separate alerts in Acts feed
  // They only appear within laws as pgr_pronouncements array

  // Reglamentos (Decretos Ejecutivos del Poder Ejecutivo)
  const regulationAlerts = [
    {
      regulation: regulationsData[0],
      title: "Creación de Comisión Nacional para Prevención de Legitimación de Capitales del Narcotráfico",
      summary: "El Poder Ejecutivo establece mediante Decreto Ejecutivo 27548 la creación de una Comisión Nacional especializada en el estudio y formulación de políticas preventivas contra la legitimación de capitales provenientes del narcotráfico. Esta comisión estará integrada por representantes del ICD, BCCR, SUGEF y Ministerio de Justicia, con el mandato de diseñar estrategias integrales de prevención, establecer protocolos de cooperación interinstitucional y recomendar reformas normativas. La comisión deberá presentar su primer informe de recomendaciones en un plazo de 90 días desde su constitución formal.",
      bullets: [
        "Comisión interinstitucional: ICD, BCCR, SUGEF, Ministerio de Justicia",
        "Mandato: diseño de políticas preventivas contra legitimación de capitales",
        "Primer informe de recomendaciones en 90 días desde constitución",
        "Cooperación obligatoria de entidades financieras en suministro de información",
        "Base para futura normativa de prevención de lavado de activos"
      ],
      units: ["Prevención de Lavado", "Cumplimiento", "Legal", "Relaciones Institucionales"],
      riskScore: 68,
      publicationDate: "28/12/1998",
      effectiveDate: "28/12/1998",
      gacetaNumber: "251",
      gacetaDate: "28/12/1998",
      alcance: "96A"
    },
    {
      regulation: regulationsData[1],
      title: "Reglamento de Control de Operaciones Sospechosas en el Sistema Financiero",
      summary: "Decreto Ejecutivo 38233 que establece el marco reglamentario para la identificación, monitoreo y reporte de operaciones sospechosas en el sistema financiero costarricense. Define criterios técnicos para la clasificación de operaciones, umbrales de reporte, plazos de notificación al ICD, y procedimientos de análisis interno. Las entidades financieras deben implementar sistemas automatizados de detección de patrones inusuales, designar un oficial de cumplimiento certificado, y mantener registros detallados de todas las transacciones analizadas por un período mínimo de 10 años.",
      bullets: [
        "Criterios técnicos obligatorios para clasificación de operaciones sospechosas",
        "Sistemas automatizados de detección requeridos en 120 días",
        "Oficial de cumplimiento certificado obligatorio por entidad",
        "Reporte al ICD dentro de 24 horas de detección de operación sospechosa",
        "Conservación de registros por 10 años mínimo"
      ],
      units: ["Prevención de Lavado", "Cumplimiento", "TI", "Operaciones", "Riesgos"],
      riskScore: 82,
      publicationDate: "15/03/2014",
      effectiveDate: "01/05/2014",
      gacetaNumber: "52",
      gacetaDate: "15/03/2014",
      alcance: "45B"
    },
    {
      regulation: regulationsData[2],
      title: "Reglamento de Protección de Datos Personales en Entidades Financieras",
      summary: "El Decreto Ejecutivo 41710 reglamenta la aplicación de la Ley 9416 específicamente para el sector financiero, estableciendo estándares técnicos y organizativos para el tratamiento de datos personales de clientes. Define categorías de datos sensibles financieros, requisitos de seguridad informática (encriptación, control de acceso, auditoría), procedimientos de gestión de consentimientos, y protocolos de notificación de brechas de seguridad. Las entidades deben designar un delegado de protección de datos, realizar evaluaciones de impacto para tratamientos de alto riesgo, e implementar políticas de minimización y retención de datos.",
      bullets: [
        "Delegado de protección de datos obligatorio en cada entidad financiera",
        "Evaluaciones de impacto de privacidad para tratamientos de alto riesgo",
        "Encriptación AES-256 mínimo para datos personales sensibles",
        "Notificación de brechas a PRODHAB y clientes en 72 horas",
        "Auditorías anuales de cumplimiento por terceros independientes"
      ],
      units: ["Legal", "Cumplimiento", "TI", "Seguridad de la Información", "Riesgos"],
      riskScore: 79,
      publicationDate: "22/11/2019",
      effectiveDate: "01/02/2020",
      gacetaNumber: "224",
      gacetaDate: "22/11/2019",
      alcance: "138A"
    },
    {
      regulation: regulationsData[3],
      title: "Reglamento de Requisitos de Capital y Liquidez bajo Estándares Basilea III",
      summary: "Decreto Ejecutivo 39913 que implementa los estándares internacionales de Basilea III en Costa Rica, estableciendo requisitos reforzados de suficiencia de capital y liquidez para entidades financieras. Define el cálculo del Capital de Nivel 1 Común (CET1) mínimo del 4.5%, Capital de Nivel 1 del 6%, y capital total del 8%, más colchones de conservación y contracíclicos. Introduce los ratios de Cobertura de Liquidez (LCR) y Financiamiento Estable Neto (NSFR), con implementación gradual en un período de transición de 4 años. Incluye tratamiento específico para bancos sistémicamente importantes con recargos adicionales.",
      bullets: [
        "CET1 mínimo 4.5%, Nivel 1 6%, Capital Total 8% más colchones",
        "LCR mínimo 100% - activos líquidos de alta calidad obligatorios",
        "NSFR mínimo 100% - fondeo estable para activos y operaciones",
        "Implementación gradual en 4 años con hitos semestrales",
        "Recargo adicional 1-2.5% para bancos sistémicamente importantes"
      ],
      units: ["Finanzas", "Riesgos", "Tesorería", "ALM", "Cumplimiento Regulatorio"],
      riskScore: 88,
      publicationDate: "08/07/2016",
      effectiveDate: "01/01/2017",
      gacetaNumber: "133",
      gacetaDate: "08/07/2016",
      alcance: "89C"
    },
    {
      regulation: regulationsData[4],
      title: "Reglamento de Debida Diligencia del Cliente en el Sector Financiero",
      summary: "El Decreto Ejecutivo 42670 establece procedimientos estandarizados y reforzados de debida diligencia del cliente (KYC) para todas las entidades del sistema financiero nacional. Define tres niveles de debida diligencia (simplificada, estándar y reforzada) según el perfil de riesgo del cliente, con criterios específicos para PEPs, empresas offshore, clientes de alto patrimonio y operaciones internacionales. Requiere verificación de identidad mediante fuentes independientes, determinación de beneficiarios finales en estructuras corporativas, establecimiento del propósito y naturaleza de la relación comercial, y monitoreo continuo de transacciones. Las entidades deben actualizar la información de clientes de alto riesgo cada 6 meses y de clientes estándar anualmente.",
      bullets: [
        "Tres niveles de debida diligencia según perfil de riesgo del cliente",
        "Identificación de beneficiarios finales obligatoria en estructuras corporativas",
        "Verificación mediante fuentes independientes y documentos oficiales",
        "Actualización semestral para clientes de alto riesgo, anual para estándar",
        "Monitoreo continuo automatizado de transacciones y comportamiento"
      ],
      units: ["Cumplimiento", "Prevención de Lavado", "Operaciones", "TI", "Experiencia del Cliente"],
      riskScore: 75,
      publicationDate: "19/04/2021",
      effectiveDate: "01/07/2021",
      gacetaNumber: "75",
      gacetaDate: "19/04/2021",
      alcance: "52D"
    }
  ];

  regulationAlerts.forEach((topic, i) => {
    const regId = parseInt(topic.regulation.number);
    
    // Calculate transitory articles based on index
    const transitoryArticles = i === 0 
      ? `Artículo Transitorio I: La Comisión Nacional deberá constituirse formalmente dentro de los 30 días naturales siguientes a la publicación de este decreto en el Diario Oficial La Gaceta.\n\nArtículo Transitorio II: La Comisión elaborará su reglamento interno de funcionamiento en un plazo de 45 días naturales desde su constitución formal.\n\nArtículo Transitorio III: El primer informe de recomendaciones de políticas preventivas deberá presentarse al Poder Ejecutivo dentro de los 90 días naturales siguientes a la constitución de la Comisión.`
      : i === 1
      ? `Artículo Transitorio I: Las entidades financieras dispondrán de un plazo de 120 días naturales para implementar los sistemas automatizados de detección de operaciones sospechosas.\n\nArtículo Transitorio II: La designación del Oficial de Cumplimiento certificado deberá realizarse dentro de los 60 días naturales siguientes a la vigencia de este reglamento.\n\nArtículo Transitorio III: Las entidades con sistemas de detección existentes deberán adecuarlos a los nuevos criterios técnicos en un plazo de 90 días naturales.\n\nArtículo Transitorio IV: La capacitación del personal en los nuevos procedimientos deberá completarse dentro de los primeros 45 días de vigencia de este reglamento.`
      : i === 2
      ? `Artículo Transitorio I: Las entidades financieras deberán designar al Delegado de Protección de Datos dentro de los 90 días naturales siguientes a la entrada en vigencia de este reglamento.\n\nArtículo Transitorio II: La implementación de los estándares de encriptación AES-256 deberá completarse en un plazo máximo de 180 días naturales.\n\nArtículo Transitorio III: Las políticas de minimización y retención de datos deberán estar aprobadas e implementadas dentro de los 120 días naturales.\n\nArtículo Transitorio IV: La primera auditoría de cumplimiento deberá realizarse dentro de los 12 meses siguientes a la vigencia de este reglamento.`
      : i === 3
      ? `Artículo Transitorio I: La implementación de los requisitos de capital se realizará de forma gradual durante un período de 4 años, con hitos semestrales de cumplimiento.\n\nArtículo Transitorio II: Para el primer año, las entidades deberán alcanzar un CET1 mínimo del 3%, Capital Nivel 1 del 4.5%, y Capital Total del 6%.\n\nArtículo Transitorio III: El ratio de Cobertura de Liquidez (LCR) deberá alcanzar el 60% en el primer año, incrementándose en 10 puntos porcentuales anuales hasta alcanzar el 100%.\n\nArtículo Transitorio IV: Las entidades deberán presentar planes de capitalización trimestrales a la SUGEF durante el período de transición.`
      : `Artículo Transitorio I: Las entidades financieras dispondrán de un plazo de 90 días naturales para implementar los procedimientos estandarizados de debida diligencia establecidos en este reglamento.\n\nArtículo Transitorio II: La actualización de la información de clientes existentes deberá iniciarse inmediatamente, priorizando clientes de alto riesgo (6 meses) y completando clientes estándar en 18 meses.\n\nArtículo Transitorio III: Los sistemas de monitoreo continuo automatizado deberán estar operativos dentro de los 120 días naturales siguientes a la vigencia de este reglamento.\n\nArtículo Transitorio IV: La capacitación del personal en los nuevos procedimientos de debida diligencia deberá completarse dentro de los primeros 60 días de vigencia.`;
    
    alerts.push({
      title: topic.title,
      law_number: `Decreto Ejecutivo ${topic.regulation.number}`,
      detail_link: `https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_norma.aspx?param1=NRM&nValor1=1&nValor2=${regId}&nValor3=${regId + 1000}&strTipM=FN`,
      gaceta_link: `https://www.imprentanacional.go.cr/gaceta/`,
      title_id: `DE-${topic.regulation.number}-${id}`,
      publication_date: topic.publicationDate,
      effective_date: topic.effectiveDate,
      version: "1",
      norm_type: "Decreto Ejecutivo",
      link: `https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_norma.aspx?param1=NRM&nValor1=1&nValor2=${regId}&nValor3=${regId + 1000}&strTipM=FN`,
      issuing_entity: "Poder Ejecutivo",
      has_pdf: true,
      pdf_files: [
        `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_pdf.aspx?param1=NRM&nValor1=1&nValor2=${regId}&nValor3=${regId + 1000}&strTipM=FN`,
        `https://www.imprentanacional.go.cr/pub/2019/11/22/COMP_22_11_2019.pdf#page=${i + 10}`
      ],
      scraped_at: new Date().toISOString(),
      source: "SINALEVI",
      search_source: "sinalevi_monitoring",
      csv_in_force: "Sí",
      ministry: topic.regulation.ministry,
      affected_norms: [
        `Ley ${topic.regulation.relatedLaw} - Ley que reglamenta`,
        i > 0 ? `Decreto Ejecutivo ${parseInt(regulationsData[i - 1].number)} - Reglamento anterior en materia` : undefined
      ].filter(Boolean),
      modifying_norms: i < regulationAlerts.length - 1 ? [
        `Decreto Ejecutivo ${parseInt(regulationsData[i + 1].number)} - Reforma posterior`,
        `Circular ${topic.regulation.ministry.includes('SUGEF') ? 'SUGEF' : topic.regulation.ministry.includes('SUGEVAL') ? 'SUGEVAL' : 'CONASSIF'}-${regId % 100}-${2024 + i} - Lineamiento complementario`
      ] : [
        `Circular ${topic.regulation.ministry.includes('SUGEF') ? 'SUGEF' : topic.regulation.ministry.includes('SUGEVAL') ? 'SUGEVAL' : 'CONASSIF'}-${regId % 100}-${2024 + i} - Lineamiento complementario`
      ],
      concordances: [
        `Ley ${topic.regulation.relatedLaw} - Ley madre que desarrolla este reglamento`,
        `Decreto Ejecutivo ${regId - 100} - Normativa complementaria`,
        `Acuerdo ${topic.regulation.ministry.includes('SUGEF') ? 'SUGEF' : topic.regulation.ministry.includes('SUGEVAL') ? 'SUGEVAL' : 'CONASSIF'} ${regId % 1000}-2024 - Disposición relacionada`,
        i === 0 ? `Convención Internacional Contra el Narcotráfico (Viena, 1988)` : 
        i === 1 ? `Recomendaciones GAFI (Grupo de Acción Financiera Internacional)` :
        i === 2 ? `RGPD (Reglamento General de Protección de Datos UE)` :
        i === 3 ? `Marco de Basilea III - Comité de Supervisión Bancaria de Basilea` :
        `Recomendaciones GAFI sobre Debida Diligencia del Cliente`
      ],
      regulations: i < regulationAlerts.length - 1 ? [
        `Circular ${topic.regulation.ministry.includes('SUGEF') ? 'SUGEF' : 'CONASSIF'}-${(regId % 100) + 10}-${2023 + i} - Lineamientos operativos`
      ] : [],
      transitory_articles: i === 0 
        ? `Artículo Transitorio I: La Comisión Nacional deberá constituirse formalmente dentro de los 30 días naturales siguientes a la publicación de este decreto en el Diario Oficial La Gaceta.\n\nArtículo Transitorio II: La Comisión elaborará su reglamento interno de funcionamiento en un plazo de 45 días naturales desde su constitución formal.\n\nArtículo Transitorio III: El primer informe de recomendaciones de políticas preventivas deberá presentarse al Poder Ejecutivo dentro de los 90 días naturales siguientes a la constitución de la Comisión.`
        : i === 1
        ? `Artículo Transitorio I: Las entidades financieras dispondrán de un plazo de 120 días naturales para implementar los sistemas automatizados de detección de operaciones sospechosas.\n\nArtículo Transitorio II: La designación del Oficial de Cumplimiento certificado deberá realizarse dentro de los 60 días naturales siguientes a la vigencia de este reglamento.\n\nArtículo Transitorio III: Las entidades con sistemas de detección existentes deberán adecuarlos a los nuevos criterios técnicos en un plazo de 90 días naturales.\n\nArtículo Transitorio IV: La capacitación del personal en los nuevos procedimientos deberá completarse dentro de los primeros 45 días de vigencia de este reglamento.`
        : i === 2
        ? `Artículo Transitorio I: Las entidades financieras deberán designar al Delegado de Protección de Datos dentro de los 90 días naturales siguientes a la entrada en vigencia de este reglamento.\n\nArtículo Transitorio II: La implementación de los estándares de encriptación AES-256 deberá completarse en un plazo máximo de 180 días naturales.\n\nArtículo Transitorio III: Las políticas de minimización y retención de datos deberán estar aprobadas e implementadas dentro de los 120 días naturales.\n\nArtículo Transitorio IV: La primera auditoría de cumplimiento deberá realizarse dentro de los 12 meses siguientes a la vigencia de este reglamento.`
        : i === 3
        ? `Artículo Transitorio I: La implementación de los requisitos de capital se realizará de forma gradual durante un período de 4 años, con hitos semestrales de cumplimiento.\n\nArtículo Transitorio II: Para el primer año, las entidades deberán alcanzar un CET1 mínimo del 3%, Capital Nivel 1 del 4.5%, y Capital Total del 6%.\n\nArtículo Transitorio III: El ratio de Cobertura de Liquidez (LCR) deberá alcanzar el 60% en el primer año, incrementándose en 10 puntos porcentuales anuales hasta alcanzar el 100%.\n\nArtículo Transitorio IV: Las entidades deberán presentar planes de capitalización trimestrales a la SUGEF durante el período de transición.`
        : `Artículo Transitorio I: Las entidades financieras dispondrán de un plazo de 90 días naturales para implementar los procedimientos estandarizados de debida diligencia establecidos en este reglamento.\n\nArtículo Transitorio II: La actualización de la información de clientes existentes deberá iniciarse inmediatamente, priorizando clientes de alto riesgo (6 meses) y completando clientes estándar en 18 meses.\n\nArtículo Transitorio III: Los sistemas de monitoreo continuo automatizado deberán estar operativos dentro de los 120 días naturales siguientes a la vigencia de este reglamento.\n\nArtículo Transitorio IV: La capacitación del personal en los nuevos procedimientos de debida diligencia deberá completarse dentro de los primeros 60 días de vigencia.`,
      text: `EL PRESIDENTE DE LA REPÚBLICA Y EL MINISTRO DE ${topic.regulation.ministry.toUpperCase()}\n\nCon fundamento en los artículos 140, incisos 3) y 18), y 146 de la Constitución Política; artículos 25, 27 y 28, párrafo 2, inciso b) de la Ley General de la Administración Pública, Ley N° 6227 del 2 de mayo de 1978; y los artículos pertinentes de la Ley ${topic.regulation.relatedLaw}.\n\nConsiderando:\n\nI.—Que es necesario ${topic.summary.substring(0, 200)}...\n\nII.—Que el ordenamiento jurídico costarricense requiere normativa complementaria para la efectiva aplicación de la Ley ${topic.regulation.relatedLaw}.\n\nIII.—Que resulta indispensable establecer disposiciones reglamentarias que desarrollen los principios y obligaciones contenidos en la ley, adaptándolos a las particularidades del sector financiero nacional.\n\nIV.—Que la experiencia internacional y las mejores prácticas recomendadas por organismos internacionales especializados fundamentan las disposiciones de este reglamento.\n\nPor tanto,\n\nDECRETAN:\n\n${topic.regulation.name.toUpperCase()}\n\nCAPÍTULO I\nDISPOSICIONES GENERALES\n\nArtículo 1º—Objeto y ámbito de aplicación. El presente reglamento tiene por objeto desarrollar y complementar las disposiciones de la Ley ${topic.regulation.relatedLaw}, estableciendo las normas específicas, procedimientos técnicos y obligaciones concretas para su efectiva aplicación en el sistema financiero nacional.\n\nEste reglamento será de aplicación obligatoria para todas las entidades supervisadas por ${topic.regulation.ministry}, incluyendo bancos comerciales públicos y privados, cooperativas de ahorro y crédito de nivel supervisado, mutuales de ahorro y préstamo, entidades financieras no bancarias autorizadas, y demás instituciones que realizan actividades de intermediación financiera.\n\nArtículo 2º—Definiciones. Para los efectos de este reglamento, se aplicarán las definiciones contenidas en la Ley ${topic.regulation.relatedLaw}, y adicionalmente se entenderá por:\n\n${topic.bullets.slice(0, 3).map((b, idx) => `${String.fromCharCode(97 + idx)}) ${b}`).join('\n\n')}\n\nArtículo 3º—Principios rectores. La aplicación de este reglamento se regirá por los siguientes principios:\n\na) Proporcionalidad: Las medidas y controles se aplicarán de acuerdo con el nivel de riesgo identificado.\n\nb) Efectividad: Los procedimientos establecidos deben ser idóneos para alcanzar los objetivos de prevención y control.\n\nc) Cooperación interinstitucional: Las entidades financieras y autoridades reguladoras colaborarán activamente en el cumplimiento de los objetivos de este reglamento.\n\nd) Confidencialidad: Se respetará el secreto bancario y la protección de datos personales en todos los procedimientos.\n\nCAPÍTULO II\nOBLIGACIONES DE LAS ENTIDADES FINANCIERAS\n\nArtículo 4º—Obligaciones generales. Las entidades financieras deberán:\n\na) Implementar y mantener actualizados sistemas y procedimientos para el cumplimiento de las disposiciones de este reglamento.\n\nb) Designar a un responsable de cumplimiento con suficiente autoridad, independencia y recursos para ejercer sus funciones.\n\nc) Capacitar periódicamente a su personal en las materias reguladas por este reglamento.\n\nd) Mantener registros detallados de todas las actividades relevantes por un período mínimo de 10 años.\n\ne) Reportar a las autoridades competentes conforme a los plazos y procedimientos establecidos.\n\nArtículo 5º—Sistemas de información y control. Las entidades deberán contar con sistemas tecnológicos que permitan:\n\na) La identificación automática de patrones de comportamiento inusuales o sospechosos.\n\nb) La generación de alertas en tiempo real sobre operaciones que requieran análisis adicional.\n\nc) El mantenimiento de registros históricos completos y de fácil consulta.\n\nd) La elaboración de reportes y estadísticas para análisis de tendencias y riesgos.\n\ne) La integración con bases de datos oficiales cuando sea técnicamente posible y legalmente permitido.\n\nArtículo 6º—Debida diligencia. Las entidades aplicarán medidas de debida diligencia que incluyan como mínimo:\n\na) Verificación de identidad mediante documentos oficiales vigentes y fuentes independientes.\n\nb) Obtención de información sobre la actividad económica, origen de fondos y propósito de la relación comercial.\n\nc) Determinación del perfil de riesgo del cliente mediante metodologías documentadas.\n\nd) Monitoreo continuo de las operaciones y actualización periódica de la información.\n\ne) Aplicación de medidas reforzadas para clientes de mayor riesgo.\n\nCAPÍTULO III\nPROCEDIMIENTOS DE SUPERVISIÓN Y CONTROL\n\nArtículo 7º—Facultades de supervisión. ${topic.regulation.ministry} ejercerá amplias facultades de supervisión, incluyendo:\n\na) Inspecciones in situ programadas o sorpresivas.\n\nb) Solicitud de información, documentos y registros.\n\nc) Entrevistas con personal y funcionarios de las entidades.\n\nd) Verificación del funcionamiento de sistemas y procedimientos.\n\ne) Aplicación de medidas correctivas cuando se detecten deficiencias.\n\nArtículo 8º—Reportes regulatorios. Las entidades deberán presentar a ${topic.regulation.ministry}:\n\na) Reportes periódicos con la frecuencia y contenido establecidos en las circulares e instructivos correspondientes.\n\nb) Reportes especiales sobre eventos significativos dentro de los plazos establecidos.\n\nc) Información estadística agregada para análisis sectorial.\n\nd) Reportes de auditoría interna y externa sobre el cumplimiento de este reglamento.\n\nCAPÍTULO IV\nSANCIONES\n\nArtículo 9º—Infracciones. Constituyen infracciones a este reglamento:\n\na) El incumplimiento de las obligaciones establecidas en los artículos 4, 5 y 6.\n\nb) La presentación de información incompleta, inexacta o fuera de plazo.\n\nc) El obstaculizar las labores de supervisión.\n\nd) La implementación deficiente de sistemas y procedimientos.\n\ne) La falta de capacitación adecuada del personal.\n\nArtículo 10—Régimen sancionatorio. Las infracciones se sancionarán conforme al régimen establecido en la Ley ${topic.regulation.relatedLaw} y sus reformas, pudiendo ${topic.regulation.ministry} imponer:\n\na) Amonestaciones escritas.\n\nb) Multas proporcionales a la gravedad de la infracción y el tamaño de la entidad.\n\nc) Suspensión temporal de operaciones específicas.\n\nd) Revocación de autorizaciones en casos graves o reiterados.\n\nCAPÍTULO V\nDISPOSICIONES TRANSITORIAS Y FINALES\n\n${transitoryArticles}\n\nArtículo ${i === 0 ? '11' : i === 1 ? '12' : i === 2 ? '13' : i === 3 ? '14' : '15'}—Normas supletorias. En lo no previsto por este reglamento, se aplicarán supletoriamente las disposiciones de la Ley General de la Administración Pública y demás normativa aplicable.\n\nArtículo ${i === 0 ? '12' : i === 1 ? '13' : i === 2 ? '14' : i === 3 ? '15' : '16'}—Interpretación y aplicación. ${topic.regulation.ministry} emitirá las circulares, lineamientos e instructivos necesarios para la correcta interpretación y aplicación de este reglamento.\n\nArtículo ${i === 0 ? '13' : i === 1 ? '14' : i === 2 ? '15' : i === 3 ? '16' : '17'}—Vigencia. Este reglamento rige a partir del ${topic.effectiveDate}.\n\nArtículo ${i === 0 ? '14' : i === 1 ? '15' : i === 2 ? '16' : i === 3 ? '17' : '18'}—Publicación. Publíquese en el Diario Oficial La Gaceta.\n\nDado en la Presidencia de la República, San José, Costa Rica, a los ${topic.publicationDate.split('/')[0]} días del mes de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][parseInt(topic.publicationDate.split('/')[1]) - 1]} de mil novecientos noventa y ocho.\n\nEjecútese y publíquese.\n\nGaceta N° ${topic.gacetaNumber} del ${topic.gacetaDate}, Alcance ${topic.alcance}.`,
      is_relevant: true,
      ministry_matches: [
        { portfolio: topic.regulation.ministry, pattern: "reglamento" }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: topic.riskScore,
        confidence: 0.88 + Math.random() * 0.08,
        reasons: [
          "Reglamento del Poder Ejecutivo con carácter obligatorio",
          "Complementa y desarrolla disposiciones legales",
          "Establece procedimientos técnicos específicos"
        ],
        is_relevant_for_client: true,
        client_relevance_level: topic.riskScore > 80 ? "high" : "medium",
        client_relevance_reasons: [
          `Reglamentación ejecutiva de la Ley ${topic.regulation.relatedLaw}`,
          "Obligaciones operativas concretas para entidades financieras",
          "Supervisión y sanciones por incumplimiento"
        ],
        affected_units: topic.units,
        portfolio_priority: topic.riskScore > 80 ? "high" : "medium",
        legal_stage: "enacted",
        change_type: ["reglamentario", "operacional", "cumplimiento"],
        summary: topic.summary,
        alert_title: topic.title,
        alert_bullets: topic.bullets,
        risk_level: topic.riskScore > 80 ? "high" : topic.riskScore > 70 ? "medium" : "low",
        risk_score_hint: topic.riskScore,
        deadline_detected: topic.effectiveDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  });

  return alerts;
}
