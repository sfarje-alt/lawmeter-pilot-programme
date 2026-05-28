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
  const only_active = url.searchParams.get("only_active") !== "false";
  if (!client_id) {
    return new Response(JSON.stringify({ error: "missing_param", param: "client_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  let q = sb
    .from("client_email_recipients")
    .select("id, email, nombre, kind, activo, notes, organization_id, client_id")
    .eq("client_id", client_id);
  if (only_active) q = q.eq("activo", true);

  const { data, error } = await q;
  if (error) {
    return new Response(JSON.stringify({ error: "db_error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const to = (data ?? []).filter((r) => r.kind === "to").map((r) => r.email);
  const cc = (data ?? []).filter((r) => r.kind === "cc").map((r) => r.email);
  const bcc = (data ?? []).filter((r) => r.kind === "bcc").map((r) => r.email);

  return new Response(JSON.stringify({ recipients: data ?? [], to, cc, bcc }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
