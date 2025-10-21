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

const topics = [
  { name: "Digital Security Framework", portfolio: "Attorney-General's" },
  { name: "Workplace Safety Standards", portfolio: "Employment and Workplace Relations" },
  { name: "Environmental Compliance", portfolio: "Environment, Climate, Energy and Water" },
  { name: "Taxation Reform", portfolio: "Treasury" },
  { name: "Quality Assurance Standards", portfolio: "Health, Disability and Ageing" },
  { name: "Data Protection Requirements", portfolio: "Attorney-General's" },
  { name: "Service Provider Obligations", portfolio: "Social Services" },
  { name: "Innovation and Research", portfolio: "Industry, Science and Resources" },
  { name: "Financial Reporting", portfolio: "Treasury" },
  { name: "Operational Standards", portfolio: "Health, Disability and Ageing" },
];

// Generate alerts for all quadrants
export function generateMatrixAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let id = 3000;

  // High Impact, High Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    alerts.push({
      title: `${topic.name} Amendment Act 2025`,
      detail_link: `/C2025A0${id}/latest`,
      title_id: `C2025A0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 30)),
      effective_date: futureDate(5 + i),
      collection_code: "act",
      csv_collection: "act",
      link: `https://www.legislation.gov.au/C2025A0${id}/latest/text`,
      authorised_by: {
        name: `${topic.name} Act 2024`,
        link: `https://www.legislation.gov.au/C2024A00${100 + i}/latest`
      },
      csv_portfolio: topic.portfolio,
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
        summary: `Critical changes to ${topic.name.toLowerCase()} requiring immediate action. Introduces mandatory compliance measures with tight implementation timeframes.`,
        alert_title: `Urgent: ${topic.name} Amendment Act 2025`,
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
        { portfolio: topic.portfolio, pattern: topic.name.toLowerCase().split(' ')[0] }
      ]
    });
    id++;
  }

  // High Impact, Low Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    alerts.push({
      title: `${topic.name} Strategic Review Bill 2025`,
      detail_link: `/C2025B0${id}/latest`,
      title_id: `C2025B0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 60)),
      effective_date: futureDate(150 + i * 10),
      collection_code: "bill",
      csv_collection: "bill",
      link: `https://www.legislation.gov.au/C2025B0${id}/latest/text`,
      authorised_by: {
        name: `${topic.name} Act 2023`,
        link: `https://www.legislation.gov.au/C2023A00${200 + i}/latest`
      },
      csv_portfolio: topic.portfolio,
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
        summary: `Major strategic changes to ${topic.name.toLowerCase()} with extended implementation timeline. High importance but adequate time for preparation.`,
        alert_title: `Important: ${topic.name} Strategic Review`,
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
        { portfolio: topic.portfolio, pattern: "review" }
      ]
    });
    id++;
  }

  // Low/Medium Impact, High Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    alerts.push({
      title: `${topic.name} Minor Amendment Regulation 2025`,
      detail_link: `/F2025L0${id}/latest`,
      title_id: `F2025L0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 20)),
      effective_date: futureDate(8 + i),
      collection_code: "regulation",
      csv_collection: "regulation",
      link: `https://www.legislation.gov.au/F2025L0${id}/latest/text`,
      authorised_by: {
        name: `${topic.name} Act 2022`,
        link: `https://www.legislation.gov.au/C2022A00${300 + i}/latest`
      },
      csv_portfolio: topic.portfolio,
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
        summary: `Minor administrative changes to ${topic.name.toLowerCase()} procedures with near-term implementation. Limited operational impact but requires prompt attention.`,
        alert_title: `Action Required: ${topic.name} Updates`,
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
        { portfolio: topic.portfolio, pattern: "regulation" }
      ]
    });
    id++;
  }

  // Low/Medium Impact, Low Urgency (10 alerts)
  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    alerts.push({
      title: `${topic.name} Information Notice 2025`,
      detail_link: `/C2025N0${id}/latest`,
      title_id: `C2025N0${id}`,
      registered_date: pastDate(Math.floor(Math.random() * 90)),
      effective_date: futureDate(200 + i * 15),
      collection_code: "notice",
      csv_collection: "notice",
      link: `https://www.legislation.gov.au/C2025N0${id}/latest/text`,
      authorised_by: {
        name: `${topic.name} Act 2021`,
        link: `https://www.legislation.gov.au/C2021A00${400 + i}/latest`
      },
      csv_portfolio: topic.portfolio,
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
        summary: `Informational guidance on ${topic.name.toLowerCase()} best practices. Low urgency with minimal operational impact.`,
        alert_title: `For Information: ${topic.name} Guidance`,
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
        { portfolio: topic.portfolio, pattern: "guidance" }
      ]
    });
    id++;
  }

  return alerts;
}
