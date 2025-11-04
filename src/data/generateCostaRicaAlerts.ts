import { Alert } from "@/types/legislation";

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
    type: "Ley" as const
  },
  { 
    number: "8204", 
    name: "Ley sobre Estupefacientes, Sustancias Psicotrópicas, Drogas de Uso No Autorizado, Legitimación de Capitales y Actividades Conexas (Reforma)",
    ministry: "ICD (Instituto Costarricense sobre Drogas)",
    type: "Ley" as const
  },
  { 
    number: "9416", 
    name: "Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales",
    ministry: "Ministerio de Justicia y Paz",
    type: "Ley" as const
  },
  { 
    number: "7558", 
    name: "Ley Orgánica del Banco Central de Costa Rica",
    ministry: "Banco Central de Costa Rica",
    type: "Ley" as const
  },
  { 
    number: "8204", 
    name: "Ley de Prevención de Lavado de Activos y Financiamiento del Terrorismo",
    ministry: "ICD (Instituto Costarricense sobre Drogas)",
    type: "Ley" as const
  },
  { 
    number: "7732", 
    name: "Ley Reguladora del Mercado de Valores",
    ministry: "SUGEVAL (Superintendencia General de Valores)",
    type: "Ley" as const
  },
  { 
    number: "7472", 
    name: "Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor",
    ministry: "Ministerio de Economía, Industria y Comercio",
    type: "Ley" as const
  },
  { 
    number: "8634", 
    name: "Ley del Sistema de Banca para el Desarrollo",
    ministry: "Banco Central de Costa Rica",
    type: "Ley" as const
  },
  { 
    number: "7391", 
    name: "Ley Reguladora de la Actividad de Intermediación Financiera de las Organizaciones Cooperativas",
    ministry: "SUGEF (Superintendencia General de Entidades Financieras)",
    type: "Ley" as const
  },
  { 
    number: "8000", 
    name: "Ley de Protección al Ciudadano del Exceso de Requisitos y Trámites Administrativos",
    ministry: "Ministerio de Hacienda",
    type: "Ley" as const
  },
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
        `Ley ${parseInt(topic.law.number) - 100}`,
        `Decreto Ejecutivo ${id - 200}`
      ],
      concordances: [
        `Ley ${parseInt(topic.law.number) + 50}`,
        `Reglamento ${id + 100}`
      ],
      regulations: [
        `Decreto Ejecutivo ${id}-BCCR`,
        `Reglamento ${id + 50}`
      ],
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
      monitoring_use: "costa_rica_demo"
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
          `Ley ${parseInt(law.number) - 50}`,
          `Ley ${parseInt(law.number) + 200}`
        ],
        concordances: [
          `Ley ${parseInt(law.number) + 100}`,
          `Decreto ${id + 500}`
        ],
        regulations: [
          `Reglamento ${id}-BCCR`
        ],
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
      affected_norms: [`Ley ${law.number}`],
      concordances: [
        `Ley ${parseInt(law.number) - 10}`,
        `Decreto ${id - 100}`
      ],
      regulations: [],
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

  // Low/Medium Impact, Low Urgency (10 alerts) - Guías y mejores prácticas
  const guidanceTopics = [
    "Criterios de interpretación para clasificación de riesgo crediticio en nuevos sectores económicos",
    "Guía de mejores prácticas para gestión de riesgos de ciberseguridad en banca digital",
    "Lineamientos para implementación de políticas ambientales y sociales en otorgamiento de crédito",
    "Interpretación del alcance de obligaciones de diligencia debida en cuentas corporativas",
    "Estándares sugeridos para gestión de quejas y reclamos de clientes",
    "Guía para evaluación de garantías en sectores emergentes (tecnología, innovación)",
    "Criterios de aplicación de excepciones en normativa de prevención de lavado",
    "Lineamientos para implementación de inteligencia artificial en procesos crediticios",
    "Guía de buenas prácticas en educación financiera para clientes",
    "Interpretación de requisitos de gobierno corporativo para entidades financieras"
  ];

  guidanceTopics.forEach((topic, i) => {
    const law = lawsData[i % lawsData.length];
    const consultNumber = `C-${350 + i}-2024`;
    const rigeDate = futureDate(250 + i * 20);
    
    alerts.push({
      title: `${topic} - ${law.name}`,
      law_number: `Ley ${law.number}`,
      detail_link: `https://www.pgr.go.cr/pronunciamientos/${consultNumber}`,
      title_id: consultNumber,
      publication_date: pastDate(Math.floor(Math.random() * 45)),
      effective_date: rigeDate,
      norm_type: i % 2 === 0 ? "Dictamen PGR" : "Opinión Jurídica PGR",
      link: i % 2 === 0 ? `https://www.pgr.go.cr/pronunciamientos/${consultNumber}` : `https://www.sugef.fi.cr/circulares/${consultNumber}`,
      issuing_entity: i % 2 === 0 ? "Procuraduría General de la República" : "SUGEF (Superintendencia General de Entidades Financieras)",
      pgr_consultation_number: i % 2 === 0 ? consultNumber : undefined,
      pgr_type: i % 2 === 0 ? "Dictamen" : undefined,
      pgr_issuer: i % 2 === 0 ? `Lic. ${i % 3 === 0 ? 'Ana' : 'José'} ${['Rodríguez', 'González', 'Mora', 'Vargas'][i % 4]}` : undefined,
      pgr_position: i % 2 === 0 ? "Procurador/a Adjunto/a" : undefined,
      scraped_at: new Date().toISOString(),
      source: "PGR",
      search_source: i % 2 === 0 ? "pgr_monitoring" : "sugef_monitoring",
      csv_in_force: "Sí",
      ministry: law.ministry,
      affected_norms: [`Ley ${law.number}`],
      concordances: [
        `Ley ${parseInt(law.number) + 20}`,
        i % 2 === 0 ? `Dictamen C-${330 + i}-2023` : `Circular SUGEF-${i + 5}-2023`
      ],
      regulations: [],
      is_relevant: true,
      ministry_matches: [
        { portfolio: law.ministry, pattern: "interpretación" }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 45 + Math.floor(Math.random() * 20),
        confidence: 0.70 + Math.random() * 0.1,
        reasons: ["Guía orientadora", "Mejores prácticas sugeridas"],
        is_relevant_for_client: true,
        client_relevance_level: "low",
        client_relevance_reasons: ["Conocimiento recomendado", "Mejora de procesos opcional"],
        affected_units: i % 2 === 0 ? ["Legal", "Cumplimiento"] : ["Riesgos", "Operaciones"],
        portfolio_priority: "low",
        legal_stage: "guidance",
        change_type: ["informacional", "guía"],
        summary: `${i % 2 === 0 ? 'Dictamen de la Procuraduría' : 'Opinión Jurídica orientadora'} que proporciona ${topic.toLowerCase()}. ${i % 2 === 0 ? 'Establece criterios interpretativos' : 'Sugiere lineamientos de mejores prácticas'} que, aunque no son vinculantes de forma estricta, representan la posición oficial del regulador y es recomendable su adopción para garantizar cumplimiento efectivo y evitar cuestionamientos futuros.`,
        alert_title: `Guía: ${topic}`,
        alert_bullets: [
          `${i % 2 === 0 ? 'Dictamen PGR' : 'Opinión Jurídica PGR'} - carácter orientador`,
          "Mejores prácticas recomendadas por el regulador",
          "Adopción voluntaria pero recomendada",
          "Conocimiento útil para áreas de cumplimiento y riesgos"
        ],
        risk_level: i % 2 === 0 ? "low" : "medium",
        risk_score_hint: 35 + Math.floor(Math.random() * 25),
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  });

  return alerts;
}
