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
  "Ministerio de Hacienda",
  "Ministerio de Salud",
  "Ministerio de Trabajo y Seguridad Social",
  "Ministerio de Economía, Industria y Comercio",
  "Ministerio de Ambiente y Energía",
  "Ministerio de Justicia y Paz",
  "Banco Central de Costa Rica"
];

const lawsData = [
  { 
    number: "7786", 
    name: "Ley sobre Estupefacientes, Sustancias Psicotrópicas, Drogas de Uso No Autorizado, Legitimación de Capitales y Actividades Conexas",
    ministry: "Ministerio de Justicia y Paz",
    type: "Ley" as const
  },
  { 
    number: "8204", 
    name: "Ley sobre Estupefacientes, Sustancias Psicotrópicas, Drogas de Uso No Autorizado, Legitimación de Capitales y Actividades Conexas",
    ministry: "Ministerio de Justicia y Paz",
    type: "Ley" as const
  },
  { 
    number: "9416", 
    name: "Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales",
    ministry: "Ministerio de Justicia y Paz",
    type: "Ley" as const
  },
  { 
    number: "8220", 
    name: "Ley de Protección al Ciudadano del Exceso de Requisitos y Trámites Administrativos",
    ministry: "Ministerio de Economía, Industria y Comercio",
    type: "Ley" as const
  },
  { 
    number: "7600", 
    name: "Ley de Igualdad de Oportunidades para las Personas con Discapacidad",
    ministry: "Ministerio de Trabajo y Seguridad Social",
    type: "Ley" as const
  },
  { 
    number: "9635", 
    name: "Ley de Fortalecimiento de las Finanzas Públicas",
    ministry: "Ministerio de Hacienda",
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
    number: "5395", 
    name: "Ley General de Salud",
    ministry: "Ministerio de Salud",
    type: "Ley" as const
  },
  { 
    number: "7554", 
    name: "Ley Orgánica del Ambiente",
    ministry: "Ministerio de Ambiente y Energía",
    type: "Ley" as const
  },
];

// Generate alerts for all quadrants
export function generateCostaRicaAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let id = 5000;

  // High Impact, High Urgency (10 alerts) - Rige muy pronto
  for (let i = 0; i < 10; i++) {
    const law = lawsData[i % lawsData.length];
    const rigeDate = futureDate(5 + i * 2);
    
    alerts.push({
      title: law.name,
      law_number: `Ley ${law.number}`,
      detail_link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      title_id: `LEY-${law.number}-${id}`,
      publication_date: pastDate(Math.floor(Math.random() * 30)),
      effective_date: rigeDate,
      version: `Versión ${i + 1}`,
      norm_type: law.type,
      link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      issuing_entity: "Asamblea Legislativa de Costa Rica",
      scraped_at: new Date().toISOString(),
      source: "SINALEVI",
      search_source: "sinalevi_monitoring",
      csv_in_force: "Sí",
      ministry: law.ministry,
      affected_norms: [
        `Ley ${parseInt(law.number) - 100}`,
        `Decreto Ejecutivo ${id - 200}-H`
      ],
      concordances: [
        `Ley ${parseInt(law.number) + 50}`,
        `Reglamento ${id + 100}`
      ],
      regulations: [
        `Decreto Ejecutivo ${id}-MEIC`,
        `Reglamento ${id + 50}`
      ],
      is_relevant: true,
      ministry_matches: [
        { portfolio: law.ministry, pattern: law.name.split(' ')[0].toLowerCase() }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 88 + Math.floor(Math.random() * 10),
        confidence: 0.88 + Math.random() * 0.1,
        reasons: ["Alto impacto operativo", "Plazo urgente de cumplimiento", "Obligaciones de cumplimiento obligatorio"],
        is_relevant_for_client: true,
        client_relevance_level: "high",
        client_relevance_reasons: ["Impacto directo en operaciones", "Cumplimiento normativo requerido"],
        affected_units: ["Operaciones", "Cumplimiento", "Legal"],
        portfolio_priority: "high",
        legal_stage: "enacted",
        change_type: ["cumplimiento", "operacional"],
        summary: `Se introducen reformas al Artículo ${12 + i} de la ${law.name}: ${
          i % 3 === 0 
            ? 'nuevos requisitos obligatorios de reporte y umbrales de cumplimiento' 
            : i % 3 === 1 
            ? 'estándares operativos y protocolos de seguridad revisados' 
            : 'mecanismos de aplicación actualizados y estructuras de sanciones'
        }. Cambios críticos que requieren acción inmediata con plazos de implementación ajustados. Según Artículo Transitorio ${i + 1}, el plazo máximo para cumplimiento es ${10 + i * 2} días desde publicación.`,
        alert_title: `Urgente: ${law.name}`,
        alert_bullets: [
          `Plazo de cumplimiento obligatorio: ${10 + i * 2} días (rige ${rigeDate})`,
          `Cambios operativos significativos requeridos`,
          `Requisitos mejorados de reporte y documentación`,
          `Sanciones por incumplimiento establecidas en Artículo ${15 + i}`
        ],
        risk_level: "high",
        risk_score_hint: 85 + Math.floor(Math.random() * 10),
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  }

  // High Impact, Low Urgency (10 alerts) - Rige en varios meses
  for (let i = 0; i < 10; i++) {
    const law = lawsData[i % lawsData.length];
    const rigeDate = futureDate(150 + i * 10);
    
    alerts.push({
      title: law.name,
      law_number: `Ley ${law.number}`,
      detail_link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      title_id: `LEY-${law.number}-${id}`,
      publication_date: pastDate(Math.floor(Math.random() * 60)),
      effective_date: rigeDate,
      version: `Versión ${i + 2}`,
      norm_type: law.type,
      link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      issuing_entity: "Asamblea Legislativa de Costa Rica",
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
        `Reglamento ${id}-${law.ministry.split(' ')[2] || 'GOB'}`
      ],
      is_relevant: true,
      ministry_matches: [
        { portfolio: law.ministry, pattern: "reforma" }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 82 + Math.floor(Math.random() * 8),
        confidence: 0.85 + Math.random() * 0.08,
        reasons: ["Alta importancia estratégica", "Planificación a largo plazo requerida"],
        is_relevant_for_client: true,
        client_relevance_level: "high",
        client_relevance_reasons: ["Impacto en planificación estratégica", "Reestructuración operativa necesaria"],
        affected_units: ["Estrategia", "Operaciones", "Finanzas"],
        portfolio_priority: "high",
        legal_stage: "proposal",
        change_type: ["estratégico", "planificación"],
        summary: `Se introducen modificaciones sustanciales a la Parte ${3 + i} de la ${law.name}: ${
          i % 3 === 0 
            ? 'definiciones expandidas y ámbito de aplicación ampliado' 
            : i % 3 === 1 
            ? 'requisitos de gobernanza y supervisión reestructurados' 
            : 'nuevas obligaciones de planificación estratégica y gestión de riesgos'
        }. Cambios estratégicos importantes con cronograma de implementación extendido que permite tiempo adecuado de preparación. El Artículo Transitorio establece entrada en vigencia para 2026.`,
        alert_title: `Importante: ${law.name}`,
        alert_bullets: [
          `Cambios sustanciales planificados para 2026 (rige ${rigeDate})`,
          `Período de consulta extendido disponible`,
          `Planificación estratégica y asignación de recursos requerida`,
          `Impacto operativo a largo plazo esperado`
        ],
        risk_level: "high",
        risk_score_hint: 80 + Math.floor(Math.random() * 8),
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  }

  // Low/Medium Impact, High Urgency (10 alerts) - Cambios administrativos urgentes
  for (let i = 0; i < 10; i++) {
    const law = lawsData[i % lawsData.length];
    const rigeDate = futureDate(8 + i);
    
    alerts.push({
      title: `Reglamento de ${law.name}`,
      law_number: `Decreto Ejecutivo ${id}`,
      detail_link: `https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=${id}`,
      title_id: `DE-${id}`,
      publication_date: pastDate(Math.floor(Math.random() * 20)),
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
        { portfolio: law.ministry, pattern: "reglamento" }
      ],
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 60 + Math.floor(Math.random() * 15),
        confidence: 0.75 + Math.random() * 0.1,
        reasons: ["Actualizaciones administrativas necesarias", "Plazo cercano"],
        is_relevant_for_client: true,
        client_relevance_level: "medium",
        client_relevance_reasons: ["Cumplimiento procedimental", "Actualizaciones de documentación"],
        affected_units: ["Administración", "Cumplimiento"],
        portfolio_priority: "medium",
        legal_stage: "enacted",
        change_type: ["administrativo", "procedimental"],
        summary: `Se introducen enmiendas procedimentales al Anexo ${2 + i} del Reglamento de la ${law.name}: ${
          i % 3 === 0 
            ? 'requisitos actualizados de notificación y documentación' 
            : i % 3 === 1 
            ? 'cronogramas y formatos de presentación revisados' 
            : 'obligaciones modificadas de mantenimiento de registros y archivo'
        }. Cambios administrativos menores con implementación a corto plazo que requieren atención pronta.`,
        alert_title: `Acción Requerida: Reglamento ${law.name}`,
        alert_bullets: [
          `Actualizaciones de procedimientos administrativos requeridas`,
          `Plazo corto de implementación (rige ${rigeDate})`,
          `Cambios operativos limitados`,
          `Actualizaciones de documentación necesarias`
        ],
        risk_level: i % 2 === 0 ? "medium" : "low",
        risk_score_hint: 50 + Math.floor(Math.random() * 20),
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  }

  // Low/Medium Impact, Low Urgency (10 alerts) - Pronunciamientos PGR y guías
  for (let i = 0; i < 10; i++) {
    const law = lawsData[i % lawsData.length];
    const consultNumber = `C-${213 + i}-2024`;
    const rigeDate = futureDate(200 + i * 15);
    
    alerts.push({
      title: `Interpretación de ${law.name} - Artículo ${5 + i}`,
      law_number: `Ley ${law.number}`,
      detail_link: `https://www.pgr.go.cr/pronunciamientos/${consultNumber}`,
      title_id: consultNumber,
      publication_date: pastDate(Math.floor(Math.random() * 90)),
      effective_date: rigeDate,
      norm_type: i % 2 === 0 ? "Dictamen PGR" : "Opinión Jurídica PGR",
      link: `https://www.pgr.go.cr/pronunciamientos/${consultNumber}`,
      issuing_entity: "Procuraduría General de la República",
      pgr_consultation_number: consultNumber,
      pgr_type: i % 2 === 0 ? "Dictamen" : "Opinión Jurídica",
      pgr_issuer: `Lic. ${i % 2 === 0 ? 'María' : 'Carlos'} ${['Rodríguez', 'González', 'Hernández', 'Jiménez'][i % 4]}`,
      pgr_position: i % 2 === 0 ? "Procuradora General Adjunta" : "Procurador General Adjunto",
      scraped_at: new Date().toISOString(),
      source: "PGR",
      search_source: "pgr_monitoring",
      csv_in_force: "Sí",
      ministry: law.ministry,
      affected_norms: [`Ley ${law.number}`],
      concordances: [
        `Ley ${parseInt(law.number) + 20}`,
        `Dictamen C-${200 + i}-2023`
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
        reasons: ["Guía informativa", "Mejores prácticas"],
        is_relevant_for_client: true,
        client_relevance_level: "low",
        client_relevance_reasons: ["Conocimiento recomendado", "Mejoras opcionales"],
        affected_units: ["Todas las unidades"],
        portfolio_priority: "low",
        legal_stage: "guidance",
        change_type: ["informacional", "guía"],
        summary: `${i % 2 === 0 ? 'Dictamen' : 'Opinión Jurídica'} ${consultNumber} sobre la interpretación del Artículo ${5 + i}.${1 + i} de la ${law.name}. La PGR ${
          i % 3 === 0 
            ? 'aclara el alcance de las obligaciones establecidas y proporciona ejemplos de aplicación práctica' 
            : i % 3 === 1 
            ? 'establece criterios de interpretación para casos de avances tecnológicos no contemplados en la norma original' 
            : 'define términos jurídicos y establece estándares de mejores prácticas para el cumplimiento voluntario'
        }. ${i % 2 === 0 ? 'Vinculante para toda la administración pública.' : 'Carácter orientador y persuasivo.'}`,
        alert_title: `Para Información: ${i % 2 === 0 ? 'Dictamen' : 'Opinión'} PGR ${consultNumber}`,
        alert_bullets: [
          `${i % 2 === 0 ? 'Dictamen vinculante' : 'Opinión jurídica orientadora'} de la PGR`,
          `Guía de interpretación del Artículo ${5 + i} de Ley ${law.number}`,
          `Impacto operativo mínimo`,
          `Cumplimiento voluntario recomendado`
        ],
        risk_level: i % 2 === 0 ? "medium" : "low",
        risk_score_hint: 35 + Math.floor(Math.random() * 25),
        deadline_detected: rigeDate,
        recommended_action: "ALERT_NOW"
      },
      monitoring_use: "costa_rica_demo"
    });
    id++;
  }

  return alerts;
}
