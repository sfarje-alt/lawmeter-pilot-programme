// Reusable Panel / Morning Brief configuration.
// A single Panel component is shared across clients; this file defines the
// per-client configuration (single-country vs regional, active jurisdictions,
// header copy, etc.). Do NOT bake client-specific UI into the Panel itself —
// keep all variation in config objects.

import { BETSSON_COUNTRIES } from "@/lib/betssonCountries";
import { BETSSON_ORG_ID, ISA_ORG_ID } from "@/lib/orgDataIsolation";

export type PanelCountryCode = "PE" | "CL" | "CO" | "AR";
export type PanelCountryStatus = "active" | "activating";

export interface PanelCountry {
  code: PanelCountryCode;
  name: string;
  status: PanelCountryStatus;
  statusLabel: string;
  description: string;
}

export type JurisdictionMode = "single" | "regional";

export interface PanelClientConfig {
  /** Client display name, used in the Panel header (e.g. "Betsson", "ISA Energía"). */
  clientName: string;
  /** "ISA Energía · Morning Brief" or "Betsson · Morning Brief Regional". */
  headerTitle: string;
  /** One short line below the title. */
  headerSubtitle: string;
  /** Pill shown next to the title (e.g. "Perú activo", "Betsson · LATAM"). */
  headerBadge: string;
  /** single = one country, no toggles; regional = multi-country snapshot. */
  jurisdictionMode: JurisdictionMode;
  /** Countries displayed in snapshot / status sections (omitted in single mode). */
  countries: PanelCountry[];
  /** Country code whose data feeds the KPIs and top alerts. */
  primaryCountry: PanelCountryCode;
  /** Optional brief copy for the executive summary when data is available. */
  executiveSummaryFull?: string;
  /** Optional copy for the executive summary when data is sparse/empty. */
  executiveSummaryEmpty?: string;
}

export const BETSSON_PANEL_CONFIG: PanelClientConfig = {
  clientName: "Betsson",
  headerTitle: "Betsson · Morning Brief Regional",
  headerSubtitle:
    "Lectura rápida del monitoreo regulatorio · Perú y Chile activos · Colombia y Argentina en activación",
  headerBadge: "Betsson · LATAM",
  jurisdictionMode: "regional",
  countries: BETSSON_COUNTRIES,
  primaryCountry: "PE",
};

export const ISA_PANEL_CONFIG: PanelClientConfig = {
  clientName: "ISA Energía",
  headerTitle: "ISA Energía · Morning Brief",
  headerSubtitle: "Lectura rápida del monitoreo regulatorio · Perú",
  headerBadge: "Perú activo",
  jurisdictionMode: "single",
  countries: [
    {
      code: "PE",
      name: "Perú",
      status: "active",
      statusLabel: "Activo",
      description: "Monitoreo operativo habilitado.",
    },
  ],
  primaryCountry: "PE",
  executiveSummaryFull:
    "El entorno regulatorio del perfil ISA Energía en Perú muestra actividad relevante vinculada a cambios normativos, proyectos legislativos y posibles obligaciones operativas para el sector energía e infraestructura. Las alertas priorizadas sugieren que el equipo legal debe concentrarse en las fuentes con mayor movimiento, los plazos próximos y las materias con potencial impacto en operación, permisos, supervisión sectorial o cumplimiento ambiental.",
  executiveSummaryEmpty:
    "El perfil ISA Energía se encuentra configurado para monitoreo regulatorio en Perú. El Panel consolidará las alertas, plazos y sesiones relevantes conforme existan desarrollos disponibles en las fuentes activas. Por ahora, la revisión operativa debe mantenerse concentrada en las secciones de Alertas, Calendario y Sesiones.",
};

/** Organizations that should see the Panel / Morning Brief entry point. */
const PANEL_CONFIGS_BY_ORG: Record<string, PanelClientConfig> = {
  [BETSSON_ORG_ID]: BETSSON_PANEL_CONFIG,
  [ISA_ORG_ID]: ISA_PANEL_CONFIG,
};

export function getPanelConfigForOrg(
  organizationId: string | null | undefined,
): PanelClientConfig | null {
  if (!organizationId) return null;
  return PANEL_CONFIGS_BY_ORG[organizationId] ?? null;
}

export function hasPanelForOrg(
  organizationId: string | null | undefined,
): boolean {
  return getPanelConfigForOrg(organizationId) !== null;
}
