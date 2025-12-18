// Client-side YouTube audio extraction using Piped API
// Piped is a privacy-focused YouTube frontend that provides audio streams

interface AudioStream {
  url: string;
  mimeType: string;
  bitrate: number;
  contentLength?: number;
}

interface ExtractionResult {
  audioBase64: string;
  durationMinutes: number;
  mimeType: string;
}

// List of Piped instances to try
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.yt',
  'https://pipedapi.r4fo.com',
  'https://pipedapi.darkness.services',
];

/**
 * Extract audio from YouTube video using Piped API
 * Piped provides audio stream URLs that can be downloaded
 */
export async function extractYouTubeAudio(videoId: string): Promise<ExtractionResult | null> {
  console.log(`[Client YouTube] Starting audio extraction for: ${videoId}`);
  
  for (const instance of PIPED_INSTANCES) {
    try {
      console.log(`[Client YouTube] Trying Piped instance: ${instance}`);
      
      // Fetch video info from Piped API
      const response = await fetch(`${instance}/streams/${videoId}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.log(`[Client YouTube] Piped ${instance} returned ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.log(`[Client YouTube] Piped error: ${data.error}`);
        continue;
      }
      
      // Get duration
      const durationMinutes = (data.duration || 0) / 60;
      console.log(`[Client YouTube] Video duration: ${durationMinutes.toFixed(1)} minutes`);
      
      // Find audio streams
      const audioStreams: AudioStream[] = (data.audioStreams || [])
        .filter((s: any) => s.url && s.mimeType?.includes('audio'))
        .map((s: any) => ({
          url: s.url,
          mimeType: s.mimeType,
          bitrate: s.bitrate || 0,
          contentLength: s.contentLength
        }));
      
      console.log(`[Client YouTube] Found ${audioStreams.length} audio streams`);
      
      if (audioStreams.length === 0) {
        console.log(`[Client YouTube] No audio streams from ${instance}`);
        continue;
      }
      
      // Sort by bitrate (lowest first for faster download)
      audioStreams.sort((a, b) => a.bitrate - b.bitrate);
      
      // Try to download each audio stream
      for (const stream of audioStreams) {
        console.log(`[Client YouTube] Trying stream: ${stream.mimeType}, ${stream.bitrate}bps`);
        
        try {
          const audioResponse = await fetch(stream.url);
          
          if (!audioResponse.ok) {
            console.log(`[Client YouTube] Stream download failed: ${audioResponse.status}`);
            continue;
          }
          
          const audioBuffer = await audioResponse.arrayBuffer();
          
          if (audioBuffer.byteLength < 10000) {
            console.log(`[Client YouTube] Audio too small: ${audioBuffer.byteLength} bytes`);
            continue;
          }
          
          const audioBase64 = arrayBufferToBase64(audioBuffer);
          console.log(`[Client YouTube] Success: ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
          
          return { audioBase64, durationMinutes, mimeType: stream.mimeType };
          
        } catch (error) {
          console.log(`[Client YouTube] Stream download error:`, error);
          continue;
        }
      }
      
    } catch (error) {
      console.log(`[Client YouTube] Piped instance ${instance} failed:`, error);
      continue;
    }
  }
  
  console.log('[Client YouTube] All Piped instances failed');
  return null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB chunks to avoid call stack issues
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    result += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(result);
}
