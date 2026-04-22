// Edge function: ingest-sesiones
// Idempotent upsert of Congress sessions for the daily backend cron.
// Auth: Bearer token (env INGEST_TOKEN).
// NOTE: never overwrites analysis_* fields; those are managed by ingest-analisis-sesion.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SesionPayload {
  external_id: string;
  commission_name: string;
  commission_normalized?: string;
  session_title?: string | null;
  scheduled_at?: string | null;
  scheduled_date_text?: string | null;
  agenda_url?: string | null;
  agenda_markdown?: string | null;
  agenda_scraped_at?: string | null;
  video_url?: string | null;
  video_resolved_at?: string | null;
  es_de_interes?: boolean;
}

interface IngestBody {
  organization_id: string;
  client_id: string;
  items: SesionPayload[];
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toUpperCase()
    .trim()
    .replace(/\s+/g, " ");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const CHUNK_SIZE = 200;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Auth
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const expected = Deno.env.get("INGEST_TOKEN");
  if (!expected || token !== expected) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // Parse body
  let body: IngestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (!body?.organization_id || !body?.client_id || !Array.isArray(body.items)) {
    return jsonResponse(
      { error: "Missing organization_id, client_id, or items" },
      400,
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let failed = 0;
  const errors: Array<{ external_id?: string; error: string }> = [];

  // Process in chunks
  for (let i = 0; i < body.items.length; i += CHUNK_SIZE) {
    const chunk = body.items.slice(i, i + CHUNK_SIZE);

    for (const item of chunk) {
      processed++;
      try {
        if (!item.external_id || !item.commission_name) {
          throw new Error("Missing external_id or commission_name");
        }

        const commissionNormalized =
          item.commission_normalized && item.commission_normalized.trim().length > 0
            ? normalize(item.commission_normalized)
            : normalize(item.commission_name);

        // Check if exists to track inserted vs updated
        const { data: existing } = await supabase
          .from("sesiones")
          .select("id")
          .eq("external_id", item.external_id)
          .maybeSingle();

        const row = {
          external_id: item.external_id,
          organization_id: body.organization_id,
          client_id: body.client_id,
          commission_name: item.commission_name,
          commission_normalized: commissionNormalized,
          session_title: item.session_title ?? null,
          scheduled_at: item.scheduled_at ?? null,
          scheduled_date_text: item.scheduled_date_text ?? null,
          agenda_url: item.agenda_url ?? null,
          agenda_markdown: item.agenda_markdown ?? null,
          agenda_scraped_at: item.agenda_scraped_at ?? null,
          video_url: item.video_url ?? null,
          video_resolved_at: item.video_resolved_at ?? null,
          es_de_interes: item.es_de_interes ?? false,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from("sesiones")
          .upsert(row, { onConflict: "external_id" });

        if (upsertError) throw upsertError;

        if (existing) updated++;
        else inserted++;
      } catch (err) {
        failed++;
        errors.push({
          external_id: item.external_id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  return jsonResponse({
    processed,
    inserted,
    updated,
    failed,
    errors: errors.slice(0, 50),
  });
});
