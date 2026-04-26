/**
 * Normaliza nombres de entidades regulatorias a su forma canónica corta.
 * Útil para mostrar nombres consistentes en cards, drawers y reportes.
 */

const NORMALIZATION_RULES: Array<{ match: RegExp; replacement: string }> = [
  {
    // SBS: cualquier variante con "Banca, Seguros" + "Pensiones" → forma corta
    match: /superintendencia\s+de\s+banca[,\s]+seguros\s+y\s+(administradoras\s+privadas\s+de\s+fondos\s+de\s+pensiones|afp)/i,
    replacement: "Superintendencia de Banca, Seguros y AFP",
  },
];

export function normalizeEntityName(name?: string | null): string {
  if (!name) return "";
  const trimmed = name.replace(/\s+/g, " ").trim();
  for (const rule of NORMALIZATION_RULES) {
    if (rule.match.test(trimmed)) {
      return rule.replacement;
    }
  }
  return trimmed;
}
