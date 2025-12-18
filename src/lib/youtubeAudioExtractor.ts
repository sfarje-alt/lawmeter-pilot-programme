// Client-side YouTube audio extraction
// This runs in the user's browser, bypassing bot detection

interface AudioFormat {
  url: string;
  mimeType: string;
  bitrate: number;
  contentLength?: string;
}

interface ExtractionResult {
  audioBase64: string;
  durationMinutes: number;
  mimeType: string;
}

/**
 * Extract audio from YouTube video using client-side fetch
 * This works because the user's browser is not detected as a bot
 */
export async function extractYouTubeAudio(videoId: string): Promise<ExtractionResult | null> {
  console.log(`[Client YouTube] Starting audio extraction for: ${videoId}`);
  
  try {
    // Step 1: Fetch the YouTube watch page
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Use a CORS proxy to fetch YouTube page from browser
    // YouTube blocks cross-origin requests, so we need a proxy
    const proxyUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(watchUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(watchUrl)}`,
    ];
    
    let html: string | null = null;
    
    for (const proxyUrl of proxyUrls) {
      try {
        console.log(`[Client YouTube] Trying proxy: ${proxyUrl.substring(0, 50)}...`);
        const response = await fetch(proxyUrl, {
          headers: {
            'Accept': 'text/html',
          }
        });
        
        if (response.ok) {
          html = await response.text();
          if (html && html.includes('ytInitialPlayerResponse')) {
            console.log(`[Client YouTube] Got page via proxy`);
            break;
          }
        }
      } catch (e) {
        console.log(`[Client YouTube] Proxy failed:`, e);
      }
    }
    
    if (!html) {
      console.log('[Client YouTube] Could not fetch YouTube page');
      return null;
    }
    
    // Step 2: Extract ytInitialPlayerResponse
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
    if (!playerResponseMatch) {
      console.log('[Client YouTube] No ytInitialPlayerResponse found');
      return null;
    }

    const playerResponse = JSON.parse(playerResponseMatch[1]);
    
    // Check playability
    const playability = playerResponse?.playabilityStatus;
    if (playability?.status !== 'OK') {
      console.log(`[Client YouTube] Video not playable: ${playability?.status} - ${playability?.reason}`);
      return null;
    }

    // Get duration
    const durationSeconds = parseInt(playerResponse?.videoDetails?.lengthSeconds || '0');
    const durationMinutes = durationSeconds / 60;
    console.log(`[Client YouTube] Video duration: ${durationMinutes.toFixed(1)} minutes`);

    // Step 3: Get streaming data
    const streamingData = playerResponse?.streamingData;
    if (!streamingData) {
      console.log('[Client YouTube] No streaming data');
      return null;
    }

    // Find audio formats
    const adaptiveFormats = streamingData.adaptiveFormats || [];
    const audioFormats: AudioFormat[] = adaptiveFormats
      .filter((f: any) => f.mimeType?.startsWith('audio/') && f.url)
      .map((f: any) => ({
        url: f.url,
        mimeType: f.mimeType,
        bitrate: f.bitrate || 0,
        contentLength: f.contentLength
      }));

    console.log(`[Client YouTube] Found ${audioFormats.length} audio formats with URLs`);

    if (audioFormats.length === 0) {
      // Check if there are formats that need signature decoding
      const signedFormats = adaptiveFormats.filter((f: any) => 
        f.mimeType?.startsWith('audio/') && f.signatureCipher
      );
      if (signedFormats.length > 0) {
        console.log(`[Client YouTube] Found ${signedFormats.length} formats requiring signature decode (not supported)`);
      }
      return null;
    }

    // Sort by bitrate (lowest first for faster download, still good for STT)
    audioFormats.sort((a, b) => a.bitrate - b.bitrate);

    // Step 4: Download audio
    for (const format of audioFormats) {
      console.log(`[Client YouTube] Trying: ${format.mimeType}, ${format.bitrate}bps`);
      
      try {
        // Try direct fetch (may work for some videos)
        const audioResponse = await fetch(format.url, {
          headers: {
            'Range': 'bytes=0-',
          }
        });

        if (!audioResponse.ok) {
          console.log(`[Client YouTube] Direct fetch failed: ${audioResponse.status}`);
          
          // Try via CORS proxy
          const proxyAudioUrl = `https://corsproxy.io/?${encodeURIComponent(format.url)}`;
          const proxyResponse = await fetch(proxyAudioUrl);
          
          if (!proxyResponse.ok) {
            console.log(`[Client YouTube] Proxy fetch also failed`);
            continue;
          }
          
          const audioBuffer = await proxyResponse.arrayBuffer();
          if (audioBuffer.byteLength < 10000) {
            console.log(`[Client YouTube] Audio too small via proxy`);
            continue;
          }
          
          const audioBase64 = arrayBufferToBase64(audioBuffer);
          console.log(`[Client YouTube] Success via proxy: ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
          
          return { audioBase64, durationMinutes, mimeType: format.mimeType };
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        
        if (audioBuffer.byteLength < 10000) {
          console.log(`[Client YouTube] Audio too small: ${audioBuffer.byteLength} bytes`);
          continue;
        }

        const audioBase64 = arrayBufferToBase64(audioBuffer);
        console.log(`[Client YouTube] Success: ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
        
        return { audioBase64, durationMinutes, mimeType: format.mimeType };
        
      } catch (error) {
        console.log(`[Client YouTube] Format download error:`, error);
        continue;
      }
    }

    console.log('[Client YouTube] All audio formats failed');
    return null;

  } catch (error) {
    console.error('[Client YouTube] Error:', error);
    return null;
  }
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
