import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionAnalysis } from '@/types/peruSessions';

interface UseSessionAnalysisResult {
  isAnalyzing: boolean;
  pendingWhisperCost: { sessionId: string; videoId: string; commissionName: string; sessionTitle?: string; sessionDate?: string; costWarning: string } | null;
  analyzeSession: (sessionId: string, videoId: string, commissionName: string, sessionTitle?: string, sessionDate?: string, skipCostWarning?: boolean) => Promise<SessionAnalysis | null>;
  confirmWhisperCost: () => Promise<SessionAnalysis | null>;
  cancelWhisperCost: () => void;
}

// Error messages based on error codes
const ERROR_MESSAGES: Record<string, string> = {
  NO_CAPTIONS: 'This video doesn\'t have captions available yet. It may be too new - try again in 24 hours.',
  CAPTIONS_RESTRICTED: 'This video has captions but the owner has restricted access. Try a different video.',
  CAPTIONS_UNAVAILABLE: 'Could not fetch captions. The video may still be processing.',
  PAGE_FETCH_FAILED: 'Could not access the video. Please check if the video is available.',
  INNERTUBE_ERROR: 'Error extracting video data. Please try again.',
  TIMEDTEXT_FAILED: 'Could not fetch captions using alternate method.',
  PARSE_FAILED: 'Captions were found but could not be read properly.',
  GOOGLE_NOT_CONFIGURED: 'Google Cloud STT not configured.',
  GOOGLE_QUOTA_EXHAUSTED: 'Google Cloud free quota exhausted for this month.',
  GOOGLE_QUOTA_INSUFFICIENT: 'Audio too long for remaining Google quota.',
  GOOGLE_STT_ERROR: 'Google Cloud transcription failed.',
  WHISPER_NOT_CONFIGURED: 'OpenAI Whisper not configured.',
  WHISPER_ERROR: 'OpenAI Whisper transcription failed.',
  AUDIO_DOWNLOAD_FAILED: 'Could not download audio from video.',
  ALL_METHODS_FAILED: 'All transcription methods failed.',
  TRANSCRIPTION_UNAVAILABLE: 'Video has no captions and audio transcription failed.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

const TIER_MESSAGES: Record<string, string> = {
  youtube: 'YouTube captions (free)',
  google_stt: 'Google Cloud STT (free tier)',
  whisper: 'OpenAI Whisper (paid)'
};

export function useSessionAnalysis(): UseSessionAnalysisResult {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingWhisperCost, setPendingWhisperCost] = useState<{
    sessionId: string;
    videoId: string;
    commissionName: string;
    sessionTitle?: string;
    sessionDate?: string;
    costWarning: string;
  } | null>(null);

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
    sessionDate?: string,
    skipCostWarning: boolean = false
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
        description: 'Trying YouTube captions first, then STT services if needed.',
        duration: 5000 
      });

      // Step 2: Fetch transcription with 3-tier fallback
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke(
        'fetch-youtube-transcript',
        { body: { videoId, skipCostWarning } }
      );

      // Handle Whisper cost warning
      if (transcriptData?.errorCode === 'WHISPER_COST_WARNING') {
        console.log('Whisper cost warning received:', transcriptData.costWarning);
        setPendingWhisperCost({
          sessionId,
          videoId,
          commissionName,
          sessionTitle,
          sessionDate,
          costWarning: transcriptData.costWarning
        });
        setIsAnalyzing(false);
        
        toast.warning('Paid transcription required', {
          description: transcriptData.costWarning,
          duration: 10000
        });
        return null;
      }

      if (transcriptError || !transcriptData?.transcription) {
        const errorCode = transcriptData?.errorCode || 'UNKNOWN_ERROR';
        const errorMsg = ERROR_MESSAGES[errorCode] || transcriptData?.error || 'Failed to fetch transcription';
        
        console.error('Transcription error:', errorCode, transcriptData?.error);
        
        await supabase
          .from('session_recordings')
          .update({ 
            transcription_status: 'FAILED',
            last_error: `${errorCode}: ${errorMsg}`
          })
          .eq('session_id', sessionId);
        
        // Show specific error message based on error code
        if (errorCode === 'NO_CAPTIONS') {
          toast.error('No captions available', {
            description: 'This video doesn\'t have captions yet. Try again later.',
            duration: 6000
          });
        } else if (errorCode === 'CAPTIONS_RESTRICTED') {
          toast.error('Captions restricted', {
            description: 'The video owner has restricted caption access.',
            duration: 6000
          });
        } else if (errorCode === 'GOOGLE_QUOTA_EXHAUSTED') {
          toast.error('Google quota exhausted', {
            description: 'Free Google STT quota used up. Whisper (paid) is available.',
            duration: 6000
          });
        } else {
          toast.error('Transcription failed', {
            description: errorMsg,
            duration: 6000
          });
        }
        
        return null;
      }

      // Log transcription source tier
      const tierMessage = transcriptData.tier ? TIER_MESSAGES[transcriptData.tier] : 'Unknown source';
      console.log(`Transcription fetched via ${tierMessage}: ${transcriptData.transcription.length} chars, lang: ${transcriptData.language}`);
      
      toast.success(`Transcription obtained via ${tierMessage}`, { duration: 3000 });

      // Step 3: Save transcription and update status
      await supabase
        .from('session_recordings')
        .update({ 
          transcription_text: transcriptData.transcription,
          transcription_status: 'COMPLETED',
          analysis_status: 'PROCESSING'
        })
        .eq('session_id', sessionId);

      toast.info('Analyzing transcription with AI...', { duration: 5000 });

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
        
        toast.error('Analysis failed', {
          description: 'The AI could not analyze this transcript. Please try again.',
          duration: 6000
        });
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

  const confirmWhisperCost = useCallback(async (): Promise<SessionAnalysis | null> => {
    if (!pendingWhisperCost) return null;
    
    const { sessionId, videoId, commissionName, sessionTitle, sessionDate } = pendingWhisperCost;
    setPendingWhisperCost(null);
    
    toast.info('Using Whisper (paid) for transcription...', { duration: 5000 });
    return analyzeSession(sessionId, videoId, commissionName, sessionTitle, sessionDate, true);
  }, [pendingWhisperCost, analyzeSession]);

  const cancelWhisperCost = useCallback(() => {
    setPendingWhisperCost(null);
    toast.info('Transcription cancelled');
  }, []);

  return { 
    isAnalyzing, 
    pendingWhisperCost,
    analyzeSession, 
    confirmWhisperCost,
    cancelWhisperCost
  };
}
