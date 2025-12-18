import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// YouTube channel configuration
const CHANNEL_ID = "UC9HLcODpEZuBRLSKXZx5igw";
const UPLOADS_PLAYLIST_ID = "UU9HLcODpEZuBRLSKXZx5igw"; // UC → UU for uploads playlist

// Spanish month names
const MESES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

// Parse date from various formats (DD/MM/YYYY, DD/MM/YYYYTHH:MMAM, ISO)
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try ISO format first
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;
  
  // Handle DD/MM/YYYY formats with optional time
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1]);
    const month = parseInt(ddmmyyyyMatch[2]) - 1; // 0-indexed
    const year = parseInt(ddmmyyyyMatch[3]);
    
    // Create date at noon to avoid timezone issues
    date = new Date(year, month, day, 12, 0, 0);
    if (!isNaN(date.getTime())) return date;
  }
  
  // Handle YYYY-MM-DD format
  const yyyymmddMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (yyyymmddMatch) {
    const year = parseInt(yyyymmddMatch[1]);
    const month = parseInt(yyyymmddMatch[2]) - 1;
    const day = parseInt(yyyymmddMatch[3]);
    
    date = new Date(year, month, day, 12, 0, 0);
    if (!isNaN(date.getTime())) return date;
  }
  
  console.error(`Could not parse date: ${dateStr}`);
  return null;
}

// Strip emojis from text
function stripEmojis(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|🔴/gu, '')
    .trim();
}

// Normalize text for comparison (uppercase, no accents, no special chars)
function normalize(text: string): string {
  return stripEmojis(text)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, " ") // Replace special chars with space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

// Convert text to Spanish Title Case (preserving lowercase prepositions)
function toTitleCaseSpanish(text: string): string {
  const lowercaseWords = ['de', 'del', 'y', 'e', 'la', 'las', 'los', 'el', 'con', 'en', 'a'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // First word always capitalized, or if not a preposition
      if (index === 0 || !lowercaseWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

// Extract commission name from session title (PDF format)
// Examples:
// "SEXTA SESIÓN EXTRAORDINARIA DE LA COMISIÓN AGRARIA" → "Comisión Agraria"
// "OCTAVA SESIÓN DE LA COMISIÓN DE PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA" → "Comisión de Producción, Micro y Pequeña Empresa"
function extractCommissionFromTitle(sessionTitle: string): string | null {
  if (!sessionTitle) return null;
  
  // Look for "COMISIÓN" or "COMISION" and capture everything after
  const regex = /COMISI[OÓ]N\s+(DE\s+)?(.+)/i;
  const match = sessionTitle.match(regex);
  
  if (!match) {
    console.log(`Could not extract commission from title: "${sessionTitle}"`);
    return null;
  }
  
  // match[1] = "DE " or undefined
  // match[2] = rest of the commission name
  const hasDePrefix = !!match[1];
  const commissionPart = match[2].trim();
  
  // Convert to Title Case
  const titleCaseName = toTitleCaseSpanish(commissionPart);
  
  // Build the full commission name with proper prefix
  const result = hasDePrefix 
    ? `Comisión de ${titleCaseName}` 
    : `Comisión ${titleCaseName}`;
  
  console.log(`Extracted from "${sessionTitle}" → "${result}"`);
  return result;
}

// Build date pattern for filtering (e.g., "24 DE NOVIEMBRE DEL 2025")
function buildDatePattern(date: Date): string {
  const day = date.getDate();
  const month = MESES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DEL ${year}`;
}

// Build expected YouTube title using extracted commission name
function buildExpectedTitle(commissionFullName: string, date: Date): string {
  const day = date.getDate();
  const month = MESES[date.getMonth()];
  const year = date.getFullYear();
  
  // Commission name already includes "Comisión" and proper prefix
  return `EN VIVO: ${commissionFullName} | ${day} DE ${month} DEL ${year}`;
}

// Check if error is a quota exceeded error
function isQuotaError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('403') || error.message.includes('quota');
  }
  return false;
}

// Fetch videos from channel using uploads playlist
async function fetchChannelVideos(apiKey: string, maxResults: number = 50): Promise<any[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=${maxResults}&key=${apiKey}`;
  
  console.log(`Fetching videos from playlist: ${UPLOADS_PLAYLIST_ID}`);
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`YouTube API error: ${response.status}`, errorText);
    throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log(`Fetched ${data.items?.length || 0} videos from channel`);
  
  return data.items || [];
}

// Fetch videos with API key fallback
async function fetchChannelVideosWithFallback(
  apiKeys: string[], 
  maxResults: number = 50
): Promise<{ videos: any[]; keyUsed: number }> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < apiKeys.length; i++) {
    try {
      console.log(`Trying API key ${i + 1} of ${apiKeys.length}`);
      const videos = await fetchChannelVideos(apiKeys[i], maxResults);
      console.log(`Successfully fetched videos using API key ${i + 1}`);
      return { videos, keyUsed: i + 1 };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (isQuotaError(error)) {
        console.log(`API key ${i + 1} quota exceeded, trying next key...`);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error("All API keys exhausted - quota exceeded on all keys");
}

// STRICT 3-STEP FILTERING: No fallbacks, no false positives
function findVideoStrictMatch(
  videos: any[], 
  commissionFullName: string, 
  date: Date
): { video: any; confidence: 'HIGH' | 'MEDIUM' } | null {
  const datePattern = buildDatePattern(date);
  const normalizedCommission = normalize(commissionFullName);
  
  console.log(`\n=== STRICT FILTERING PIPELINE ===`);
  console.log(`Looking for: "${commissionFullName}"`);
  console.log(`Date pattern: "${datePattern}"`);
  console.log(`FILTRO 1: ${videos.length} videos del canal`);
  
  // === FILTRO 2: Solo videos con la fecha exacta (OBLIGATORIO) ===
  const videosWithDate = videos.filter(video => {
    const title = normalize(video.snippet?.title || "");
    return title.includes(normalize(datePattern));
  });
  
  console.log(`FILTRO 2: ${videosWithDate.length} videos con fecha "${datePattern}"`);
  
  if (videosWithDate.length === 0) {
    console.log("❌ No hay videos para esta fecha - NO FALLBACK, retornando null");
    return null;
  }
  
  // === FILTRO 3: El título contiene el nombre de la comisión (OBLIGATORIO) ===
  const videosWithCommission = videosWithDate.filter(video => {
    const title = normalize(video.snippet?.title || "");
    return title.includes(normalizedCommission);
  });
  
  console.log(`FILTRO 3: ${videosWithCommission.length} videos con comisión "${commissionFullName}"`);
  
  if (videosWithCommission.length === 0) {
    console.log(`❌ No hay videos de "${commissionFullName}" en fecha ${datePattern} - retornando null`);
    // Log what videos were found for this date (for debugging)
    videosWithDate.forEach(v => {
      console.log(`  - Video en esta fecha: "${v.snippet?.title}"`);
    });
    return null;
  }
  
  // Éxito: retornar el primer match
  const video = videosWithCommission[0];
  const confidence = videosWithCommission.length === 1 ? 'HIGH' : 'MEDIUM';
  
  console.log(`✅ Match encontrado: "${video.snippet?.title}" (confidence: ${confidence})`);
  
  return { video, confidence };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get both API keys
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    const YOUTUBE_API_KEY_2 = Deno.env.get("YOUTUBE_API_KEY_2");
    
    const apiKeys: string[] = [];
    if (YOUTUBE_API_KEY) apiKeys.push(YOUTUBE_API_KEY);
    if (YOUTUBE_API_KEY_2) apiKeys.push(YOUTUBE_API_KEY_2);
    
    if (apiKeys.length === 0) {
      console.error("No YouTube API keys configured");
      return new Response(
        JSON.stringify({ error: "YouTube API key not configured", found: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Available API keys: ${apiKeys.length}`);

    const { commissionName, sessionTitle, scheduledDate } = await req.json();
    
    if (!scheduledDate) {
      return new Response(
        JSON.stringify({ error: "Missing scheduledDate", found: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`\n=== RESOLVING VIDEO ===`);
    console.log(`Commission name: ${commissionName}`);
    console.log(`Session title: ${sessionTitle}`);
    console.log(`Scheduled date: ${scheduledDate}`);

    // Parse date
    const date = parseDate(scheduledDate);
    if (!date) {
      console.error(`Failed to parse date: ${scheduledDate}`);
      return new Response(
        JSON.stringify({ error: `Invalid date format: ${scheduledDate}`, found: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log(`Parsed date: ${date.toISOString()}`);

    // === EXTRACT COMMISSION NAME FROM SESSION TITLE ===
    let commissionFullName: string;
    
    if (sessionTitle) {
      const extracted = extractCommissionFromTitle(sessionTitle);
      if (extracted) {
        commissionFullName = extracted;
        console.log(`✅ Extracted from session title: "${commissionFullName}"`);
      } else {
        // Fallback: use commission_name with Title Case
        commissionFullName = `Comisión ${toTitleCaseSpanish(commissionName || '')}`;
        console.log(`⚠️ Fallback to commission_name: "${commissionFullName}"`);
      }
    } else if (commissionName) {
      commissionFullName = `Comisión ${toTitleCaseSpanish(commissionName)}`;
      console.log(`Using commission_name (no sessionTitle): "${commissionFullName}"`);
    } else {
      return new Response(
        JSON.stringify({ error: "Missing commissionName or sessionTitle", found: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build expected title for logging
    const expectedTitle = buildExpectedTitle(commissionFullName, date);
    console.log(`Expected YouTube title: "${expectedTitle}"`);

    // Fetch videos from channel
    const { videos, keyUsed } = await fetchChannelVideosWithFallback(apiKeys, 100);
    console.log(`Videos fetched using API key ${keyUsed}`);

    // Find match using strict 3-step filtering
    const match = findVideoStrictMatch(videos, commissionFullName, date);

    if (match) {
      const videoId = match.video.snippet?.resourceId?.videoId || match.video.id?.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const actualTitle = match.video.snippet?.title || "";

      console.log(`\n=== VIDEO FOUND ===`);
      console.log(`Video ID: ${videoId}`);
      console.log(`Actual title: ${actualTitle}`);

      return new Response(
        JSON.stringify({
          found: true,
          videoId,
          videoUrl,
          expectedTitle,
          actualTitle,
          confidence: match.confidence,
          method: "STRICT_FILTER",
          channelId: CHANNEL_ID,
          channelName: "Congreso de la República del Perú",
          apiKeyUsed: keyUsed,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("\n=== VIDEO NOT FOUND ===");
    return new Response(
      JSON.stringify({
        found: false,
        expectedTitle,
        searchedVideos: videos.length,
        message: `No se encontró video de "${commissionFullName}" para la fecha indicada`,
        apiKeyUsed: keyUsed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in resolve-peru-session-video:", error);
    
    const isAllQuotaExhausted = error instanceof Error && 
      error.message.includes("All API keys exhausted");
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error", 
        found: false,
        quotaExhausted: isAllQuotaExhausted,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
