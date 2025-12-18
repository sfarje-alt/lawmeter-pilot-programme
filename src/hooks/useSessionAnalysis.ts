import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionAnalysis } from '@/types/peruSessions';

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
      const { error: updateError1 } = await supabase
        .from('session_recordings')
        .update({ 
          transcription_status: 'PROCESSING',
          analysis_status: 'NOT_STARTED'
        })
        .eq('session_id', sessionId);

      if (updateError1) {
        console.error('Error updating transcription status:', updateError1);
      }

      toast.info('Fetching video transcription...');

      // Step 2: Fetch transcription
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke(
        'fetch-youtube-transcript',
        { body: { videoId } }
      );

      if (transcriptError || !transcriptData?.transcription) {
        const errorMsg = transcriptError?.message || transcriptData?.error || 'Failed to fetch transcription';
        console.error('Transcription error:', errorMsg);
        
        await supabase
          .from('session_recordings')
          .update({ 
            transcription_status: 'FAILED',
            last_error: errorMsg
          })
          .eq('session_id', sessionId);
        
        toast.error('Failed to fetch video transcription');
        return null;
      }

      // Step 3: Save transcription and update status
      await supabase
        .from('session_recordings')
        .update({ 
          transcription_text: transcriptData.transcription,
          transcription_status: 'COMPLETED',
          analysis_status: 'PROCESSING'
        })
        .eq('session_id', sessionId);

      toast.info('Analyzing transcription with AI...');

      // Step 4: Analyze with AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'analyze-session-transcript',
        { 
          body: { 
            transcriptionText: transcriptData.transcription,
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
        
        toast.error('Failed to analyze transcription');
        return null;
      }

      // Step 5: Save analysis result
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
        toast.error('Analysis complete but failed to save');
        return analysisData.analysis;
      }

      toast.success('Session analysis complete!');
      return analysisData.analysis;

    } catch (error) {
      console.error('Error in session analysis:', error);
      toast.error('An error occurred during analysis');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { isAnalyzing, analyzeSession };
}
