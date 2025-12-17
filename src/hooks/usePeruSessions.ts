// Hook for managing Peru Congress sessions

import { useState, useEffect, useMemo } from 'react';
import { PeruSession, WatchedCommission } from '@/types/peruSessions';
import { PERU_MOCK_SESSIONS, PERU_MOCK_RECORDINGS, DEFAULT_WATCHED_COMMISSIONS } from '@/data/peruSessionsMockData';
import { useToast } from '@/hooks/use-toast';

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

  // Resolve video for a session (mock implementation)
  const resolveSessionVideo = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Update status to resolving
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, video_status: 'RESOLVING' } : s
    ));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock result - 70% success rate
    const success = Math.random() > 0.3;
    
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      
      if (success) {
        return {
          ...s,
          video_status: 'FOUND_HIGH',
          recording: {
            id: `recording-${sessionId}`,
            session_id: sessionId,
            provider: 'YOUTUBE' as const,
            channel_name: 'Congreso de la República del Perú',
            expected_title: `🔴 EN VIVO: Comisión de ${s.commission_name}`,
            video_id: 'dQw4w9WgXcQ',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            resolution_confidence: 'HIGH',
            resolution_method: 'EXACT_STRIP_EMOJI',
            resolved_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        };
      } else {
        return {
          ...s,
          video_status: 'NOT_FOUND',
        };
      }
    }));

    toast({
      title: success ? "Video encontrado" : "Video no encontrado",
      description: success 
        ? "Se encontró el video de la sesión en YouTube"
        : "No se pudo encontrar el video. Puedes agregar el enlace manualmente.",
      variant: success ? "default" : "destructive",
    });
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

  // Import sessions from file (mock)
  const importSessions = async (file: File) => {
    toast({
      title: "Importando sesiones...",
      description: `Procesando archivo: ${file.name}`,
    });

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Importación completada",
      description: `Se importaron ${Math.floor(Math.random() * 20) + 10} sesiones del archivo`,
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
