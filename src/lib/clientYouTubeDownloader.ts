/**
 * Client-side YouTube audio extraction
 * Uses Piped/Invidious APIs from browser (bypasses server IP blocks)
 */

// Piped instances - these work from browsers but get blocked from servers
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.yt',
  'https://pipedapi.r4fo.com',
  'https://pipedapi.leptons.xyz',
  'https://pipedapi.syncpundit.io',
];

// Invidious instances
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.fdn.fr',
  'https://invidious.nerdvpn.de',
  'https://vid.puffyan.us',
];

export interface AudioExtractionResult {
  audioUrl: string;
  durationSeconds: number;
  title: string;
}

/**
 * Try to get audio URL from Piped API (client-side request)
 */
async function tryPipedClient(videoId: string): Promise<AudioExtractionResult | null> {
  for (const instance of PIPED_INSTANCES) {
    try {
      console.log(`[Client Piped] Trying ${instance}...`);
      
      const response = await fetch(`${instance}/streams/${videoId}`, {
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) {
        console.log(`[Client Piped] ${instance} returned ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      // Get audio streams
      const audioStreams = data.audioStreams || [];
      if (audioStreams.length === 0) {
        console.log(`[Client Piped] No audio streams from ${instance}`);
        continue;
      }
      
      // Sort by quality and prefer mp4/m4a
      const sortedStreams = audioStreams
        .filter((s: any) => s.url)
        .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
      
      const preferredStream = sortedStreams.find((s: any) => 
        s.mimeType?.includes('mp4') || s.mimeType?.includes('m4a')
      ) || sortedStreams[0];
      
      if (!preferredStream?.url) continue;
      
      console.log(`[Client Piped] Success from ${instance}: ${preferredStream.mimeType}, ${preferredStream.bitrate}bps`);
      
      return {
        audioUrl: preferredStream.url,
        durationSeconds: data.duration || 0,
        title: data.title || videoId,
      };
      
    } catch (err) {
      console.log(`[Client Piped] ${instance} failed:`, err instanceof Error ? err.message : 'Unknown');
    }
  }
  
  return null;
}

/**
 * Try to get audio URL from Invidious API (client-side request)
 */
async function tryInvidiousClient(videoId: string): Promise<AudioExtractionResult | null> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      console.log(`[Client Invidious] Trying ${instance}...`);
      
      const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) {
        console.log(`[Client Invidious] ${instance} returned ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      // Get adaptive formats (audio only)
      const audioFormats = (data.adaptiveFormats || [])
        .filter((f: any) => f.type?.startsWith('audio/') && f.url);
      
      if (audioFormats.length === 0) {
        console.log(`[Client Invidious] No audio formats from ${instance}`);
        continue;
      }
      
      // Sort by bitrate
      const sortedFormats = audioFormats.sort((a: any, b: any) => 
        (b.bitrate || 0) - (a.bitrate || 0)
      );
      
      const preferredFormat = sortedFormats.find((f: any) => 
        f.type?.includes('mp4') || f.type?.includes('m4a')
      ) || sortedFormats[0];
      
      console.log(`[Client Invidious] Success from ${instance}: ${preferredFormat.type}`);
      
      return {
        audioUrl: preferredFormat.url,
        durationSeconds: data.lengthSeconds || 0,
        title: data.title || videoId,
      };
      
    } catch (err) {
      console.log(`[Client Invidious] ${instance} failed:`, err instanceof Error ? err.message : 'Unknown');
    }
  }
  
  return null;
}

/**
 * Extract audio URL from YouTube video (client-side)
 * Returns URL that can be used to download audio
 */
export async function extractYouTubeAudioClientSide(videoId: string): Promise<AudioExtractionResult> {
  console.log(`[Client YouTube] Starting extraction for video: ${videoId}`);
  
  // Try Piped first (better success rate from browsers)
  const pipedResult = await tryPipedClient(videoId);
  if (pipedResult) {
    return pipedResult;
  }
  
  // Try Invidious
  const invidiousResult = await tryInvidiousClient(videoId);
  if (invidiousResult) {
    return invidiousResult;
  }
  
  throw new Error('No se pudo extraer audio. Todos los servicios fallaron.');
}

/**
 * Download audio from URL and convert to base64
 */
export async function downloadAudioAsBase64(audioUrl: string): Promise<{ base64: string; mimeType: string }> {
  console.log(`[Client] Downloading audio from URL...`);
  
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.status}`);
  }
  
  const blob = await response.blob();
  const mimeType = blob.type || 'audio/mp4';
  
  console.log(`[Client] Downloaded ${(blob.size / 1024 / 1024).toFixed(2)} MB, type: ${mimeType}`);
  
  // Convert to base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
