import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionAnalysis } from '@/types/peruSessions';
import { extractYouTubeAudioClientSide, downloadAudioAsBase64 } from '@/lib/clientYouTubeDownloader';

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
        // Step 3: Client-side audio extraction + AssemblyAI
        toast.info('Extrayendo audio del video...', { 
          description: 'Usando tu navegador (evita bloqueos de servidor)',
          duration: 10000 
        });

        try {
          // Get audio URL from browser (bypasses server blocks)
          console.log('[Client] Starting client-side audio extraction...');
          const audioInfo = await extractYouTubeAudioClientSide(videoId);
          console.log(`[Client] Got audio URL, duration: ${audioInfo.durationSeconds}s`);
          
          toast.info('Descargando audio...', { 
            description: `${Math.round(audioInfo.durationSeconds / 60)} minutos de audio`,
            duration: 30000 
          });

          // Download and convert to base64
          const { base64, mimeType } = await downloadAudioAsBase64(audioInfo.audioUrl);
          console.log(`[Client] Audio downloaded: ${(base64.length * 0.75 / 1024 / 1024).toFixed(2)} MB`);
          
          toast.info('Enviando a AssemblyAI para transcripción...', { 
            description: 'Esto puede tomar 2-5 minutos',
            duration: 60000 
          });

          // Send to AssemblyAI edge function
          const { data: assemblyData, error: assemblyError } = await supabase.functions.invoke(
            'transcribe-with-assemblyai',
            { 
              body: { 
                audioBase64: base64,
                mimeType,
                languageCode: 'es'
              } 
            }
          );

          if (assemblyError || !assemblyData?.transcription) {
            throw new Error(assemblyError?.message || assemblyData?.error || 'AssemblyAI transcription failed');
          }

          transcription = assemblyData.transcription;
          tier = 'assemblyai';
          console.log(`[Client] AssemblyAI transcription complete: ${transcription.length} chars`);
          toast.success('Transcripción AssemblyAI completada', { duration: 3000 });

        } catch (clientError) {
          console.error('[Client] Client-side extraction failed:', clientError);
          
          await supabase
            .from('session_recordings')
            .update({ 
              transcription_status: 'FAILED',
              last_error: `Client extraction failed: ${clientError instanceof Error ? clientError.message : 'Unknown error'}`
            })
            .eq('session_id', sessionId);
          
          toast.error('Error al extraer audio', {
            description: clientError instanceof Error ? clientError.message : 'Intenta de nuevo más tarde',
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
