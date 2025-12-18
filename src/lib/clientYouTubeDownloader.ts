/**
 * Client-side YouTube audio extraction using Cobalt API
 * Cobalt has proper CORS support for browser requests
 */

// Cobalt instances with CORS support
const COBALT_INSTANCES = [
  'https://api.cobalt.tools',
  'https://co.wuk.sh',
  'https://cobalt-api.hyper.lol',
  'https://api-dl.cgm.rs',
  'https://cobalt.synzr.space',
  'https://capi.oak.li',
];

export interface AudioExtractionResult {
  audioUrl: string;
  durationSeconds: number;
  title: string;
}

/**
 * Try to get audio URL from Cobalt API (supports CORS)
 */
async function tryCobaltClient(videoId: string): Promise<AudioExtractionResult | null> {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  for (const instance of COBALT_INSTANCES) {
    try {
      console.log(`[Client Cobalt] Trying ${instance}...`);
      
      // Cobalt API v10 format
      const response = await fetch(instance, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoUrl,
          downloadMode: 'audio',
          audioFormat: 'mp3',
        }),
        signal: AbortSignal.timeout(30000),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`[Client Cobalt] ${instance} returned ${response.status}: ${errorText.substring(0, 100)}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`[Client Cobalt] Response from ${instance}:`, data.status);
      
      // Handle different response types
      let audioUrl: string | null = null;
      
      if (data.status === 'tunnel' || data.status === 'redirect') {
        audioUrl = data.url;
      } else if (data.status === 'stream') {
        audioUrl = data.url;
      } else if (data.status === 'picker' && data.picker?.length > 0) {
        // Multiple options - pick first audio
        const audioOption = data.picker.find((p: any) => p.type === 'audio') || data.picker[0];
        audioUrl = audioOption?.url;
      } else if (data.url) {
        audioUrl = data.url;
      }
      
      if (!audioUrl) {
        console.log(`[Client Cobalt] No audio URL in response from ${instance}`);
        continue;
      }
      
      console.log(`[Client Cobalt] Success from ${instance}`);
      
      return {
        audioUrl,
        durationSeconds: 0, // Cobalt doesn't provide duration
        title: videoId,
      };
      
    } catch (err) {
      console.log(`[Client Cobalt] ${instance} failed:`, err instanceof Error ? err.message : 'Unknown');
    }
  }
  
  return null;
}

/**
 * Fetch list of online Cobalt instances dynamically
 */
async function fetchCobaltInstances(): Promise<string[]> {
  try {
    console.log('[Client Cobalt] Fetching online instances...');
    const response = await fetch('https://instances.cobalt.best/api/instances.json', {
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) return COBALT_INSTANCES;
    
    const instances = await response.json();
    
    // Filter for online instances that support YouTube and don't have Turnstile
    const validInstances = instances
      .filter((inst: any) => 
        inst.online === true && 
        inst.turnstile === false &&
        inst.services?.includes('youtube')
      )
      .map((inst: any) => inst.api_url || inst.url)
      .filter((url: string) => url);
    
    console.log(`[Client Cobalt] Found ${validInstances.length} valid instances`);
    return validInstances.length > 0 ? validInstances : COBALT_INSTANCES;
    
  } catch (err) {
    console.log('[Client Cobalt] Could not fetch instances, using defaults');
    return COBALT_INSTANCES;
  }
}

/**
 * Extract audio URL from YouTube video (client-side with Cobalt)
 */
export async function extractYouTubeAudioClientSide(videoId: string): Promise<AudioExtractionResult> {
  console.log(`[Client YouTube] Starting extraction for video: ${videoId}`);
  
  // Get dynamic instances first
  const instances = await fetchCobaltInstances();
  
  // Try each instance
  for (const instance of instances.slice(0, 8)) { // Try up to 8 instances
    try {
      console.log(`[Client Cobalt] Trying ${instance}...`);
      
      const response = await fetch(instance, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          downloadMode: 'audio',
          audioFormat: 'mp3',
        }),
        signal: AbortSignal.timeout(30000),
      });
      
      if (!response.ok) {
        console.log(`[Client Cobalt] ${instance} returned ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      let audioUrl = data.url;
      if (data.status === 'picker' && data.picker?.length > 0) {
        audioUrl = data.picker[0]?.url;
      }
      
      if (audioUrl) {
        console.log(`[Client Cobalt] Success from ${instance}`);
        return { audioUrl, durationSeconds: 0, title: videoId };
      }
      
    } catch (err) {
      console.log(`[Client Cobalt] ${instance} failed:`, err instanceof Error ? err.message : 'Unknown');
    }
  }
  
  throw new Error('No se pudo extraer audio. Ningún servidor Cobalt disponible.');
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
  const mimeType = blob.type || 'audio/mpeg';
  
  console.log(`[Client] Downloaded ${(blob.size / 1024 / 1024).toFixed(2)} MB, type: ${mimeType}`);
  
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
