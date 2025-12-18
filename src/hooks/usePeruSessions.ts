// Hook for managing Peru Congress sessions

import { useState, useEffect, useMemo } from 'react';
import { PeruSession, WatchedCommission } from '@/types/peruSessions';
import { PERU_MOCK_SESSIONS, PERU_MOCK_RECORDINGS, DEFAULT_WATCHED_COMMISSIONS } from '@/data/peruSessionsMockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// Type for parsed sessions from PDF importer
export interface ImportedSession {
  tipo_comision: string;
  commission_name: string;
  session_title: string;
  caracteristicas: string | null;
  scheduled_date: string;
  scheduled_time: string;
  agenda_url: string | null;
  external_session_id: string | null;
}

interface UsePeruSessionsOptions {
  commissionFilter?: string;
  dateRange?: { start: Date; end: Date };
  showOnlyRecommended?: boolean;
  showOnlySelected?: boolean;
}

export function usePeruSessions(options: UsePeruSessionsOptions = {}) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<PeruSession[]>([]);
  const [watchedCommissions, setWatchedCommissions] = useState<string[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    // Simulate loading from database
    setTimeout(() => {
      // Load watched commissions from localStorage or use defaults
      const storedWatched = localStorage.getItem('peru_watched_commissions');
      const watched = storedWatched ? JSON.parse(storedWatched) : DEFAULT_WATCHED_COMMISSIONS;
      setWatchedCommissions(watched);

      // Load selected sessions from localStorage
      const storedSelected = localStorage.getItem('peru_selected_sessions');
      const selected = storedSelected ? new Set<string>(JSON.parse(storedSelected)) : new Set<string>();
      setSelectedSessionIds(selected);

      // Mark sessions as recommended/selected based on watched commissions
      const enrichedSessions = PERU_MOCK_SESSIONS.map(session => ({
        ...session,
        is_recommended: watched.includes(session.commission_name),
        is_selected: selected.has(session.id),
        recording: PERU_MOCK_RECORDINGS.find(r => r.session_id === session.id),
      }));

      setSessions(enrichedSessions);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter sessions based on options
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    if (options.commissionFilter) {
      filtered = filtered.filter(s => 
        s.commission_name.toLowerCase().includes(options.commissionFilter!.toLowerCase())
      );
    }

    if (options.dateRange) {
      filtered = filtered.filter(s => {
        if (!s.scheduled_at) return false;
        const date = new Date(s.scheduled_at);
        return date >= options.dateRange!.start && date <= options.dateRange!.end;
      });
    }

    if (options.showOnlyRecommended) {
      filtered = filtered.filter(s => s.is_recommended);
    }

    if (options.showOnlySelected) {
      filtered = filtered.filter(s => s.is_selected);
    }

    // Sort by date descending
    filtered.sort((a, b) => {
      const dateA = a.scheduled_at ? new Date(a.scheduled_at).getTime() : 0;
      const dateB = b.scheduled_at ? new Date(b.scheduled_at).getTime() : 0;
      return dateB - dateA;
    });

    return filtered;
  }, [sessions, options]);

  // Toggle session selection
  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessionIds(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      localStorage.setItem('peru_selected_sessions', JSON.stringify([...next]));
      return next;
    });

    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, is_selected: !s.is_selected } : s
    ));
  };

  // Add commission to watchlist
  const addWatchedCommission = (commission: string) => {
    if (watchedCommissions.includes(commission)) return;
    
    const updated = [...watchedCommissions, commission];
    setWatchedCommissions(updated);
    localStorage.setItem('peru_watched_commissions', JSON.stringify(updated));

    // Update recommended status
    setSessions(prev => prev.map(s => ({
      ...s,
      is_recommended: updated.includes(s.commission_name),
    })));

    toast({
      title: "Comisión agregada",
      description: `${commission} añadida a tu lista de monitoreo`,
    });
  };

  // Remove commission from watchlist
  const removeWatchedCommission = (commission: string) => {
    const updated = watchedCommissions.filter(c => c !== commission);
    setWatchedCommissions(updated);
    localStorage.setItem('peru_watched_commissions', JSON.stringify(updated));

    // Update recommended status
    setSessions(prev => prev.map(s => ({
      ...s,
      is_recommended: updated.includes(s.commission_name),
    })));

    toast({
      title: "Comisión removida",
      description: `${commission} eliminada de tu lista de monitoreo`,
    });
  };

  // Resolve video for a session using real YouTube API
  const resolveSessionVideo = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Update status to resolving
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, video_status: 'RESOLVING' } : s
    ));

    try {
      // Get the date from scheduled_at or scheduled_date_text
      const scheduledDate = session.scheduled_at || session.scheduled_date_text;
      
      if (!scheduledDate) {
        throw new Error("No scheduled date available for this session");
      }

      console.log(`Resolving video for: ${session.commission_name} on ${scheduledDate}`);

      // Call Edge Function to resolve video
      // Pass sessionTitle for intelligent commission name extraction
      const { data, error } = await supabase.functions.invoke('resolve-peru-session-video', {
        body: {
          commissionName: session.commission_name,
          sessionTitle: session.session_title,  // NEW: Full PDF title for extraction
          scheduledDate: scheduledDate,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Error calling video resolution service");
      }

      console.log("Resolution result:", data);

      if (data?.found) {
        // Determine video status based on confidence
        let videoStatus: 'FOUND_HIGH' | 'FOUND_MEDIUM' | 'FOUND_LOW';
        if (data.confidence === 'HIGH') {
          videoStatus = 'FOUND_HIGH';
        } else if (data.confidence === 'MEDIUM') {
          videoStatus = 'FOUND_MEDIUM';
        } else {
          videoStatus = 'FOUND_LOW';
        }

        setSessions(prev => prev.map(s => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            video_status: videoStatus,
            recording: {
              id: `recording-${sessionId}`,
              session_id: sessionId,
              provider: 'YOUTUBE' as const,
              channel_name: data.channelName || 'Congreso de la República del Perú',
              channel_id: data.channelId,
              expected_title: data.expectedTitle,
              video_id: data.videoId,
              video_url: data.videoUrl,
              resolution_confidence: data.confidence,
              resolution_method: data.method,
              resolved_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            },
          };
        }));

        toast({
          title: "Video encontrado",
          description: `Se encontró el video con ${Math.round(data.similarity * 100)}% de similitud`,
        });
      } else {
        // Store expectedTitle even when not found for debugging
        setSessions(prev => prev.map(s => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            video_status: 'NOT_FOUND',
            recording: data?.expectedTitle ? {
              id: `recording-${sessionId}`,
              session_id: sessionId,
              provider: 'YOUTUBE' as const,
              channel_name: 'Congreso de la República del Perú',
              expected_title: data.expectedTitle,
              resolution_confidence: undefined,
              resolution_method: undefined,
              last_error: data?.message,
              created_at: new Date().toISOString(),
            } : undefined,
          };
        }));

        toast({
          title: "Video no encontrado",
          description: `Título buscado: "${data?.expectedTitle || 'N/A'}". ${data?.message || "Puedes agregar el enlace manualmente."}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error resolving video:", err);
      
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, video_status: 'NOT_FOUND' } : s
      ));

      toast({
        title: "Error al buscar video",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  // Set manual video URL
  const setManualVideoUrl = (sessionId: string, videoUrl: string) => {
    // Extract video ID from URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      
      return {
        ...s,
        video_status: 'MANUAL',
        recording: {
          id: `recording-${sessionId}`,
          session_id: sessionId,
          provider: 'YOUTUBE' as const,
          channel_name: 'Manual',
          expected_title: '',
          video_id: videoId || '',
          video_url: videoUrl,
          resolution_confidence: 'LOW',
          resolution_method: 'MANUAL',
          resolved_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      };
    }));

    toast({
      title: "Enlace guardado",
      description: "El enlace del video ha sido guardado manualmente",
    });
  };

  // Import sessions from parsed PDF data
  const importSessions = async (importedSessions: ImportedSession[]) => {
    // Convert imported sessions to PeruSession format
    const newSessions: PeruSession[] = importedSessions.map((imported, index) => {
      // Combine date and time into scheduled_at
      let scheduledAt: string | null = null;
      if (imported.scheduled_date) {
        scheduledAt = imported.scheduled_time 
          ? `${imported.scheduled_date}T${imported.scheduled_time}:00`
          : `${imported.scheduled_date}T00:00:00`;
      }

      const sessionId = imported.external_session_id || `imported-${Date.now()}-${index}`;
      
      return {
        id: sessionId,
        commission_name: imported.commission_name,
        session_title: imported.session_title || `Sesión de ${imported.commission_name}`,
        scheduled_at: scheduledAt,
        scheduled_date_text: `${imported.scheduled_date} ${imported.scheduled_time || ''}`.trim(),
        status: 'scheduled' as const,
        agenda_url: imported.agenda_url,
        documents_url: null,
        external_session_id: imported.external_session_id,
        jurisdiction: 'Peru',
        source: 'IMPORTED',
        source_file_name: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_recommended: watchedCommissions.includes(imported.commission_name),
        is_selected: false,
        video_status: 'NOT_CHECKED' as const,
      };
    });

    // Add to existing sessions (avoid duplicates by external_session_id)
    setSessions(prev => {
      const existingIds = new Set(prev.map(s => s.external_session_id).filter(Boolean));
      const uniqueNew = newSessions.filter(s => 
        !s.external_session_id || !existingIds.has(s.external_session_id)
      );
      return [...uniqueNew, ...prev];
    });

    toast({
      title: "Importación completada",
      description: `Se importaron ${newSessions.length} sesiones`,
    });
  };

  // Stats
  const stats = useMemo(() => ({
    total: sessions.length,
    recommended: sessions.filter(s => s.is_recommended).length,
    selected: sessions.filter(s => s.is_selected).length,
    withVideo: sessions.filter(s => s.video_status === 'FOUND_HIGH' || s.video_status === 'FOUND_MEDIUM' || s.video_status === 'MANUAL').length,
    upcoming: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
  }), [sessions]);

  return {
    sessions: filteredSessions,
    allSessions: sessions,
    watchedCommissions,
    selectedSessionIds,
    isLoading,
    stats,
    toggleSessionSelection,
    addWatchedCommission,
    removeWatchedCommission,
    resolveSessionVideo,
    setManualVideoUrl,
    importSessions,
  };
}
