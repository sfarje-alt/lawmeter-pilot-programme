// Edge function: ingest-alerts
// Idempotent upsert of alerts (tipo="norma" | "pl" | "sesion") for external ingestion scripts.
// Auth: Bearer token (env INGEST_TOKEN).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { v5 as uuidv5 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Standard OID namespace (RFC 4122)
const NAMESPACE_OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8";

const ALLOWED_TIPOS = new Set(["norma", "pl", "sesion"]);

const IMPACT_TO_RISK: Record<string, string> = {
  Alta: "grave",
  Media: "medio",
  Baja: "leve",
};

const IMPACT_TO_LEVEL: Record<string, string> = {
  Alta: "grave",
  Media: "medio",
  Baja: "leve",
};

interface FechaItem {
  fecha: string;
  rol: string;
  contexto?: string;
}

interface SourceRefBlock {
  // legacy / canonical
  entidad?: string;
  fecha_publicacion?: string;
  url?: string;
  sumilla?: string;
  reference_number?: string;
  fuente?: string;
  // new producer fields
  entity?: string;
  date?: string; // DD/MM/YYYY or ISO
}

interface IngestItem {
  alerta_id?: string;
  external_id?: string;
  tipo?: string;
  titulo: string;
  resumen?: string;
  comentario?: string;
  impacto?: number;
  urgencia?: number;
  impacto_categoria?: "Alta" | "Media" | "Baja";
  urgencia_categoria?: "Alta" | "Media" | "Baja";
  area_de_interes?: string[];
  racional?: string[];
  fechas_identificadas?: FechaItem[];
  model?: string;
  version?: number;
  generated_at?: string;
  source?: SourceRefBlock;
  source_ref?: SourceRefBlock;
  ui_extras?: Record<string, unknown>;

  // Top-level common fields (productor los manda en raíz)
  url?: string;
  fuente?: string;
  entity?: string;
  sumilla?: string;
  reference_number?: string;
  fecha_publicacion?: string;

  // PL-specific
  codigo?: string;
  estado_actual?: string;
  estado_anterior?: string | null;
  es_cambio_estado?: boolean;
  seguimiento_hash?: string;
  autores?: string[];
  proponente?: string;
  fecha_presentacion?: string;
  seguimiento?: Array<{
    fecha?: string;
    estado_procesal?: string;
    comision?: string[];
    detalle?: string;
    adjuntos?: Array<{ url?: string }>;
  }>;

  // Sesion-specific
  comision?: string;
  fecha_sesion?: string;

  // Cliente echo
  cliente_id?: string;
  cliente_nombre?: string;
}

interface IngestBody {
  tipo: string;
  organization_id: string;
  client_id: string;
  items: IngestItem[];
}

/** Normalize a date string to ISO YYYY-MM-DD. Accepts DD/MM/YYYY or ISO. */
function normalizeDate(s: string | undefined | null): string | null {
  if (!s) return null;
  const trimmed = String(s).trim();
  if (!trimmed) return null;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const d = dmy[1].padStart(2, "0");
    const m = dmy[2].padStart(2, "0");
    const y = dmy[3];
    return `${y}-${m}-${d}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getUTCFullYear();
    const m = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const d = String(parsed.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
}

/** Resolve fuente label: prefer top-level, then source_ref, infer from URL host. */
function resolveFuenteLabel(item: IngestItem, src: SourceRefBlock, urlResolved: string | null): string | null {
  const raw = item.fuente ?? src.fuente ?? null;
  if (raw && !/^https?:\/\//i.test(raw)) {
    // Map slugs comunes a labels legibles
    const slug = raw.toLowerCase();
    if (slug === "el_peruano") return "El Peruano";
    if (slug === "congreso") return "Congreso de la República";
    if (slug === "spij") return "SPIJ";
    return raw;
  }
  const url = (raw && /^https?:\/\//i.test(raw)) ? raw : urlResolved;
  if (!url) return null;
  if (/elperuano\./i.test(url)) return "El Peruano";
  if (/spij\./i.test(url)) return "SPIJ";
  if (/congreso\.gob\.pe/i.test(url)) return "Congreso de la República";
  return url;
}

/** Read source block accepting both `source_ref` and `source`, normalizing field names. */
function readSourceRef(item: IngestItem) {
  const src: SourceRefBlock = { ...(item.source ?? {}), ...(item.source_ref ?? {}) };
  // URL: priorizar top-level item.url, luego source_ref.url, luego source_ref.fuente si es URL
  const url =
    item.url ??
    src.url ??
    (src.fuente && /^https?:\/\//i.test(src.fuente) ? src.fuente : null) ??
    null;
  const fuenteLabel = resolveFuenteLabel(item, src, url);
  return {
    entity: item.entity ?? src.entity ?? src.entidad ?? null,
    reference_number: item.reference_number ?? src.reference_number ?? null,
    url,
    fuente_label: fuenteLabel,
    fecha_publicacion_iso: normalizeDate(
      item.fecha_publicacion ?? src.date ?? src.fecha_publicacion,
    ),
    sumilla: item.sumilla ?? src.sumilla ?? null,
  };
}

/** Pick publication date with priority: top-level/source_ref → fechas_identificadas[publicacion]. */
function pickPublicationDate(item: IngestItem, srcDateIso: string | null): string | null {
  if (srcDateIso) return srcDateIso;
  const fechas = item.fechas_identificadas;
  if (!Array.isArray(fechas)) return null;
  const pubRoles = ["publicacion", "publicación", "published", "publication"];
  const hit = fechas.find((f) => pubRoles.includes(String(f.rol ?? "").toLowerCase()));
  return hit ? normalizeDate(hit.fecha) : null;
}

/** Pick deadline: priority across plazo / vencimiento / vigencia / entrada_vigor. */
function pickDeadline(tipo: string, item: IngestItem): string | null {
  if (tipo === "sesion" && item.fecha_sesion) {
    return normalizeDate(item.fecha_sesion);
  }
  const fechas = item.fechas_identificadas;
  if (!Array.isArray(fechas)) return null;
  const roles =
    tipo === "sesion"
      ? ["sesion", "plazo", "vencimiento", "vigencia_inicio", "entrada_vigor"]
      : ["plazo", "vencimiento", "vigencia_inicio", "entrada_vigor"];
  for (const r of roles) {
    const hit = fechas.find((f) => String(f.rol ?? "").toLowerCase() === r);
    if (hit) return normalizeDate(hit.fecha);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Auth
  const expected = Deno.env.get("INGEST_TOKEN");
  if (!expected) {
    return new Response(
      JSON.stringify({ error: "server_misconfigured_no_token" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (token !== expected) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Body
  let body: IngestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (
    !body ||
    !ALLOWED_TIPOS.has(body.tipo) ||
    !body.organization_id ||
    !body.client_id ||
    !Array.isArray(body.items)
  ) {
    return new Response(
      JSON.stringify({
        error:
          "invalid_body: requires tipo in ('norma','pl','sesion'), organization_id, client_id, items[]",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let inserted = 0;
  let updated = 0;
  const failed: { alerta_id: string; error: string }[] = [];

  for (const item of body.items) {
    try {
      const externalId = item.external_id ?? item.alerta_id;
      if (!externalId || !item.titulo) {
        throw new Error("missing external_id/alerta_id or titulo");
      }
      const tipo = body.tipo;
      const version = item.version ?? 1;
      const seed = `${body.organization_id}|${body.client_id}|${tipo}|${externalId}|v${version}`;
      const id = uuidv5(seed, NAMESPACE_OID);

      const { data: existing, error: selErr } = await supabase
        .from("alerts")
        .select(
          "id, status, expert_commentary, reviewed_at, reviewed_by, review_notes, created_at",
        )
        .eq("id", id)
        .maybeSingle();

      if (selErr) throw selErr;

      const src = readSourceRef(item);
      const fechaPubIso = pickPublicationDate(item, src.fecha_publicacion_iso);
      const deadlineIso = pickDeadline(tipo, item);

      const sumillaResolved =
        src.sumilla ??
        (tipo === "norma" ? (item.resumen ?? item.comentario ?? null) : (item.resumen ?? null));

      const aiAnalysis = {
        impacto: item.impacto ?? null,
        urgencia: item.urgencia ?? null,
        racional: item.racional ?? [],
        fechas_identificadas: item.fechas_identificadas ?? [],
        model: item.model ?? null,
        version,
        alerta_id: item.alerta_id ?? null,
        generated_at: item.generated_at ?? null,
        ui_extras: {
          kanban_stage:
            tipo === "pl"
              ? (item.estado_actual ?? "comision").toLowerCase()
              : tipo === "sesion"
                ? "sesion"
                : "publicado",
          impact_level: item.impacto_categoria
            ? (IMPACT_TO_LEVEL[item.impacto_categoria] ?? null)
            : null,
          entity:
            src.entity ??
            (tipo === "sesion" ? (item.comision ?? null) : null),
          publication_date: fechaPubIso,
          approval_probability: null,
          is_pinned_for_publication: false,
          client_commentaries: [],
          source_client: item.cliente_id || item.cliente_nombre
            ? { id: item.cliente_id ?? null, name: item.cliente_nombre ?? null }
            : null,
          source_ref_raw: { ...(item.source ?? {}), ...(item.source_ref ?? {}) },
          source_label: src.fuente_label,
          ...(item.ui_extras ?? {}),
        },
      };

      const baseRow: Record<string, unknown> = {
        id,
        organization_id: body.organization_id,
        client_id: body.client_id,
        legislation_title: item.titulo,
        legislation_id: externalId,
        legislation_type: tipo,
        legislation_summary: item.resumen ?? item.comentario ?? null,
        ai_summary: item.comentario ?? null,
        affected_areas: Array.isArray(item.area_de_interes) ? item.area_de_interes : [],
        risk_level: item.impacto_categoria
          ? (IMPACT_TO_RISK[item.impacto_categoria] ?? "medium")
          : "medium",
        urgency_level: item.urgencia_categoria
          ? item.urgencia_categoria.toLowerCase()
          : "media",
        deadline: deadlineIso,
        published_at: fechaPubIso,
        source_url: src.url,
        ai_analysis: aiAnalysis,
        updated_at: new Date().toISOString(),

        // Common
        url: src.url,
        fuente: src.fuente_label,
        comentario: item.comentario ?? null,

        // Scores y categorías (tal cual del payload)
        impacto: typeof item.impacto === "number" ? item.impacto : null,
        urgencia: typeof item.urgencia === "number" ? item.urgencia : null,
        impacto_categoria: item.impacto_categoria ?? null,
        urgencia_categoria: item.urgencia_categoria ?? null,

        // Listas / JSON
        area_de_interes: Array.isArray(item.area_de_interes) ? item.area_de_interes : [],
        racional: Array.isArray(item.racional) ? item.racional : [],
        fechas_identificadas: Array.isArray(item.fechas_identificadas) ? item.fechas_identificadas : [],

        // PL-specific
        codigo: item.codigo ?? null,
        estado_actual: item.estado_actual ?? null,
        estado_anterior: item.estado_anterior ?? null,
        es_cambio_estado: item.es_cambio_estado ?? null,
        seguimiento_hash: item.seguimiento_hash ?? null,
        autores: Array.isArray(item.autores) ? item.autores : [],
        proponente: item.proponente ?? null,
        fecha_presentacion: normalizeDate(item.fecha_presentacion ?? null),

        // Sesion-specific
        comision: item.comision ?? null,
        fecha_sesion: normalizeDate(item.fecha_sesion ?? null),

        // Norma-specific (top-level for fast query/render)
        fecha_publicacion: fechaPubIso,
        reference_number: src.reference_number,
        entity: src.entity,
        sumilla: sumillaResolved,
      };

      if (!existing) {
        const insertRow = {
          ...baseRow,
          status: "inbox",
          expert_commentary: null,
        };
        const { error: insErr } = await supabase
          .from("alerts")
          .insert(insertRow);
        if (insErr) throw insErr;
        inserted++;
      } else {
        const updateRow: Record<string, unknown> = { ...baseRow };
        delete updateRow.id;
        if (existing.status && existing.status !== "inbox") {
          // preserve status
        } else {
          updateRow.status = "inbox";
        }
        const { error: updErr } = await supabase
          .from("alerts")
          .update(updateRow)
          .eq("id", id);
        if (updErr) throw updErr;
        updated++;
      }
    } catch (e) {
      failed.push({
        alerta_id: item.alerta_id ?? item.external_id ?? "unknown",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return new Response(
    JSON.stringify({
      processed: body.items.length,
      inserted,
      updated,
      failed,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
