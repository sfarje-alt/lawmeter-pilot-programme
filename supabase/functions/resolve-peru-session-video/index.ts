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

// Fetch videos from channel using Search API with date filter
async function fetchChannelVideosByDate(
  apiKey: string, 
  targetDate: Date,
  maxResults: number = 50
): Promise<any[]> {
  // Search for videos published within ±1 day of target date
  const publishedAfter = new Date(targetDate);
  publishedAfter.setDate(publishedAfter.getDate() - 1);
  publishedAfter.setHours(0, 0, 0, 0);
  
  const publishedBefore = new Date(targetDate);
  publishedBefore.setDate(publishedBefore.getDate() + 2);
  publishedBefore.setHours(0, 0, 0, 0);
  
  const url = `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${CHANNEL_ID}&type=video&maxResults=${maxResults}` +
    `&publishedAfter=${publishedAfter.toISOString()}` +
    `&publishedBefore=${publishedBefore.toISOString()}` +
    `&key=${apiKey}`;
  
  console.log(`API URL (without key): search?channelId=${CHANNEL_ID}&type=video&maxResults=${maxResults}&publishedAfter=${publishedAfter.toISOString()}&publishedBefore=${publishedBefore.toISOString()}`);
  console.log(`Searching videos from ${publishedAfter.toISOString().substring(0, 10)} to ${publishedBefore.toISOString().substring(0, 10)}`);
  
  const response = await fetch(url);
  const responseText = await response.text();
  
  if (!response.ok) {
    console.error(`YouTube API error: ${response.status}`, responseText);
    throw new Error(`YouTube API error: ${response.status} - ${responseText}`);
  }
  
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error(`Failed to parse YouTube API response:`, responseText.substring(0, 500));
    throw new Error(`Invalid JSON from YouTube API`);
  }
  
  const items = data.items || [];
  console.log(`Found ${items.length} videos in date range`);
  
  // Verify we got videos from the correct channel
  if (items.length > 0) {
    const firstChannelId = items[0].snippet?.channelId;
    console.log(`First video channelId: ${firstChannelId}`);
    if (firstChannelId && firstChannelId !== CHANNEL_ID) {
      console.error(`⚠️ WARNING: Videos returned from wrong channel! Expected ${CHANNEL_ID}, got ${firstChannelId}`);
      console.error(`This suggests the API key may be restricted or the channelId filter isn't working.`);
    }
  }
  
  return items;
}

// Fetch videos with API key fallback
async function fetchVideosWithFallback(
  apiKeys: string[], 
  targetDate: Date,
  maxResults: number = 50
): Promise<{ videos: any[]; keyUsed: number }> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < apiKeys.length; i++) {
    try {
      console.log(`Trying API key ${i + 1} of ${apiKeys.length}`);
      const videos = await fetchChannelVideosByDate(apiKeys[i], targetDate, maxResults);
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

// Find video by commission name (date already filtered by API)
function findVideoByCommission(
  videos: any[], 
  commissionFullName: string
): { video: any; confidence: 'HIGH' | 'MEDIUM' } | null {
  const normalizedCommission = normalize(commissionFullName);
  
  console.log(`\n=== FILTERING BY COMMISSION ===`);
  console.log(`Looking for: "${commissionFullName}"`);
  console.log(`Normalized: "${normalizedCommission}"`);
  console.log(`Videos in date range: ${videos.length}`);
  
  // Show all videos found in date range
  console.log(`\nVideos found in date range:`);
  videos.forEach((v, i) => {
    const title = v.snippet?.title || "";
    console.log(`[${i}] "${title}"`);
  });
  
  // Filter by commission name in title
  const matchingVideos = videos.filter(video => {
    const title = normalize(video.snippet?.title || "");
    return title.includes(normalizedCommission);
  });
  
  console.log(`\nMatching videos: ${matchingVideos.length}`);
  
  if (matchingVideos.length === 0) {
    console.log(`❌ No videos de "${commissionFullName}" encontrados`);
    return null;
  }
  
  const video = matchingVideos[0];
  const confidence = matchingVideos.length === 1 ? 'HIGH' : 'MEDIUM';
  
  console.log(`✅ Match: "${video.snippet?.title}" (confidence: ${confidence})`);
  
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

    // Fetch videos from channel filtered by date (using Search API)
    const { videos, keyUsed } = await fetchVideosWithFallback(apiKeys, date, 50);
    console.log(`Videos fetched using API key ${keyUsed}`);

    // Find match using strict 3-step filtering
    const match = findVideoByCommission(videos, commissionFullName);

    if (match) {
      // Search API uses id.videoId, playlistItems uses snippet.resourceId.videoId
      const videoId = match.video.id?.videoId || match.video.snippet?.resourceId?.videoId;
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
