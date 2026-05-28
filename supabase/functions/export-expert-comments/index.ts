import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { checkIngestToken, corsHeaders } from "../_shared/auth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const authErr = checkIngestToken(req);
  if (authErr) return authErr;
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const client_id = url.searchParams.get("client_id");
  const periodo_desde = url.searchParams.get("periodo_desde");
  const periodo_hasta = url.searchParams.get("periodo_hasta");
  if (!client_id) {
    return new Response(JSON.stringify({ error: "missing_param", param: "client_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Alerts with expert commentary for the client
  let alertsQ = sb
    .from("alerts")
    .select(
      "id, client_id, organization_id, legislation_title, legislation_type, codigo, status, published_at, expert_commentary, reviewed_at, reviewed_by, fecha_publicacion, fecha_presentacion, source_url, url",
    )
    .eq("client_id", client_id)
    .not("expert_commentary", "is", null)
    .neq("expert_commentary", "");

  if (periodo_desde) alertsQ = alertsQ.gte("updated_at", `${periodo_desde}T00:00:00Z`);
  if (periodo_hasta) alertsQ = alertsQ.lte("updated_at", `${periodo_hasta}T23:59:59Z`);

  const { data: alerts, error: aErr } = await alertsQ;
  if (aErr) {
    return new Response(JSON.stringify({ error: "db_error", details: aErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Sessions with comentario for the client
  let sesionesQ = sb
    .from("sesiones")
    .select(
      "id, client_id, organization_id, session_title, commission_name, scheduled_at, comentario, resumen_ejecutivo, recomendaciones, video_url",
    )
    .eq("client_id", client_id)
    .not("comentario", "is", null)
    .neq("comentario", "");

  if (periodo_desde) sesionesQ = sesionesQ.gte("updated_at", `${periodo_desde}T00:00:00Z`);
  if (periodo_hasta) sesionesQ = sesionesQ.lte("updated_at", `${periodo_hasta}T23:59:59Z`);

  const { data: sesiones, error: sErr } = await sesionesQ;
  if (sErr) {
    return new Response(JSON.stringify({ error: "db_error", details: sErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      client_id,
      periodo_desde,
      periodo_hasta,
      alerts: alerts ?? [],
      sesiones: sesiones ?? [],
      total: (alerts?.length ?? 0) + (sesiones?.length ?? 0),
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
