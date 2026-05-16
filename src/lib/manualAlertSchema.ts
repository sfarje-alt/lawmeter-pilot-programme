import { z } from "zod";

// Categorías que envía Diez Canseco (mixtas: impacto y urgencia).
// Aceptamos cualquier string para no bloquear, pero conocemos estos valores.
export const KNOWN_CATEGORIAS = [
  "Grave",
  "Alto",
  "Medio",
  "Leve",
  "Bajo",
  "Positivo",
] as const;

const clientBlock = z.object({
  comentario_experto: z.string().optional(),
  impacto: z.string().optional(),
  urgencia: z.string().optional(),
  area_interes: z.union([z.string(), z.array(z.string())]).optional(),
});

const plRawItem = z
  .object({
    id: z.string().min(1, "id requerido"),
    num_proyecto: z.string().optional(),
    periodo_parlamentario: z.string().optional(),
    nivel: z.string().optional(),
    texto_completo: z.string().optional(),
    fecha_proyecto: z.string().optional(),
    grupo_parlamentario: z.string().optional(),
    autor: z.string().optional(),
    ult_estado: z.string().optional(),
    fecha_ult_estado: z.string().optional(),
    enlace: z.string().optional(),
  })
  .catchall(z.unknown());

const normaRawItem = z
  .object({
    id: z.string().min(1, "id requerido"),
    institucion: z.string().optional(),
    num_norma: z.string().optional(),
    texto_completo: z.string().optional(),
    fecha: z.string().optional(),
    enlace: z.string().optional(),
  })
  .catchall(z.unknown());

const RESERVED_KEYS_PL = new Set([
  "id",
  "num_proyecto",
  "periodo_parlamentario",
  "nivel",
  "texto_completo",
  "fecha_proyecto",
  "grupo_parlamentario",
  "autor",
  "ult_estado",
  "fecha_ult_estado",
  "enlace",
]);
const RESERVED_KEYS_NORMA = new Set([
  "id",
  "institucion",
  "num_norma",
  "texto_completo",
  "fecha",
  "enlace",
]);

export interface ClientAnnotation {
  client_key: string;
  comentario_experto?: string;
  impacto?: string;
  urgencia?: string;
  area_interes: string[];
}

export interface NormalizedPL {
  tipo: "pl";
  external_id: string;
  num_proyecto?: string;
  periodo_parlamentario?: string;
  nivel?: string;
  texto_completo?: string;
  fecha_proyecto?: string;
  grupo_parlamentario?: string;
  autor?: string;
  ult_estado?: string;
  fecha_ult_estado?: string;
  enlace?: string;
  annotation: ClientAnnotation | null;
}

export interface NormalizedNorma {
  tipo: "norma";
  external_id: string;
  institucion?: string;
  num_norma?: string;
  texto_completo?: string;
  fecha?: string;
  enlace?: string;
  annotation: ClientAnnotation | null;
}

export type NormalizedItem = NormalizedPL | NormalizedNorma;

function extractAnnotation(
  raw: Record<string, unknown>,
  reserved: Set<string>,
): ClientAnnotation | null {
  const dynamicEntries = Object.entries(raw).filter(
    ([k, v]) =>
      !reserved.has(k) &&
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v),
  );
  if (dynamicEntries.length === 0) return null;
  const [client_key, value] = dynamicEntries[0];
  const parsed = clientBlock.safeParse(value);
  if (!parsed.success) return null;
  const area = parsed.data.area_interes;
  return {
    client_key,
    comentario_experto: parsed.data.comentario_experto,
    impacto: parsed.data.impacto,
    urgencia: parsed.data.urgencia,
    area_interes: Array.isArray(area)
      ? area
      : typeof area === "string" && area.trim()
        ? [area]
        : [],
  };
}

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") return [raw as T];
  return [];
}

export function parseManualPayload(
  raw: unknown,
  tipo: "pl" | "norma",
): { ok: true; items: NormalizedItem[] } | { ok: false; error: string } {
  const arr = toArray<Record<string, unknown>>(raw);
  if (arr.length === 0) {
    return { ok: false, error: "El archivo no contiene items" };
  }
  const items: NormalizedItem[] = [];
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    if (tipo === "pl") {
      const parsed = plRawItem.safeParse(obj);
      if (!parsed.success) {
        const first = parsed.error.errors[0];
        return {
          ok: false,
          error: `Item ${i + 1} → ${first.path.join(".") || "raíz"}: ${first.message}`,
        };
      }
      const annotation = extractAnnotation(obj, RESERVED_KEYS_PL);
      items.push({
        tipo: "pl",
        external_id: parsed.data.id,
        num_proyecto: parsed.data.num_proyecto,
        periodo_parlamentario: parsed.data.periodo_parlamentario,
        nivel: parsed.data.nivel,
        texto_completo: parsed.data.texto_completo,
        fecha_proyecto: parsed.data.fecha_proyecto,
        grupo_parlamentario: parsed.data.grupo_parlamentario,
        autor: parsed.data.autor,
        ult_estado: parsed.data.ult_estado,
        fecha_ult_estado: parsed.data.fecha_ult_estado,
        enlace: parsed.data.enlace,
        annotation,
      });
    } else {
      const parsed = normaRawItem.safeParse(obj);
      if (!parsed.success) {
        const first = parsed.error.errors[0];
        return {
          ok: false,
          error: `Item ${i + 1} → ${first.path.join(".") || "raíz"}: ${first.message}`,
        };
      }
      const annotation = extractAnnotation(obj, RESERVED_KEYS_NORMA);
      items.push({
        tipo: "norma",
        external_id: parsed.data.id,
        institucion: parsed.data.institucion,
        num_norma: parsed.data.num_norma,
        texto_completo: parsed.data.texto_completo,
        fecha: parsed.data.fecha,
        enlace: parsed.data.enlace,
        annotation,
      });
    }
  }
  return { ok: true, items };
}

export const PL_TEMPLATE = {
  bcp: {
    comentario_experto: "Esta iniciativa va sobre chocolates",
    impacto: "Alto",
    urgencia: "Grave",
    area_interes: "Financiero",
  },
  num_proyecto: "1002",
  id: "1002_XY",
  periodo_parlamentario: "2021-2026",
  nivel: "Senado",
  texto_completo: "XXXXXXXXXXXXXXXXXXXXXXX",
  fecha_proyecto: "19/05/2026",
  grupo_parlamentario: "Fuerza Popular",
  autor: "Juan Pérez",
  ult_estado: "DICTAMEN",
  fecha_ult_estado: "19/08/2026",
  enlace: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/14594",
};

export const NORMA_TEMPLATE = {
  nombre_cliente: {
    comentario_experto: "Este es un comentario experto",
    impacto: "Grave",
    urgencia: "Alto",
    area_interes: "Financiero",
  },
  institucion: "MINSA",
  id: "109_XYZ",
  texto_completo: "XXXXXXX",
  fecha: "19/05/2026",
  num_norma: "109877-MINSA",
  enlace: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/14594",
};
