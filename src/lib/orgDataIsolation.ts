// Aislamiento de datos mock por organización.
// Algunas organizaciones (ej. Betsson Group, piloto real) deben arrancar con
// TODAS las secciones vacías hasta que se conecte la data sincronizada diaria.
// Este módulo centraliza la decisión para no esparcir IDs por toda la app.

export const EMPTY_DATA_ORG_IDS = new Set<string>([
  // Betsson Group (piloto)
  'b7e15500-0001-4000-8000-000000000001',
]);

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
