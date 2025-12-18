import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionAnalysis } from '@/types/peruSessions';

interface UseSessionAnalysisResult {
  isAnalyzing: boolean;
  analyzeSession: (sessionId: string, videoId: string, commissionName: string, sessionTitle?: string, sessionDate?: string) => Promise<SessionAnalysis | null>;
}

// Error messages based on error codes
const ERROR_MESSAGES: Record<string, string> = {
  NO_CAPTIONS: 'This video doesn\'t have captions available yet. Trying AssemblyAI transcription...',
  AUDIO_DOWNLOAD_FAILED: 'Could not download audio from video.',
  ASSEMBLYAI_NOT_CONFIGURED: 'AssemblyAI not configured.',
  ASSEMBLYAI_UPLOAD_FAILED: 'Failed to upload audio to AssemblyAI.',
  ASSEMBLYAI_ERROR: 'AssemblyAI transcription failed.',
  ASSEMBLYAI_TIMEOUT: 'Transcription timed out.',
  ALL_METHODS_FAILED: 'All transcription methods failed.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

const TIER_MESSAGES: Record<string, string> = {
  youtube: 'YouTube captions (free)',
  assemblyai: 'AssemblyAI transcription'
};

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
          analysis_status: 'NOT_STARTED',
          last_error: null
        })
        .eq('session_id', sessionId);

      if (updateError1) {
        console.error('Error updating transcription status:', updateError1);
      }

      toast.info('Fetching video transcription...', { 
        description: 'Trying YouTube captions first, then AssemblyAI if needed.',
        duration: 5000 
      });

      // Fetch transcription from edge function
      const { data: transcriptData, error: serverError } = await supabase.functions.invoke(
        'fetch-youtube-transcript',
        { body: { videoId } }
      );

      // If no transcription from any method
      if (!transcriptData?.transcription) {
        const errorCode = transcriptData?.errorCode || 'ALL_METHODS_FAILED';
        const errorMsg = ERROR_MESSAGES[errorCode] || transcriptData?.error || 'Failed to fetch transcription';
        
        console.error('All transcription methods failed:', errorCode);
        
        await supabase
          .from('session_recordings')
          .update({ 
            transcription_status: 'FAILED',
            last_error: `${errorCode}: ${errorMsg}`
          })
          .eq('session_id', sessionId);
        
        toast.error('Transcription failed', {
          description: errorMsg,
          duration: 6000
        });
        
        return null;
      }

      // Log transcription source tier
      const tierMessage = transcriptData.tier ? TIER_MESSAGES[transcriptData.tier] : 'Unknown source';
      console.log(`Transcription fetched via ${tierMessage}: ${transcriptData.transcription.length} chars, lang: ${transcriptData.language}`);
      
      toast.success(`Transcription obtained via ${tierMessage}`, { duration: 3000 });

      // Step 2: Save transcription and update status
      await supabase
        .from('session_recordings')
        .update({ 
          transcription_text: transcriptData.transcription,
          transcription_status: 'COMPLETED',
          analysis_status: 'PROCESSING'
        })
        .eq('session_id', sessionId);

      toast.info('Analyzing transcription with AI...', { duration: 5000 });

      // Step 3: Analyze with AI
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
        
        toast.error('Analysis failed', {
          description: 'The AI could not analyze this transcript. Please try again.',
          duration: 6000
        });
        return null;
      }

      // Step 4: Save analysis result
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

      toast.success('Session analysis complete!', {
        description: `Relevance: ${analysisData.analysis.relevanceCategory} (${analysisData.analysis.relevanceScore}/100)`
      });
      return analysisData.analysis;

    } catch (error) {
      console.error('Error in session analysis:', error);
      toast.error('An error occurred', {
        description: 'Please check your connection and try again.'
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
