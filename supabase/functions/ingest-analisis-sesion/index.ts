// Recibe callbacks del backend Python (PROCESSING / COMPLETED / FAILED)
// y actualiza public.sesiones. Auth: Bearer LOVABLE_INGEST_TOKEN (mismo
// secret que usa ingest-sesiones, llamado INGEST_TOKEN en este proyecto).

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Acepta tanto LOVABLE_INGEST_TOKEN como INGEST_TOKEN (el existente).
const INGEST_TOKEN =
  Deno.env.get("LOVABLE_INGEST_TOKEN") ?? Deno.env.get("INGEST_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED = new Set([
  "analysis_status",
  "analysis_started_at",
  "analysis_completed_at",
  "analysis_error",
  "analysis_model",
  "analysis_cost_usd",
  "transcript_duration_s",
  "impacto",
  "urgencia",
  "impacto_categoria",
  "urgencia_categoria",
  "resumen_ejecutivo",
  "comentario",
  "puntos_clave",
  "area_de_interes",
  "racional",
  "recomendaciones",
  "transcript_excerpt",
  "video_url",
]);

const VALID_STATUS = new Set(["PROCESSING", "COMPLETED", "FAILED"]);

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const auth = req.headers.get("Authorization") ?? "";
  if (auth !== `Bearer ${INGEST_TOKEN}`) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid body" }, 400);
  }

  const externalId = String(body.external_id ?? "").trim();
  const status = String(body.analysis_status ?? "").trim();
  if (!externalId) return json({ error: "external_id required" }, 400);
  if (!VALID_STATUS.has(status)) {
    return json({ error: "invalid analysis_status" }, 400);
  }

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (ALLOWED.has(k)) patch[k] = v;
  }

  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await client
    .from("sesiones")
    .update(patch)
    .eq("external_id", externalId)
    .select("external_id")
    .maybeSingle();
  if (error) return json({ error: "db error", detail: error.message }, 500);
  if (!data) return json({ error: "sesion not found" }, 404);

  return json({ ok: true });
});
