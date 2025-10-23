import { Alert } from "@/types/legislation";

// Helper to generate dates relative to today
function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function pastDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const portfolios = [
  "Health, Disability and Ageing",
  "Attorney-General's",
  "Employment and Workplace Relations",
  "Treasury",
  "Environment, Climate, Energy and Water",
  "Social Services",
  "Industry, Science and Resources"
];

const actNames = [
  { name: "Digital Security Act 2024", portfolio: "Attorney-General's", type: "Act" },
  { name: "Workplace Safety Standards Act 2024", portfolio: "Employment and Workplace Relations", type: "Legislative Instrument" },
  { name: "Environmental Compliance Regulations 2024", portfolio: "Environment, Climate, Energy and Water", type: "Notifiable Instrument" },
  { name: "Taxation Reform Act 2024", portfolio: "Treasury", type: "Compilation/Principal" },
  { name: "Quality Assurance Standards Act 2024", portfolio: "Health, Disability and Ageing", type: "As Made / Amending" },
  { name: "Data Protection Act 2024", portfolio: "Attorney-General's", type: "Act" },
  { name: "Service Provider Obligations Act 2024", portfolio: "Social Services", type: "Legislative Instrument" },
  { name: "Innovation and Research Standards 2024", portfolio: "Industry, Science and Resources", type: "Notifiable Instrument" },
  { name: "Financial Reporting Regulations 2024", portfolio: "Treasury", type: "Compilation/Principal" },
  { name: "Operational Standards Act 2024", portfolio: "Health, Disability and Ageing", type: "As Made / Amending" },
];

// Generate alerts for all quadrants
export function generateMatrixAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let id = 3000;

  // High Impact, High Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const act = actNames[i % actNames.length];
    alerts.push({
      title: `${act.name}`,
      detail_link: `/C2025A0${id}/latest`,
      title_id: `C2025A0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 30)),
      effective_date: futureDate(5 + i),
      collection_code: act.type,
      csv_collection: act.type,
      link: `https://www.legislation.gov.au/C2025A0${id}/latest/text`,
      authorised_by: {
        name: `${act.name}`,
        link: `https://www.legislation.gov.au/C2024A00${100 + i}/latest`
      },
      csv_portfolio: act.portfolio,
      scraped_at: new Date().toISOString(),
      source: "legislation.gov.au",
      search_source: "matrix_demo",
      csv_in_force: "Yes",
      is_relevant: true,
      doc_view: null,
      monitoring_use: "demo",
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 88 + Math.floor(Math.random() * 10),
        confidence: 0.88 + Math.random() * 0.1,
        reasons: ["High operational impact", "Urgent deadline", "Mandatory compliance"],
        is_relevant_for_client: true,
        client_relevance_level: "high",
        client_relevance_reasons: ["Direct operational impact", "Regulatory compliance required"],
        affected_units: ["Operations", "Compliance", "Legal"],
        portfolio_priority: "high",
        legal_stage: "enacted",
        change_type: ["compliance", "operational"],
        summary: `Introduced amendments to Section ${12 + i} of ${act.name}: ${i % 3 === 0 ? 'new mandatory reporting requirements and compliance thresholds' : i % 3 === 1 ? 'revised operational standards and safety protocols' : 'updated enforcement mechanisms and penalty structures'}. Critical changes requiring immediate action with tight implementation timeframes.`,
        alert_title: `Urgent: ${act.name}`,
        alert_bullets: [
          `Mandatory compliance deadline within ${10 + i * 2} days`,
          `Significant operational changes required`,
          `Enhanced reporting and documentation requirements`,
          `Penalties for non-compliance established`
        ],
        risk_level: "high",
        risk_score_hint: 85 + Math.floor(Math.random() * 10),
        deadline_detected: futureDate(10 + i * 2),
        recommended_action: "ALERT_NOW"
      },
      portfolio_matches: [
        { portfolio: act.portfolio, pattern: act.name.toLowerCase().split(' ')[0] }
      ]
    });
    id++;
  }

  // High Impact, Low Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const act = actNames[i % actNames.length];
    alerts.push({
      title: `${act.name}`,
      detail_link: `/C2025B0${id}/latest`,
      title_id: `C2025B0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 60)),
      effective_date: futureDate(150 + i * 10),
      collection_code: act.type,
      csv_collection: act.type,
      link: `https://www.legislation.gov.au/C2025B0${id}/latest/text`,
      authorised_by: {
        name: `${act.name}`,
        link: `https://www.legislation.gov.au/C2023A00${200 + i}/latest`
      },
      csv_portfolio: act.portfolio,
      scraped_at: new Date().toISOString(),
      source: "legislation.gov.au",
      search_source: "matrix_demo",
      csv_in_force: "No",
      is_relevant: true,
      doc_view: null,
      monitoring_use: "demo",
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 82 + Math.floor(Math.random() * 8),
        confidence: 0.85 + Math.random() * 0.08,
        reasons: ["High strategic importance", "Long-term planning required"],
        is_relevant_for_client: true,
        client_relevance_level: "high",
        client_relevance_reasons: ["Strategic planning impact", "Operational restructuring needed"],
        affected_units: ["Strategy", "Operations", "Finance"],
        portfolio_priority: "high",
        legal_stage: "proposal",
        change_type: ["strategic", "planning"],
        summary: `Introduced substantial modifications to Part ${3 + i} of ${act.name}: ${i % 3 === 0 ? 'expanded definitions and scope of application' : i % 3 === 1 ? 'restructured governance and oversight requirements' : 'new strategic planning and risk management obligations'}. Major strategic changes with extended implementation timeline allowing adequate preparation time.`,
        alert_title: `Important: ${act.name}`,
        alert_bullets: [
          `Substantial changes planned for 2026`,
          `Extended consultation period available`,
          `Strategic planning and resource allocation required`,
          `Long-term operational impact expected`
        ],
        risk_level: "high",
        risk_score_hint: 80 + Math.floor(Math.random() * 8),
        deadline_detected: futureDate(150 + i * 10),
        recommended_action: "ALERT_NOW"
      },
      portfolio_matches: [
        { portfolio: act.portfolio, pattern: "review" }
      ]
    });
    id++;
  }

  // Low/Medium Impact, High Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const act = actNames[i % actNames.length];
    alerts.push({
      title: `${act.name}`,
      detail_link: `/F2025L0${id}/latest`,
      title_id: `F2025L0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 20)),
      effective_date: futureDate(8 + i),
      collection_code: act.type,
      csv_collection: act.type,
      link: `https://www.legislation.gov.au/F2025L0${id}/latest/text`,
      authorised_by: {
        name: `${act.name}`,
        link: `https://www.legislation.gov.au/C2022A00${300 + i}/latest`
      },
      csv_portfolio: act.portfolio,
      scraped_at: new Date().toISOString(),
      source: "legislation.gov.au",
      search_source: "matrix_demo",
      csv_in_force: "Yes",
      is_relevant: true,
      doc_view: null,
      monitoring_use: "demo",
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 60 + Math.floor(Math.random() * 15),
        confidence: 0.75 + Math.random() * 0.1,
        reasons: ["Administrative updates needed", "Near-term deadline"],
        is_relevant_for_client: true,
        client_relevance_level: "medium",
        client_relevance_reasons: ["Procedural compliance", "Documentation updates"],
        affected_units: ["Administration", "Compliance"],
        portfolio_priority: "medium",
        legal_stage: "enacted",
        change_type: ["administrative", "procedural"],
        summary: `Introduced procedural amendments to Schedule ${2 + i} of ${act.name}: ${i % 3 === 0 ? 'updated notification and documentation requirements' : i % 3 === 1 ? 'revised submission timelines and formats' : 'modified record-keeping and archival obligations'}. Minor administrative changes with near-term implementation requiring prompt attention.`,
        alert_title: `Action Required: ${act.name}`,
        alert_bullets: [
          `Administrative procedure updates required`,
          `Short implementation timeframe`,
          `Limited operational changes`,
          `Documentation updates needed`
        ],
        risk_level: i % 2 === 0 ? "medium" : "low",
        risk_score_hint: 50 + Math.floor(Math.random() * 20),
        deadline_detected: futureDate(8 + i),
        recommended_action: "ALERT_NOW"
      },
      portfolio_matches: [
        { portfolio: act.portfolio, pattern: "regulation" }
      ]
    });
    id++;
  }

  // Low/Medium Impact, Low Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const act = actNames[i % actNames.length];
    alerts.push({
      title: `${act.name}`,
      detail_link: `/C2025N0${id}/latest`,
      title_id: `C2025N0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 90)),
      effective_date: futureDate(200 + i * 15),
      collection_code: act.type,
      csv_collection: act.type,
      link: `https://www.legislation.gov.au/C2025N0${id}/latest/text`,
      authorised_by: {
        name: `${act.name}`,
        link: `https://www.legislation.gov.au/C2021A00${400 + i}/latest`
      },
      csv_portfolio: act.portfolio,
      scraped_at: new Date().toISOString(),
      source: "legislation.gov.au",
      search_source: "matrix_demo",
      csv_in_force: "No",
      is_relevant: true,
      doc_view: null,
      monitoring_use: "demo",
      AI_triage: {
        processed: true,
        skipped: null,
        decision: "RELEVANT",
        score: 45 + Math.floor(Math.random() * 20),
        confidence: 0.70 + Math.random() * 0.1,
        reasons: ["Informational guidance", "Best practices"],
        is_relevant_for_client: true,
        client_relevance_level: "low",
        client_relevance_reasons: ["Awareness recommended", "Optional improvements"],
        affected_units: ["All units"],
        portfolio_priority: "low",
        legal_stage: "guidance",
        change_type: ["informational", "guidance"],
        summary: `Introduced clarifications to Regulation ${5 + i}.${1 + i} of ${act.name}: ${i % 3 === 0 ? 'updated interpretation guidance and examples' : i % 3 === 1 ? 'refined best practice standards and recommendations' : 'enhanced voluntary compliance frameworks and benchmarks'}. Informational guidance with low urgency and minimal operational impact.`,
        alert_title: `For Information: ${act.name}`,
        alert_bullets: [
          `Best practice guidance provided`,
          `Extended review period available`,
          `Minimal operational changes`,
          `Voluntary compliance encouraged`
        ],
        risk_level: i % 2 === 0 ? "medium" : "low",
        risk_score_hint: 35 + Math.floor(Math.random() * 25),
        deadline_detected: futureDate(200 + i * 15),
        recommended_action: "ALERT_NOW"
      },
      portfolio_matches: [
        { portfolio: act.portfolio, pattern: "guidance" }
      ]
    });
    id++;
  }

  return alerts;
}
