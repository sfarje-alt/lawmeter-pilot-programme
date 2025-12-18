import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranscribeRequest {
  audioBase64: string;
  mimeType?: string;
  languageCode?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBase64, mimeType = 'audio/mp4', languageCode = 'es' }: TranscribeRequest = await req.json();
    
    if (!audioBase64) {
      throw new Error('audioBase64 is required');
    }

    const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY');
    if (!ASSEMBLYAI_API_KEY) {
      throw new Error('ASSEMBLYAI_API_KEY not configured');
    }

    console.log(`[AssemblyAI] Received audio: ${(audioBase64.length * 0.75 / 1024 / 1024).toFixed(2)} MB (base64), mimeType: ${mimeType}`);

    // Step 1: Upload audio to AssemblyAI
    console.log('[AssemblyAI] Uploading audio...');
    const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: audioBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[AssemblyAI] Upload failed:', errorText);
      throw new Error(`AssemblyAI upload failed: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    const uploadUrl = uploadResult.upload_url;
    console.log('[AssemblyAI] Upload successful, URL:', uploadUrl.substring(0, 50) + '...');

    // Step 2: Create transcription job
    console.log('[AssemblyAI] Creating transcription job...');
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
        language_code: languageCode,
      }),
    });

    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text();
      console.error('[AssemblyAI] Transcript creation failed:', errorText);
      throw new Error(`AssemblyAI transcript creation failed: ${transcriptResponse.status}`);
    }

    const transcriptJob = await transcriptResponse.json();
    const transcriptId = transcriptJob.id;
    console.log('[AssemblyAI] Transcription job created:', transcriptId);

    // Step 3: Poll for completion
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
        },
      });

      if (!pollResponse.ok) {
        throw new Error(`Polling failed: ${pollResponse.status}`);
      }

      const pollResult = await pollResponse.json();
      console.log(`[AssemblyAI] Poll ${attempts + 1}: status=${pollResult.status}`);

      if (pollResult.status === 'completed') {
        console.log('[AssemblyAI] Transcription completed successfully');
        return new Response(JSON.stringify({
          transcription: pollResult.text,
          language: languageCode,
          tier: 'assemblyai',
          confidence: pollResult.confidence,
          words: pollResult.words?.length || 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (pollResult.status === 'error') {
        console.error('[AssemblyAI] Transcription error:', pollResult.error);
        throw new Error(`Transcription failed: ${pollResult.error}`);
      }

      attempts++;
    }

    throw new Error('Transcription timeout after 5 minutes');

  } catch (error) {
    console.error('[AssemblyAI] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: 'ASSEMBLYAI_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
