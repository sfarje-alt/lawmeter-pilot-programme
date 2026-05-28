import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { checkIngestToken, corsHeaders } from "../_shared/auth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const authErr = checkIngestToken(req);
  if (authErr) return authErr;
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const b = await req.json();
    const required = [
      "organization_id",
      "client_id",
      "cliente_slug",
      "cliente_nombre",
      "periodo_desde",
      "periodo_hasta",
      "modelo",
      "formatos",
      "idioma",
      "paises",
      "pipelines",
      "archivos",
    ];
    for (const k of required) {
      if (b[k] === undefined || b[k] === null) {
        return new Response(JSON.stringify({ error: "missing_field", field: k }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    const row = {
      organization_id: b.organization_id,
      client_id: b.client_id,
      cliente_slug: b.cliente_slug,
      cliente_nombre: b.cliente_nombre,
      periodo_desde: b.periodo_desde,
      periodo_hasta: b.periodo_hasta,
      modelo: b.modelo,
      formatos: b.formatos,
      idioma: b.idioma ?? "es",
      paises: b.paises,
      pipelines: b.pipelines,
      archivos: b.archivos,
      total_pl: b.total_pl ?? 0,
      total_normas: b.total_normas ?? 0,
      total_sesiones: b.total_sesiones ?? 0,
      decisiones_requeridas: b.decisiones_requeridas ?? 0,
      expert_comments_count: b.expert_comments_count ?? 0,
      generated_at: b.generated_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Upsert on (client_id, periodo_hasta, modelo) — fall back to plain insert if no constraint
    const { data, error } = await sb
      .from("reports")
      .upsert(row, { onConflict: "client_id,periodo_hasta,modelo" })
      .select()
      .single();

    if (error) {
      // If upsert conflict target missing, retry as insert
      const { data: ins, error: insErr } = await sb.from("reports").insert(row).select().single();
      if (insErr) {
        return new Response(JSON.stringify({ error: "db_error", details: insErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true, report: ins }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, report: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "invalid_request", details: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
