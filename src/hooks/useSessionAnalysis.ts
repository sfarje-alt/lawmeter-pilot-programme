import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionAnalysis } from '@/types/peruSessions';
import { extractYouTubeAudio } from '@/lib/youtubeAudioExtractor';

interface UseSessionAnalysisResult {
  isAnalyzing: boolean;
  pendingWhisperCost: { sessionId: string; videoId: string; commissionName: string; sessionTitle?: string; sessionDate?: string; costWarning: string } | null;
  analyzeSession: (sessionId: string, videoId: string, commissionName: string, sessionTitle?: string, sessionDate?: string, skipCostWarning?: boolean) => Promise<SessionAnalysis | null>;
  confirmWhisperCost: () => Promise<SessionAnalysis | null>;
  cancelWhisperCost: () => void;
}

// Error messages based on error codes
const ERROR_MESSAGES: Record<string, string> = {
  NO_CAPTIONS: 'This video doesn\'t have captions available yet. Try again in 24 hours.',
  CAPTIONS_RESTRICTED: 'This video has restricted caption access.',
  CAPTIONS_UNAVAILABLE: 'Could not fetch captions.',
  PAGE_FETCH_FAILED: 'Could not access the video.',
  INNERTUBE_ERROR: 'Error extracting video data.',
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
  CLIENT_AUDIO_EXTRACTION_FAILED: 'Client-side audio extraction failed.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

const TIER_MESSAGES: Record<string, string> = {
  youtube: 'YouTube captions (free)',
  google_stt: 'Google Cloud STT (free tier)',
  whisper: 'OpenAI Whisper (paid)',
  client_stt: 'Client audio + STT'
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
        description: 'Trying YouTube captions, then Piped API for audio extraction.',
        duration: 5000 
      });

      let transcriptData: any = null;

      // METHOD 1: Try server-side YouTube captions first (fastest)
      const { data: serverData, error: serverError } = await supabase.functions.invoke(
        'fetch-youtube-transcript',
        { body: { videoId, skipCostWarning } }
      );

      if (serverData?.transcription) {
        transcriptData = serverData;
        console.log('Got transcription from server (YouTube captions)');
      } else if (serverData?.errorCode === 'WHISPER_COST_WARNING') {
        // Handle Whisper cost warning
        console.log('Whisper cost warning received:', serverData.costWarning);
        setPendingWhisperCost({
          sessionId,
          videoId,
          commissionName,
          sessionTitle,
          sessionDate,
          costWarning: serverData.costWarning
        });
        setIsAnalyzing(false);
        toast.warning('Paid transcription required', {
          description: serverData.costWarning,
          duration: 10000
        });
        return null;
      } else {
        // METHOD 2: Try client-side audio extraction
        console.log('Server-side failed, trying client-side audio extraction...');
        toast.info('Trying client-side audio extraction...', { duration: 3000 });

        try {
          const audioData = await extractYouTubeAudio(videoId);
          
          if (audioData) {
            console.log(`Client extracted audio: ${audioData.durationMinutes.toFixed(1)} min`);
            toast.info('Audio extracted, sending to STT...', { duration: 3000 });

            // Send audio to transcribe-audio edge function
            const { data: sttData, error: sttError } = await supabase.functions.invoke(
              'transcribe-audio',
              { 
                body: { 
                  audioBase64: audioData.audioBase64,
                  durationMinutes: audioData.durationMinutes,
                  skipCostWarning
                } 
              }
            );

            if (sttData?.transcription) {
              transcriptData = { ...sttData, tier: 'client_stt' };
              console.log('Got transcription from client audio + STT');
            } else if (sttData?.errorCode === 'WHISPER_COST_WARNING') {
              setPendingWhisperCost({
                sessionId,
                videoId,
                commissionName,
                sessionTitle,
                sessionDate,
                costWarning: sttData.costWarning
              });
              setIsAnalyzing(false);
              toast.warning('Paid transcription required', {
                description: sttData.costWarning,
                duration: 10000
              });
              return null;
            }
          }
        } catch (clientError) {
          console.error('Client-side extraction failed:', clientError);
        }
      }

      // If no transcription from any method
      if (!transcriptData?.transcription) {
        const errorCode = serverData?.errorCode || 'ALL_METHODS_FAILED';
        const errorMsg = ERROR_MESSAGES[errorCode] || serverData?.error || 'Failed to fetch transcription';
        
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
