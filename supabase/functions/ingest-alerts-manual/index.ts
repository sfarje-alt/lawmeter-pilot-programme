// Edge function: ingest-alerts-manual
// Subida manual de alertas (PL o Norma) desde el portal interno.
// Auth: JWT del usuario logueado (admin de una org marcada como "manual ingest").
// Schema esperado (Diez Canseco): items normalizados por el front (NormalizedItem[]).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { v5 as uuidv5 } from "https://esm.sh/uuid@9.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const NAMESPACE_OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8";
const ALLOWED_TIPOS = new Set(["norma", "pl"]);

const MANUAL_INGEST_ORG_IDS = new Set<string>([
  "b7e15500-0006-4000-8000-000000000001",
]);

const DEFAULT_CLIENT_FOR_ORG: Record<string, string> = {
  "b7e15500-0006-4000-8000-000000000001":
    "b7e15500-0007-4000-8000-000000000001",
};

// Mapeo de categorías a niveles internos (risk_level / urgency_level / impact_level).
function mapCategoria(value?: string | null): string | null {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (v === "grave") return "grave";
  if (v === "alto" || v === "alta") return "alto";
  if (v === "medio" || v === "media") return "medio";
  if (v === "leve" || v === "bajo" || v === "baja") return "leve";
  if (v === "positivo") return "positivo";
  return null;
}

interface ClientAnnotation {
  client_key?: string;
  comentario_experto?: string;
  impacto?: string;
  urgencia?: string;
  area_interes?: string[];
}

interface ManualItem {
  tipo: "pl" | "norma";
  external_id: string;
  // PL
  num_proyecto?: string;
  periodo_parlamentario?: string;
  nivel?: string;
  fecha_proyecto?: string;
  grupo_parlamentario?: string;
  autor?: string;
  ult_estado?: string;
  fecha_ult_estado?: string;
  // Norma
  institucion?: string;
  num_norma?: string;
  fecha?: string;
  // Comunes
  texto_completo?: string;
  enlace?: string;
  annotation?: ClientAnnotation | null;
}

interface ManualBody {
  tipo: "pl" | "norma";
  items: ManualItem[];
}

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

  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return new Response(JSON.stringify({ error: "missing_jwt" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "invalid_jwt" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const user = userData.user;

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: profile, error: profErr } = await admin
    .from("profiles")
    .select("organization_id, account_type")
    .eq("id", user.id)
    .maybeSingle();
  if (profErr || !profile?.organization_id) {
    return new Response(JSON.stringify({ error: "profile_not_found" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const orgId = profile.organization_id as string;
  if (!MANUAL_INGEST_ORG_IDS.has(orgId)) {
    return new Response(
      JSON.stringify({ error: "org_not_authorized_for_manual_ingest" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  if (profile.account_type !== "admin") {
    return new Response(JSON.stringify({ error: "admin_required" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const clientId = DEFAULT_CLIENT_FOR_ORG[orgId];
  if (!clientId) {
    return new Response(JSON.stringify({ error: "no_default_client" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: ManualBody;
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
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_body: requires tipo in ('norma','pl') and items[]",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let inserted = 0;
  let updated = 0;
  const failed: { external_id: string; error: string }[] = [];

  for (const item of body.items) {
    try {
      if (!item.external_id) throw new Error("missing external_id");
      const tipo = body.tipo;
      const seed = `${orgId}|${clientId}|${tipo}|${item.external_id}|v1`;
      const id = uuidv5(seed, NAMESPACE_OID);

      const { data: existing } = await admin
        .from("alerts")
        .select("id, status")
        .eq("id", id)
        .maybeSingle();

      const ann = item.annotation ?? null;
      const impactoLevel = mapCategoria(ann?.impacto);
      const urgenciaLevel = mapCategoria(ann?.urgencia);
      const areas = Array.isArray(ann?.area_interes) ? ann!.area_interes! : [];

      const titulo =
        tipo === "pl"
          ? `Proyecto de Ley N° ${item.num_proyecto ?? item.external_id}`
          : item.num_norma ?? item.external_id;

      const fechaPubIso =
        tipo === "norma" ? normalizeDate(item.fecha) : null;
      const fechaPresIso =
        tipo === "pl" ? normalizeDate(item.fecha_proyecto) : null;
      const fechaEstadoIso =
        tipo === "pl" ? normalizeDate(item.fecha_ult_estado) : null;

      const aiAnalysis = {
        impacto: null,
        urgencia: null,
        racional: [],
        fechas_identificadas: [],
        model: null,
        version: 1,
        ui_extras: {
          kanban_stage:
            tipo === "pl"
              ? (item.ult_estado ?? "comision").toString().toLowerCase()
              : "publicado",
          impact_level: impactoLevel,
          entity: tipo === "norma" ? item.institucion ?? null : null,
          publication_date: fechaPubIso,
          approval_probability: null,
          is_pinned_for_publication: false,
          client_commentaries: ann?.comentario_experto
            ? [
                {
                  client_key: ann.client_key ?? null,
                  comentario: ann.comentario_experto,
                },
              ]
            : [],
          source_label: item.enlace ?? null,
          manual_upload: true,
          raw: {
            periodo_parlamentario: item.periodo_parlamentario ?? null,
            nivel: item.nivel ?? null,
            grupo_parlamentario: item.grupo_parlamentario ?? null,
            fecha_ult_estado: fechaEstadoIso,
            texto_completo: item.texto_completo ?? null,
          },
        },
      };

      const baseRow: Record<string, unknown> = {
        id,
        organization_id: orgId,
        client_id: clientId,
        legislation_title: titulo,
        legislation_id: item.external_id,
        legislation_type: tipo,
        legislation_summary: item.texto_completo ?? null,
        ai_summary: ann?.comentario_experto ?? null,
        affected_areas: areas,
        risk_level: impactoLevel ?? "medio",
        urgency_level: urgenciaLevel ?? "medio",
        deadline: fechaPubIso ?? fechaPresIso,
        published_at: fechaPubIso,
        source_url: item.enlace ?? null,
        ai_analysis: aiAnalysis,
        updated_at: new Date().toISOString(),

        url: item.enlace ?? null,
        fuente: tipo === "norma" ? item.institucion ?? null : null,
        comentario: ann?.comentario_experto ?? null,
        expert_commentary: ann?.comentario_experto ?? null,

        impacto: null,
        urgencia: null,
        impacto_categoria: ann?.impacto ?? null,
        urgencia_categoria: ann?.urgencia ?? null,

        area_de_interes: areas,
        racional: [],
        fechas_identificadas: [],

        // PL
        codigo: tipo === "pl" ? item.num_proyecto ?? null : null,
        estado_actual: tipo === "pl" ? item.ult_estado ?? null : null,
        estado_anterior: null,
        es_cambio_estado: null,
        seguimiento_hash: null,
        autores: tipo === "pl" && item.autor ? [item.autor] : [],
        proponente: tipo === "pl" ? item.grupo_parlamentario ?? null : null,
        fecha_presentacion: fechaPresIso,
        seguimiento: null,

        comision: null,
        fecha_sesion: null,

        // Norma
        fecha_publicacion: fechaPubIso,
        reference_number: tipo === "norma" ? item.num_norma ?? null : null,
        entity: tipo === "norma" ? item.institucion ?? null : null,
        sumilla: tipo === "norma" ? item.texto_completo ?? null : null,
      };

      if (!existing) {
        const { error: insErr } = await admin
          .from("alerts")
          .insert({ ...baseRow, status: "inbox" });
        if (insErr) throw insErr;
        inserted++;
      } else {
        const updateRow: Record<string, unknown> = { ...baseRow };
        delete updateRow.id;
        if (!existing.status || existing.status === "inbox") {
          updateRow.status = "inbox";
        }
        const { error: updErr } = await admin
          .from("alerts")
          .update(updateRow)
          .eq("id", id);
        if (updErr) throw updErr;
        updated++;
      }
    } catch (e) {
      failed.push({
        external_id: item.external_id ?? "unknown",
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
