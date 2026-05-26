// Aislamiento de datos mock por organización.
// Algunas organizaciones (ej. Betsson Group, piloto real) deben arrancar con
// TODAS las secciones vacías hasta que se conecte la data sincronizada diaria.
// Este módulo centraliza la decisión para no esparcir IDs por toda la app.

export const BETSSON_ORG_ID = "b7e15500-0001-4000-8000-000000000001";
export const ISA_ORG_ID = "b7e15500-0004-4000-8000-000000000001";

export function isBetssonOrg(organizationId: string | null | undefined): boolean {
  return organizationId === BETSSON_ORG_ID;
}

export function isISAOrg(organizationId: string | null | undefined): boolean {
  return organizationId === ISA_ORG_ID;
}

export const EMPTY_DATA_ORG_IDS = new Set<string>([
  // Betsson Group (piloto)
  BETSSON_ORG_ID,
  // ISA (piloto)
  'b7e15500-0004-4000-8000-000000000001',
  // Diez Canseco (piloto - subida manual JSON)
  'b7e15500-0006-4000-8000-000000000001',
]);

// Organizaciones cuya única fuente de alertas es la subida manual de JSON
// (no scrapers ni ingest automático). Habilita el portal "Cargar alertas".
export const MANUAL_INGEST_ORG_IDS = new Set<string>([
  'b7e15500-0006-4000-8000-000000000001', // Diez Canseco
]);

export function isManualIngestOrg(organizationId: string | null | undefined): boolean {
  if (!organizationId) return false;
  return MANUAL_INGEST_ORG_IDS.has(organizationId);
}

/**
 * Devuelve true si la organización debe ver bandejas, sesiones, calendario,
 * analíticas y reportes vacíos (sin datos mock).
 */
export function isEmptyDataOrg(organizationId: string | null | undefined): boolean {
  if (!organizationId) return false;
  return EMPTY_DATA_ORG_IDS.has(organizationId);
}

// Singleton runtime flag para módulos que no tienen acceso a React context
// (ej. analyticsRepository.ts). El AlertsProvider lo actualiza al montarse.
let _currentOrgIsEmpty = false;

export function setCurrentOrgEmptyFlag(isEmpty: boolean) {
  _currentOrgIsEmpty = isEmpty;
}

export function isCurrentOrgEmpty(): boolean {
  return _currentOrgIsEmpty;
}
