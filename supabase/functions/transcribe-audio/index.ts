import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_FREE_MINUTES_PER_MONTH = 60;

interface TranscriptResult {
  transcription: string | null;
  tier?: 'google_stt' | 'whisper';
  error?: string;
  errorCode?: string;
  costWarning?: string;
}

async function getGoogleQuotaRemaining(supabase: any): Promise<number> {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const { data } = await supabase
    .from('stt_usage')
    .select('google_minutes_used')
    .eq('month', currentMonth)
    .maybeSingle();
  
  const used = data?.google_minutes_used || 0;
  return Math.max(0, GOOGLE_FREE_MINUTES_PER_MONTH - used);
}

async function updateGoogleUsage(supabase: any, minutesUsed: number): Promise<void> {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const { data: existing } = await supabase
    .from('stt_usage')
    .select('id, google_minutes_used')
    .eq('month', currentMonth)
    .maybeSingle();
  
  if (existing) {
    await supabase
      .from('stt_usage')
      .update({ 
        google_minutes_used: (existing.google_minutes_used || 0) + minutesUsed,
        last_updated: new Date().toISOString()
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('stt_usage')
      .insert({ month: currentMonth, google_minutes_used: minutesUsed });
  }
}

async function transcribeWithGoogleSTT(audioBase64: string, durationMinutes: number, supabase: any): Promise<TranscriptResult> {
  const googleApiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
  
  if (!googleApiKey) {
    return { transcription: null, error: 'Google Cloud API key not configured', errorCode: 'GOOGLE_NOT_CONFIGURED' };
  }
  
  const remainingMinutes = await getGoogleQuotaRemaining(supabase);
  console.log(`[Google STT] Remaining quota: ${remainingMinutes.toFixed(1)} minutes`);
  
  if (remainingMinutes <= 0) {
    return { transcription: null, error: 'Google Cloud free quota exhausted', errorCode: 'GOOGLE_QUOTA_EXHAUSTED' };
  }
  
  if (durationMinutes > remainingMinutes) {
    return { 
      transcription: null, 
      error: `Audio (${durationMinutes.toFixed(0)} min) exceeds quota (${remainingMinutes.toFixed(0)} min)`, 
      errorCode: 'GOOGLE_QUOTA_INSUFFICIENT' 
    };
  }
  
  console.log(`[Google STT] Transcribing ${durationMinutes.toFixed(1)} minutes of audio...`);
  
  try {
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS', // Common YouTube format
          sampleRateHertz: 48000,
          languageCode: 'es-PE',
          alternativeLanguageCodes: ['es-ES', 'es-419'],
          enableAutomaticPunctuation: true,
          model: 'latest_long'
        },
        audio: { content: audioBase64 }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Google STT] Error:', errorData);
      
      // Try with different encoding
      const retryResponse = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            encoding: 'OGG_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'es-PE',
            enableAutomaticPunctuation: true,
            model: 'latest_long'
          },
          audio: { content: audioBase64 }
        })
      });
      
      if (!retryResponse.ok) {
        return { transcription: null, error: `Google STT error: ${errorData.error?.message}`, errorCode: 'GOOGLE_STT_ERROR' };
      }
      
      const retryResult = await retryResponse.json();
      await updateGoogleUsage(supabase, durationMinutes);
      
      const transcription = retryResult.results
        ?.map((r: any) => r.alternatives?.[0]?.transcript || '')
        .join(' ')
        .trim();
      
      return { transcription: transcription || null, tier: 'google_stt' };
    }
    
    const result = await response.json();
    await updateGoogleUsage(supabase, durationMinutes);
    
    const transcription = result.results
      ?.map((r: any) => r.alternatives?.[0]?.transcript || '')
      .join(' ')
      .trim();
    
    if (!transcription) {
      return { transcription: null, error: 'Google STT returned empty result', errorCode: 'GOOGLE_EMPTY_RESULT' };
    }
    
    console.log(`[Google STT] Success: ${transcription.length} characters`);
    return { transcription, tier: 'google_stt' };
    
  } catch (error) {
    console.error('[Google STT] Error:', error);
    return { transcription: null, error: `Google STT failed: ${error instanceof Error ? error.message : 'Unknown'}`, errorCode: 'GOOGLE_STT_ERROR' };
  }
}

async function transcribeWithWhisper(audioBase64: string, durationMinutes: number, skipCostWarning: boolean, supabase: any): Promise<TranscriptResult> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    return { transcription: null, error: 'OpenAI Whisper not configured', errorCode: 'WHISPER_NOT_CONFIGURED' };
  }
  
  const estimatedCost = durationMinutes * 0.006;
  
  if (!skipCostWarning && durationMinutes > 5) {
    return { 
      transcription: null, 
      errorCode: 'WHISPER_COST_WARNING',
      costWarning: `This audio is ${durationMinutes.toFixed(0)} minutes. Whisper costs ~$0.006/min. Estimated: $${estimatedCost.toFixed(3)}`
    };
  }
  
  console.log(`[Whisper] Transcribing (cost: $${estimatedCost.toFixed(3)})...`);
  
  try {
    const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const blob = new Blob([audioBytes], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');
    formData.append('response_format', 'text');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiApiKey}` },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { transcription: null, error: `Whisper error: ${errorData.error?.message}`, errorCode: 'WHISPER_ERROR' };
    }
    
    const transcription = await response.text();
    
    // Track usage
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: existing } = await supabase
      .from('stt_usage')
      .select('id, whisper_minutes_used')
      .eq('month', currentMonth)
      .maybeSingle();
    
    if (existing) {
      await supabase
        .from('stt_usage')
        .update({ whisper_minutes_used: (existing.whisper_minutes_used || 0) + durationMinutes })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('stt_usage')
        .insert({ month: currentMonth, whisper_minutes_used: durationMinutes });
    }
    
    console.log(`[Whisper] Success: ${transcription.length} characters`);
    return { transcription, tier: 'whisper' };
    
  } catch (error) {
    return { transcription: null, error: `Whisper failed: ${error instanceof Error ? error.message : 'Unknown'}`, errorCode: 'WHISPER_ERROR' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBase64, durationMinutes, skipCostWarning = false, forceTier } = await req.json();

    if (!audioBase64) {
      return new Response(JSON.stringify({ error: 'Audio data is required', errorCode: 'MISSING_AUDIO' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`\n========== Transcribing audio: ${durationMinutes?.toFixed(1) || '?'} minutes ==========`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let result: TranscriptResult;

    // Force Whisper if requested
    if (forceTier === 'whisper') {
      result = await transcribeWithWhisper(audioBase64, durationMinutes || 10, skipCostWarning, supabase);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try Google STT first (free tier)
    result = await transcribeWithGoogleSTT(audioBase64, durationMinutes || 10, supabase);
    if (result.transcription) {
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[Google STT failed] ${result.error}`);

    // Fall back to Whisper
    result = await transcribeWithWhisper(audioBase64, durationMinutes || 10, skipCostWarning, supabase);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: 'UNKNOWN_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
