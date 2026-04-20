// Paleta de colores por comisión del Congreso del Perú.
// Cada comisión recibe un color único y estable (hash determinístico),
// con texto blanco siempre para máxima legibilidad.
// Los colores son HSL puro y se mantienen discretos pero distinguibles.

const COMMISSION_PALETTE: { bg: string; ring: string }[] = [
  { bg: 'hsl(217 91% 45%)', ring: 'hsl(217 91% 55%)' }, // azul
  { bg: 'hsl(160 70% 35%)', ring: 'hsl(160 70% 45%)' }, // verde esmeralda
  { bg: 'hsl(280 60% 45%)', ring: 'hsl(280 60% 55%)' }, // violeta
  { bg: 'hsl(20 85% 45%)', ring: 'hsl(20 85% 55%)' },   // naranja terracota
  { bg: 'hsl(340 70% 45%)', ring: 'hsl(340 70% 55%)' }, // magenta
  { bg: 'hsl(195 80% 38%)', ring: 'hsl(195 80% 48%)' }, // cian profundo
  { bg: 'hsl(45 85% 40%)', ring: 'hsl(45 85% 50%)' },   // mostaza
  { bg: 'hsl(0 70% 45%)', ring: 'hsl(0 70% 55%)' },     // rojo
  { bg: 'hsl(245 60% 50%)', ring: 'hsl(245 60% 60%)' }, // índigo
  { bg: 'hsl(140 55% 35%)', ring: 'hsl(140 55% 45%)' }, // verde bosque
  { bg: 'hsl(310 55% 42%)', ring: 'hsl(310 55% 52%)' }, // púrpura
  { bg: 'hsl(175 65% 32%)', ring: 'hsl(175 65% 42%)' }, // teal
  { bg: 'hsl(30 75% 42%)', ring: 'hsl(30 75% 52%)' },   // ámbar oscuro
  { bg: 'hsl(260 55% 48%)', ring: 'hsl(260 55% 58%)' }, // lila
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface CommissionColor {
  bg: string;        // background sólido
  ring: string;      // borde / accent un poco más claro
  text: string;      // texto SIEMPRE blanco
}

export function getCommissionColor(commissionName: string): CommissionColor {
  const key = (commissionName ?? '').trim().toLowerCase();
  if (!key) {
    return { ...COMMISSION_PALETTE[0], text: 'hsl(0 0% 100%)' };
  }
  const idx = hashString(key) % COMMISSION_PALETTE.length;
  return { ...COMMISSION_PALETTE[idx], text: 'hsl(0 0% 100%)' };
}
