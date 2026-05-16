import { z } from "zod";

const categoria = z.enum(["Alta", "Media", "Baja"]);

const baseItem = z.object({
  external_id: z.string().min(1, "external_id requerido"),
  titulo: z.string().min(1, "titulo requerido"),
  resumen: z.string().optional(),
  comentario: z.string().optional(),
  impacto_categoria: categoria.optional(),
  urgencia_categoria: categoria.optional(),
  area_de_interes: z.array(z.string()).optional(),
  url: z.string().optional(),
  fuente: z.string().optional(),
});

const plItem = baseItem.extend({
  fecha_presentacion: z.string().optional(),
  codigo: z.string().optional(),
  estado_actual: z.string().optional(),
  autores: z.array(z.string()).optional(),
  proponente: z.string().optional(),
});

const normaItem = baseItem.extend({
  fecha_publicacion: z.string().optional(),
  entity: z.string().optional(),
  reference_number: z.string().optional(),
  sumilla: z.string().optional(),
});

export const manualPLPayloadSchema = z.object({
  tipo: z.literal("pl"),
  items: z.array(plItem).min(1, "Debe incluir al menos 1 item"),
});

export const manualNormaPayloadSchema = z.object({
  tipo: z.literal("norma"),
  items: z.array(normaItem).min(1, "Debe incluir al menos 1 item"),
});

export type ManualPLPayload = z.infer<typeof manualPLPayloadSchema>;
export type ManualNormaPayload = z.infer<typeof manualNormaPayloadSchema>;
export type ManualPayload = ManualPLPayload | ManualNormaPayload;
export type ManualItem = ManualPayload["items"][number];

export function parseManualPayload(
  raw: unknown,
  tipo: "pl" | "norma",
): { ok: true; data: ManualPayload } | { ok: false; error: string } {
  const schema = tipo === "pl" ? manualPLPayloadSchema : manualNormaPayloadSchema;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return {
      ok: false,
      error: `${first.path.join(".") || "raíz"}: ${first.message}`,
    };
  }
  return { ok: true, data: parsed.data };
}

export const PL_TEMPLATE: ManualPLPayload = {
  tipo: "pl",
  items: [
    {
      external_id: "PL-00001-2026",
      titulo: "Proyecto de Ley que regula ejemplo",
      resumen: "Breve resumen del proyecto de ley.",
      comentario: "Comentario interno del equipo legal.",
      impacto_categoria: "Alta",
      urgencia_categoria: "Media",
      area_de_interes: ["Energía", "Regulación"],
      url: "https://www.congreso.gob.pe/...",
      fuente: "Congreso de la República",
      fecha_presentacion: "15/05/2026",
      codigo: "00001/2026-CR",
      estado_actual: "Comisión",
      autores: ["Apellido, Nombre"],
      proponente: "Bancada X",
    },
  ],
};

export const NORMA_TEMPLATE: ManualNormaPayload = {
  tipo: "norma",
  items: [
    {
      external_id: "DS-001-2026-EM",
      titulo: "Decreto Supremo Nº 001-2026-EM",
      resumen: "Resumen de la norma publicada.",
      comentario: "Comentario interno del equipo legal.",
      impacto_categoria: "Media",
      urgencia_categoria: "Alta",
      area_de_interes: ["Minería"],
      url: "https://busquedas.elperuano.pe/...",
      fuente: "El Peruano",
      fecha_publicacion: "10/05/2026",
      entity: "Ministerio de Energía y Minas",
      reference_number: "DS-001-2026-EM",
      sumilla: "Sumilla oficial de la norma.",
    },
  ],
};
