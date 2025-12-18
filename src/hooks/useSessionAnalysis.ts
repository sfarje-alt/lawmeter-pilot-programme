import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionAnalysis } from '@/types/peruSessions';

// Python microservice for YouTube transcription (yt-dlp + AssemblyAI)
const TRANSCRIBER_API = 'https://youtube-transcriber-api-3697.onrender.com';

interface UseSessionAnalysisResult {
  isAnalyzing: boolean;
  analyzeSession: (sessionId: string, videoId: string, commissionName: string, sessionTitle?: string, sessionDate?: string) => Promise<SessionAnalysis | null>;
}

export function useSessionAnalysis(): UseSessionAnalysisResult {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const extractVideoId = (videoUrl: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const analyzeSession = useCallback(async (
    sessionId: string,
    videoIdOrUrl: string,
    commissionName: string,
    sessionTitle?: string,
    sessionDate?: string
  ): Promise<SessionAnalysis | null> => {
    setIsAnalyzing(true);
    
    try {
      const videoId = extractVideoId(videoIdOrUrl) || videoIdOrUrl;
      console.log(`Starting analysis for session ${sessionId}, video ${videoId}`);

      // Step 1: Update status to processing
      await supabase
        .from('session_recordings')
        .update({ 
          transcription_status: 'PROCESSING',
          analysis_status: 'NOT_STARTED',
          last_error: null
        })
        .eq('session_id', sessionId);

      // Step 2: Try YouTube captions first (free)
      toast.info('Buscando subtítulos de YouTube...', { duration: 3000 });
      
      const { data: captionsData } = await supabase.functions.invoke(
        'fetch-youtube-transcript',
        { body: { videoId } }
      );

      let transcription: string | null = null;
      let tier = 'unknown';

      if (captionsData?.transcription) {
        transcription = captionsData.transcription;
        tier = captionsData.tier || 'youtube';
        console.log(`Got transcription from YouTube captions: ${transcription.length} chars`);
        toast.success('Subtítulos de YouTube obtenidos', { duration: 2000 });
      } else {
        // Step 3: Use Python microservice (yt-dlp + AssemblyAI)
        toast.info('Transcribiendo con servicio dedicado...', { 
          description: 'Primera vez puede tomar ~30s extra (servicio despertando)',
          duration: 120000 
        });

        try {
          console.log('[Python Service] Calling transcription microservice...');
          
          const response = await fetch(`${TRANSCRIBER_API}/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              videoId, 
              language: 'es' 
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Service error: ${response.status}`);
          }

          const data = await response.json();
          transcription = data.text;
          tier = 'python-service';
          
          console.log(`[Python Service] Transcription complete: ${transcription.length} chars`);
          toast.success('Transcripción completada', { duration: 3000 });

        } catch (serviceError) {
          console.error('[Python Service] Transcription failed:', serviceError);
          
          await supabase
            .from('session_recordings')
            .update({ 
              transcription_status: 'FAILED',
              last_error: `Transcription service failed: ${serviceError instanceof Error ? serviceError.message : 'Unknown error'}`
            })
            .eq('session_id', sessionId);
          
          toast.error('Error en transcripción', {
            description: serviceError instanceof Error ? serviceError.message : 'Intenta de nuevo más tarde',
            duration: 6000
          });
          
          return null;
        }
      }

      if (!transcription) {
        await supabase
          .from('session_recordings')
          .update({ 
            transcription_status: 'FAILED',
            last_error: 'No transcription obtained from any source'
          })
          .eq('session_id', sessionId);
        
        toast.error('No se pudo obtener transcripción');
        return null;
      }

      // Step 4: Save transcription
      await supabase
        .from('session_recordings')
        .update({ 
          transcription_text: transcription,
          transcription_status: 'COMPLETED',
          analysis_status: 'PROCESSING'
        })
        .eq('session_id', sessionId);

      toast.info('Analizando transcripción con IA...', { duration: 5000 });

      // Step 5: Analyze with AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'analyze-session-transcript',
        { 
          body: { 
            transcriptionText: transcription,
            commissionName,
            sessionTitle,
            sessionDate
          } 
        }
      );

      if (analysisError || !analysisData?.analysis) {
        const errorMsg = analysisError?.message || analysisData?.error || 'Failed to analyze transcription';
        console.error('Analysis error:', errorMsg);
        
        await supabase
          .from('session_recordings')
          .update({ 
            analysis_status: 'FAILED',
            last_error: errorMsg
          })
          .eq('session_id', sessionId);
        
        toast.error('Error en análisis IA', {
          description: 'La transcripción se guardó pero el análisis falló.',
          duration: 6000
        });
        return null;
      }

      // Step 6: Save analysis result
      const { error: saveError } = await supabase
        .from('session_recordings')
        .update({ 
          analysis_result: analysisData.analysis,
          analysis_status: 'COMPLETED',
          analyzed_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (saveError) {
        console.error('Error saving analysis:', saveError);
        toast.error('Análisis completado pero no se pudo guardar');
        return analysisData.analysis;
      }

      toast.success('¡Análisis de sesión completado!', {
        description: `Relevancia: ${analysisData.analysis.relevanceCategory} (${analysisData.analysis.relevanceScore}/100) - via ${tier}`
      });
      return analysisData.analysis;

    } catch (error) {
      console.error('Error in session analysis:', error);
      toast.error('Error inesperado', {
        description: 'Por favor verifica tu conexión e intenta de nuevo.'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { 
    isAnalyzing, 
    analyzeSession
  };
}
