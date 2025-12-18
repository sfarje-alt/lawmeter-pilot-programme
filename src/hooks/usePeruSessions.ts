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

  // Load initial data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load watched commissions from localStorage or use defaults
        const storedWatched = localStorage.getItem('peru_watched_commissions');
        const watched = storedWatched ? JSON.parse(storedWatched) : DEFAULT_WATCHED_COMMISSIONS;
        setWatchedCommissions(watched);

        // Load selected sessions from localStorage
        const storedSelected = localStorage.getItem('peru_selected_sessions');
        const selected = storedSelected ? new Set<string>(JSON.parse(storedSelected)) : new Set<string>();
        setSelectedSessionIds(selected);

        // Load sessions from Supabase database
        const { data: dbSessions, error } = await supabase
          .from('peru_sessions')
          .select('*')
          .order('scheduled_at', { ascending: false });

        if (error) {
          console.error('Error loading sessions from database:', error);
          // Fallback to mock data if database fails
          const enrichedSessions = PERU_MOCK_SESSIONS.map(session => ({
            ...session,
            is_recommended: watched.includes(session.commission_name),
            is_selected: selected.has(session.id),
            recording: PERU_MOCK_RECORDINGS.find(r => r.session_id === session.id),
          }));
          setSessions(enrichedSessions);
        } else if (dbSessions && dbSessions.length > 0) {
          // Use database sessions
          const enrichedSessions: PeruSession[] = dbSessions.map(session => ({
            id: session.id,
            commission_name: session.commission_name,
            session_title: session.session_title || `Sesión de ${session.commission_name}`,
            scheduled_at: session.scheduled_at,
            scheduled_date_text: session.scheduled_date_text,
            status: (session.status as 'scheduled' | 'completed' | 'cancelled') || 'scheduled',
            agenda_url: session.agenda_url,
            documents_url: session.documents_url,
            external_session_id: session.external_session_id,
            jurisdiction: (session.jurisdiction as 'PERU' | 'Peru') || 'PERU',
            source: (session.source as 'PERU_CONGRESS_COMMISSION_SESSIONS' | 'IMPORTED' | 'DATABASE') || 'DATABASE',
            source_file_name: session.source_file_name,
            created_at: session.created_at,
            updated_at: session.updated_at,
            is_recommended: watched.includes(session.commission_name),
            is_selected: selected.has(session.id),
            video_status: 'NOT_CHECKED' as const,
          }));
          setSessions(enrichedSessions);
        } else {
          // No sessions in database, use mock data
          const enrichedSessions = PERU_MOCK_SESSIONS.map(session => ({
            ...session,
            is_recommended: watched.includes(session.commission_name),
            is_selected: selected.has(session.id),
            recording: PERU_MOCK_RECORDINGS.find(r => r.session_id === session.id),
          }));
          setSessions(enrichedSessions);
        }
      } catch (err) {
        console.error('Error in loadData:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  // Import sessions from parsed PDF data - saves to Supabase
  const importSessions = async (importedSessions: ImportedSession[]): Promise<{ inserted: number; updated: number }> => {
    // Helper to convert DD/MM/YYYY to YYYY-MM-DD
    const convertDate = (dateStr: string): string | null => {
      if (!dateStr) return null;
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Helper to convert "9:00AM" or "10:30PM" to "09:00:00" or "22:30:00"
    const convertTime = (timeStr: string): string => {
      if (!timeStr) return '00:00:00';
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return '00:00:00';
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    };

    // Convert imported sessions to database format
    const sessionsToSave = importedSessions.map((imported) => {
      // Convert date to ISO format
      const isoDate = convertDate(imported.scheduled_date);
      const isoTime = convertTime(imported.scheduled_time);
      
      // Combine into ISO timestamp
      const scheduledAt = isoDate ? `${isoDate}T${isoTime}` : null;

      return {
        external_session_id: imported.external_session_id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        commission_name: imported.commission_name,
        session_title: imported.session_title || `Sesión de ${imported.commission_name}`,
        scheduled_at: scheduledAt,
        scheduled_date_text: `${imported.scheduled_date} ${imported.scheduled_time || ''}`.trim(),
        status: 'scheduled',
        agenda_url: imported.agenda_url,
        jurisdiction: 'PERU',
        source: 'PERU_CONGRESS_COMMISSION_SESSIONS',
      };
    });

    console.log(`Saving ${sessionsToSave.length} sessions to database...`);

    // Upsert to Supabase (insert or update on conflict)
    const { data, error } = await supabase
      .from('peru_sessions')
      .upsert(sessionsToSave, { 
        onConflict: 'external_session_id',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Error saving sessions to database:', error);
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    const savedCount = data?.length || 0;
    console.log(`Successfully saved ${savedCount} sessions to database`);

    toast({
      title: "Sesiones guardadas",
      description: `Se guardaron ${savedCount} sesiones en la base de datos`,
    });

    return { inserted: savedCount, updated: 0 };
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
