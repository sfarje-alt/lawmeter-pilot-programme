// Solicita análisis IA on-demand de una sesión.
// 1. Valida JWT del usuario.
// 2. Verifica RLS sobre la sesión.
// 3. Marca analysis_status = 'REQUESTED'.
// 4. Dispara repository_dispatch en GitHub Actions (backend Python).

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_GITHUB_REPO = "sfarje-alt/lawmeter-backend";

function normalizeGithubRepo(raw: string | null | undefined): string | null {
  const value = (raw ?? "")
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/^\/+|\/+$/g, "");

  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value) ? value : null;
}

function githubPermissionHelp(repo: string): string {
  return `Verifica que el token tenga acceso al repositorio ${repo}, permiso repo (classic) o Contents: Read and write (fine-grained), y autorización SSO si pertenece a una organización.`;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  const githubPat = Deno.env.get("GITHUB_PAT_REPO_DISPATCH")?.trim();
  const githubRepo = normalizeGithubRepo(
    Deno.env.get("GITHUB_REPO") ?? DEFAULT_GITHUB_REPO,
  );

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }
  if (!githubPat) {
    return json({ error: "missing github token configuration" }, 500);
  }
  if (!githubRepo) {
    return json(
      {
        error: "invalid github repo configuration",
        detail: "Usa owner/repo o https://github.com/owner/repo",
      },
      500,
    );
  }

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: { external_id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid body" }, 400);
  }
  const externalId = (body.external_id ?? "").trim();
  if (!externalId) return json({ error: "external_id required" }, 400);

  // Cliente con JWT del usuario para respetar RLS.
  const userClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false },
  });

  const token = auth.replace("Bearer ", "");
  const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims?.sub) {
    return json({ error: "unauthorized" }, 401);
  }
  const userId = claimsData.claims.sub;

  const { data: sesion, error: selErr } = await userClient
    .from("sesiones")
    .select("external_id, organization_id, client_id, analysis_status")
    .eq("external_id", externalId)
    .maybeSingle();
  if (selErr) return json({ error: "db error", detail: selErr.message }, 500);
  if (!sesion) return json({ error: "sesion not found" }, 404);

  if (!["NOT_REQUESTED", "FAILED"].includes(sesion.analysis_status)) {
    return json(
      { error: "already in progress", current_status: sesion.analysis_status },
      409,
    );
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const { error: updErr } = await adminClient
    .from("sesiones")
    .update({
      analysis_status: "REQUESTED",
      analysis_requested_at: new Date().toISOString(),
      analysis_requested_by: userId,
      analysis_error: null,
    })
    .eq("external_id", externalId);
  if (updErr) return json({ error: "db error", detail: updErr.message }, 500);

  // Disparar GitHub Actions
  let ghResp: Response;
  try {
    ghResp = await fetch(
      `https://api.github.com/repos/${githubRepo}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubPat}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
          "User-Agent": "lawmeter-lovable",
        },
        body: JSON.stringify({
          event_type: "analyze_sesion",
          client_payload: {
            external_id: externalId,
            requested_by: userId,
            organization_id: sesion.organization_id,
            client_id: sesion.client_id,
          },
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    await adminClient
      .from("sesiones")
      .update({
        analysis_status: "FAILED",
        analysis_error: `github dispatch network error: ${detail}`,
      })
      .eq("external_id", externalId);
    return json({ error: "github dispatch failed", detail }, 502);
  }

  if (!ghResp.ok) {
    const detail = await ghResp.text();
    const help = ghResp.status === 403 ? githubPermissionHelp(githubRepo) : null;
    await adminClient
      .from("sesiones")
      .update({
        analysis_status: "FAILED",
        analysis_error: help
          ? `GitHub no autorizó el dispatch. ${help}`
          : `github dispatch ${ghResp.status}: ${detail.slice(0, 500)}`,
      })
      .eq("external_id", externalId);
    return json(
      {
        error:
          ghResp.status === 403
            ? "GitHub no autorizó el dispatch"
            : "github dispatch failed",
        code:
          ghResp.status === 403
            ? "GITHUB_DISPATCH_FORBIDDEN"
            : "GITHUB_DISPATCH_FAILED",
        status: ghResp.status,
        detail,
        help,
        repo: githubRepo,
      },
      ghResp.status === 403 ? 403 : 502,
    );
  }

  return json({ status: "REQUESTED", estimated_seconds: 300 });
});
