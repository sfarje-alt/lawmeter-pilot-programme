import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface DispatchBody {
  client_id: string;
  cliente: string;
  ultimos_dias?: string;
  desde?: string | null;
  hasta?: string | null;
  modelo?: string;
  formato?: string;
  idioma?: string;
  paises?: string;
  enviar_email?: string;
  destinatarios?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("authorization") ?? "" },
        },
      },
    );

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as DispatchBody;
    if (!body?.client_id || !body?.cliente) {
      return new Response(JSON.stringify({ error: "missing_fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate the client belongs to user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return new Response(JSON.stringify({ error: "no_organization" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id, organization_id")
      .eq("id", body.client_id)
      .single();

    if (!client || client.organization_id !== profile.organization_id) {
      return new Response(JSON.stringify({ error: "client_not_in_org" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pat = Deno.env.get("GITHUB_PAT_REPO_DISPATCH");
    const repo = Deno.env.get("GITHUB_REPO"); // "owner/repo"
    if (!pat || !repo) {
      return new Response(
        JSON.stringify({ error: "github_not_configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const ghRes = await fetch(
      `https://api.github.com/repos/${repo}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          event_type: "generate_report",
          client_payload: {
            cliente: body.cliente,
            ultimos_dias: body.ultimos_dias ?? "15",
            desde: body.desde ?? null,
            hasta: body.hasta ?? null,
            modelo: (body.modelo ?? "").trim(),
            formato: body.formato ?? "pdf",
            idioma: body.idioma ?? "es",
            paises: body.paises ?? "PE",
            enviar_email: body.enviar_email ?? "yes",
            destinatarios: body.destinatarios ?? "",
            triggered_by: user.email ?? user.id,
            organization_id: profile.organization_id,
            client_id: body.client_id,
          },
        }),
      },
    );

    if (!ghRes.ok) {
      const txt = await ghRes.text();
      console.error("github dispatch failed", ghRes.status, txt);
      return new Response(
        JSON.stringify({ error: "github_dispatch_failed", detail: txt }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ ok: true, queued: true }), {
      status: 202,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "internal_error", message: String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
