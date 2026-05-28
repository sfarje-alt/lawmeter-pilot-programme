export function checkIngestToken(req: Request): Response | null {
  const expected = Deno.env.get("INGEST_TOKEN");
  if (!expected) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const auth = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
