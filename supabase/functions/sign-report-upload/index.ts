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
    const body = await req.json();
    const { cliente_slug, periodo_hasta, filename } = body ?? {};
    if (!cliente_slug || !periodo_hasta || !filename) {
      return new Response(
        JSON.stringify({ error: "missing_fields", required: ["cliente_slug", "periodo_hasta", "filename"] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const key = `${cliente_slug}/${periodo_hasta}/${filename}`;
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data, error } = await sb.storage.from("reports").createSignedUploadUrl(key);
    if (error || !data) {
      return new Response(JSON.stringify({ error: "sign_failed", details: error?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/reports/${key}`;

    return new Response(
      JSON.stringify({
        upload_url: data.signedUrl,
        key: data.path,
        token: data.token,
        public_url: publicUrl,
        expires_in: 300,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "invalid_request", details: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
