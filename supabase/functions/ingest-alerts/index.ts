// Edge function: ingest-alerts
// Idempotent upsert of alerts (tipo="norma") for external ingestion scripts.
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

interface IngestItem {
  alerta_id: string;
  external_id: string;
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
  source?: {
    entidad?: string;
    fecha_publicacion?: string;
    url?: string;
  };
}

interface IngestBody {
  tipo: string;
  organization_id: string;
  client_id: string;
  items: IngestItem[];
}

function pickDeadline(fechas?: FechaItem[]): string | null {
  if (!Array.isArray(fechas)) return null;
  const hit = fechas.find(
    (f) => f.rol === "plazo" || f.rol === "vigencia_inicio",
  );
  return hit?.fecha ?? null;
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
    body.tipo !== "norma" ||
    !body.organization_id ||
    !body.client_id ||
    !Array.isArray(body.items)
  ) {
    return new Response(
      JSON.stringify({
        error:
          "invalid_body: requires tipo='norma', organization_id, client_id, items[]",
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
      if (!item.external_id || !item.titulo) {
        throw new Error("missing external_id or titulo");
      }
      const version = item.version ?? 1;
      const seed = `${body.organization_id}|${body.client_id}|${body.tipo}|${item.external_id}|v${version}`;
      const id = uuidv5(seed, NAMESPACE_OID);

      // Check if exists (and capture preserved fields)
      const { data: existing, error: selErr } = await supabase
        .from("alerts")
        .select(
          "id, status, expert_commentary, reviewed_at, reviewed_by, review_notes, created_at",
        )
        .eq("id", id)
        .maybeSingle();

      if (selErr) throw selErr;

      const aiAnalysis = {
        impacto: item.impacto ?? null,
        urgencia: item.urgencia ?? null,
        racional: item.racional ?? [],
        fechas_identificadas: item.fechas_identificadas ?? [],
        model: item.model ?? null,
        version,
        alerta_id: item.alerta_id,
        generated_at: item.generated_at ?? null,
        ui_extras: {
          kanban_stage: "publicado",
          impact_level: item.impacto_categoria
            ? (IMPACT_TO_LEVEL[item.impacto_categoria] ?? null)
            : null,
          entity: item.source?.entidad ?? null,
          publication_date: item.source?.fecha_publicacion ?? null,
          approval_probability: null,
          is_pinned_for_publication: false,
          client_commentaries: [],
        },
      };

      const baseRow: Record<string, unknown> = {
        id,
        organization_id: body.organization_id,
        client_id: body.client_id,
        legislation_title: item.titulo,
        legislation_id: item.external_id,
        legislation_type: body.tipo,
        legislation_summary: item.resumen ?? null,
        ai_summary: item.comentario ?? null,
        affected_areas: item.area_de_interes ?? [],
        risk_level: item.impacto_categoria
          ? (IMPACT_TO_RISK[item.impacto_categoria] ?? "medium")
          : "medium",
        urgency_level: item.urgencia_categoria
          ? item.urgencia_categoria.toLowerCase()
          : "media",
        deadline: pickDeadline(item.fechas_identificadas),
        published_at: item.source?.fecha_publicacion ?? null,
        source_url: item.source?.url ?? null,
        ai_analysis: aiAnalysis,
        updated_at: new Date().toISOString(),
      };

      if (!existing) {
        // INSERT
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
        // UPDATE — preserve editorial fields
        const updateRow: Record<string, unknown> = { ...baseRow };
        // Do NOT touch: created_at, status (if !== "inbox"), expert_commentary,
        // reviewed_at, reviewed_by, review_notes
        delete updateRow.id;
        if (existing.status && existing.status !== "inbox") {
          // keep existing status — do nothing, don't include in update
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
