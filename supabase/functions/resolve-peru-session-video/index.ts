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

// Commission name mappings (truncated → full name)
const COMISIONES_COMPLETAS: Record<string, string> = {
  "Agraria": "Agraria",
  "Ciencia, Innovación y Tecnología": "Ciencia, Innovación y Tecnología",
  "Comercio Exterior y Turismo": "Comercio Exterior y Turismo",
  "Constitución y Reglamento": "Constitución y Reglamento",
  "Cultura y Patrimonio Cultural": "Cultura y Patrimonio Cultural",
  "Defensa del Consumidor": "Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
  "Defensa Nacional": "Defensa Nacional, Orden Interno, Desarrollo Alternativo y Lucha contra las Drogas",
  "Descentralización": "Descentralización, Regionalización, Gobiernos Locales y Modernización de la Gestión del Estado",
  "Economía": "Economía, Banca, Finanzas e Inteligencia Financiera",
  "Educación": "Educación, Juventud y Deporte",
  "Energía y Minas": "Energía y Minas",
  "Fiscalización y Contraloría": "Fiscalización y Contraloría",
  "Inclusión Social": "Inclusión Social y Personas con Discapacidad",
  "Inteligencia": "Inteligencia",
  "Justicia": "Justicia y Derechos Humanos",
  "Mujer y Familia": "Mujer y Familia",
  "Presupuesto": "Presupuesto y Cuenta General de la República",
  "Producción": "Producción, Micro y Pequeña Empresa y Cooperativas",
  "Pueblos Andinos": "Pueblos Andinos, Amazónicos y Afroperuanos, Ambiente y Ecología",
  "Relaciones Exteriores": "Relaciones Exteriores",
  "Salud": "Salud y Población",
  "Trabajo": "Trabajo y Seguridad Social",
  "Transportes": "Transportes y Comunicaciones",
  "Vivienda": "Vivienda y Construcción",
};

// Commissions that don't use "de" prefix
const COMISIONES_SIN_DE = ["Agraria", "Inteligencia"];

// Subcommissions with their parent commission
const SUBCOMISIONES: Record<string, string> = {
  "Acusaciones Constitucionales": "Constitución y Reglamento",
  "de Acusaciones Constitucionales": "Constitución y Reglamento",
};

// Parse date from various formats (DD/MM/YYYY, DD/MM/YYYYTHH:MMAM, ISO)
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try ISO format first
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;
  
  // Handle DD/MM/YYYY formats with optional time
  // Examples: "17/12/2025", "17/12/2025 2:15AM", "17/12/2025T2:15AM:00"
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

// Normalize text for comparison
function normalize(text: string): string {
  return stripEmojis(text)
    .toUpperCase() // Use uppercase for better Spanish matching
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, " ") // Replace special chars with space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

// Build date pattern for filtering (e.g., "24 DE NOVIEMBRE DEL 2025")
function buildDatePattern(date: Date): string {
  const day = date.getDate();
  const month = MESES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DEL ${year}`;
}

// Calculate Jaccard similarity between two strings
function jaccardSimilarity(str1: string, str2: string): number {
  const set1 = new Set(normalize(str1).split(" "));
  const set2 = new Set(normalize(str2).split(" "));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Format commission name for title
function formatCommissionName(name: string): string {
  // Check if it's a subcommission
  for (const [subName, parent] of Object.entries(SUBCOMISIONES)) {
    if (name.includes(subName)) {
      return `Sub${subName}`;
    }
  }
  
  // Try to match truncated names
  for (const [truncated, full] of Object.entries(COMISIONES_COMPLETAS)) {
    if (name.includes(truncated) || truncated.includes(name.substring(0, 15))) {
      return full;
    }
  }
  
  return name;
}

// Build expected YouTube title
function buildExpectedTitle(commissionName: string, date: Date): string {
  const formattedName = formatCommissionName(commissionName);
  const day = date.getDate();
  const month = MESES[date.getMonth()];
  const year = date.getFullYear();
  
  // Determine if we use "de" prefix
  const prefix = COMISIONES_SIN_DE.some(c => formattedName.includes(c)) 
    ? "" 
    : "de ";
  
  return `EN VIVO: Comisión ${prefix}${formattedName} | ${day} DE ${month} DEL ${year}`;
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

// Filter videos by date pattern first, then find best match
function findBestMatch(
  expectedTitle: string, 
  videos: any[], 
  date: Date,
  threshold: number = 0.4
): { video: any; similarity: number; method: string } | null {
  const normalizedExpected = normalize(expectedTitle);
  const datePattern = buildDatePattern(date);
  
  console.log(`Looking for date pattern: ${datePattern}`);
  
  // STEP 1: Filter videos that contain the correct date
  const videosWithCorrectDate = videos.filter(video => {
    const title = video.snippet?.title || "";
    const normalizedTitle = normalize(title);
    return normalizedTitle.includes(datePattern);
  });
  
  console.log(`Found ${videosWithCorrectDate.length} videos matching date: ${datePattern}`);
  
  // If we have videos with the correct date, search only those
  const searchPool = videosWithCorrectDate.length > 0 ? videosWithCorrectDate : videos;
  
  let bestMatch: { video: any; similarity: number; method: string } | null = null;
  
  for (const video of searchPool) {
    const videoTitle = video.snippet?.title || "";
    const normalizedTitle = normalize(videoTitle);
    
    // Exact match (after normalization)
    if (normalizedTitle === normalizedExpected) {
      return { video, similarity: 1.0, method: "EXACT_NORMALIZED" };
    }
    
    // Contains check (after stripping emojis)
    const strippedExpected = normalize(expectedTitle);
    if (normalizedTitle.includes(strippedExpected) || strippedExpected.includes(normalizedTitle)) {
      const similarity = Math.max(normalizedTitle.length, strippedExpected.length) > 0
        ? Math.min(normalizedTitle.length, strippedExpected.length) / Math.max(normalizedTitle.length, strippedExpected.length)
        : 0;
      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { video, similarity, method: "CONTAINS" };
      }
      continue;
    }
    
    // Jaccard similarity
    const similarity = jaccardSimilarity(videoTitle, expectedTitle);
    
    // If video has correct date, boost the threshold acceptance
    const hasCorrectDate = videosWithCorrectDate.includes(video);
    const effectiveThreshold = hasCorrectDate ? 0.3 : threshold;
    
    if (similarity >= effectiveThreshold && (!bestMatch || similarity > bestMatch.similarity)) {
      bestMatch = { video, similarity, method: hasCorrectDate ? "DATE_MATCH_JACCARD" : "JACCARD" };
    }
  }
  
  return bestMatch;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (!YOUTUBE_API_KEY) {
      console.error("YOUTUBE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "YouTube API key not configured", found: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { commissionName, scheduledDate } = await req.json();
    
    if (!commissionName || !scheduledDate) {
      return new Response(
        JSON.stringify({ error: "Missing commissionName or scheduledDate", found: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Resolving video for: ${commissionName} on ${scheduledDate}`);

    // Parse date using our custom parser
    const date = parseDate(scheduledDate);
    if (!date) {
      console.error(`Failed to parse date: ${scheduledDate}`);
      return new Response(
        JSON.stringify({ error: `Invalid date format: ${scheduledDate}`, found: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log(`Parsed date: ${date.toISOString()}, day=${date.getDate()}, month=${date.getMonth()}, year=${date.getFullYear()}`);

    // Build expected title
    const expectedTitle = buildExpectedTitle(commissionName, date);
    console.log(`Expected title: ${expectedTitle}`);

    // Fetch videos from channel
    const videos = await fetchChannelVideos(YOUTUBE_API_KEY, 100);

    // Find best match (now with date filtering)
    const match = findBestMatch(expectedTitle, videos, date, 0.4);

    if (match) {
      const videoId = match.video.snippet?.resourceId?.videoId || match.video.id?.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const actualTitle = match.video.snippet?.title || "";
      
      // Determine confidence based on similarity
      let confidence: "HIGH" | "MEDIUM" | "LOW";
      if (match.similarity >= 0.8 || match.method === "EXACT_NORMALIZED") {
        confidence = "HIGH";
      } else if (match.similarity >= 0.6) {
        confidence = "MEDIUM";
      } else {
        confidence = "LOW";
      }

      console.log(`Match found: ${actualTitle} (similarity: ${match.similarity}, method: ${match.method})`);

      return new Response(
        JSON.stringify({
          found: true,
          videoId,
          videoUrl,
          expectedTitle,
          actualTitle,
          similarity: match.similarity,
          method: match.method,
          confidence,
          channelId: CHANNEL_ID,
          channelName: "Congreso de la República del Perú",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("No matching video found");
    return new Response(
      JSON.stringify({
        found: false,
        expectedTitle,
        searchedVideos: videos.length,
        message: "No matching video found in channel uploads",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in resolve-peru-session-video:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error", 
        found: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
