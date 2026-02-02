// Peru Sessions Section - Main container for Peru Congress sessions (Unified with Inbox workflow)

import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Settings, 
  Video, 
  Calendar, 
  Star, 
  Pin,
  Clock,
  RefreshCw,
  Trash2,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { usePeruSessions } from '@/hooks/usePeruSessions';
import { PeruSessionCard } from './PeruSessionCard';
import { PeruWatchedCommissions } from './PeruWatchedCommissions';
import { PeruSessionImporter } from './PeruSessionImporter';
import { SessionDetailDrawer } from './SessionDetailDrawer';
import { SessionPublicationPanel } from './SessionPublicationPanel';
import { SessionsFilterBar, SessionsFilters, applySessionFilters } from './SessionsFilterBar';
import { PERU_COMMISSIONS, PeruSession, SessionClientCommentary } from '@/types/peruSessions';
import { MOCK_CLIENT_PROFILES } from '@/data/mockClientProfiles';
import { toast } from 'sonner';

interface PeruSessionsSectionProps {
  initialSessionId?: string | null;
}

const defaultFilters: SessionsFilters = {
  searchQuery: '',
  commissions: [],
  clientIds: [],
  dateFrom: undefined,
  dateTo: undefined,
  quickDateRange: '',
  showOnlyRecommended: false,
  showOnlySelected: false,
  status: [],
};

export function PeruSessionsSection({ initialSessionId }: PeruSessionsSectionProps) {
  const [activeTab, setActiveTab] = useState<'pinned' | 'all' | 'settings'>('pinned');
  const [filters, setFilters] = useState<SessionsFilters>(defaultFilters);
  const [showImporter, setShowImporter] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PeruSession | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const {
    sessions: rawSessions,
    allSessions,
    watchedCommissions,
    selectedSessionIds,
    isLoading,
    isSyncing,
    stats,
    toggleSessionSelection,
    addWatchedCommission,
    removeWatchedCommission,
    resolveSessionVideo,
    setManualVideoUrl,
    importSessions,
    clearAllSessions,
    syncFromCongress,
    updateSessionRecording,
    togglePinSession,
    updateSessionExpertCommentary,
    publishSession,
    hasCommentaryForClient,
  } = usePeruSessions();

  // Handle navigation from calendar with initialSessionId
  useEffect(() => {
    if (initialSessionId && allSessions.length > 0) {
      const session = allSessions.find(s => s.id === initialSessionId);
      if (session) {
        setSelectedSession(session);
        setDrawerOpen(true);
        // Switch to 'all' tab to ensure we can see the session
        setActiveTab('all');
      }
    }
  }, [initialSessionId, allSessions]);

  // Build client -> watched commissions mapping
  const clientWatchedCommissions = useMemo(() => {
    const map = new Map<string, string[]>();
    MOCK_CLIENT_PROFILES.forEach(client => {
      if (client.id && client.watchedCommissions) {
        map.set(client.id, client.watchedCommissions);
      }
    });
    return map;
  }, []);

  // Apply filters to sessions
  const filteredSessions = useMemo(() => {
    return applySessionFilters(allSessions, filters, clientWatchedCommissions);
  }, [allSessions, filters, clientWatchedCommissions]);

  // Get pinned sessions with filters
  const pinnedSessions = useMemo(() => {
    const pinned = allSessions.filter(s => s.is_pinned_for_publication);
    const filtersWithoutSelected = { ...filters, showOnlySelected: false };
    return applySessionFilters(pinned, filtersWithoutSelected, clientWatchedCommissions);
  }, [allSessions, filters, clientWatchedCommissions]);

  // Calculate analyzed count
  const analyzedCount = useMemo(() => {
    return allSessions.filter(s => s.recording?.analysis_status === 'COMPLETED').length;
  }, [allSessions]);

  // Calculate pinned count
  const pinnedCount = useMemo(() => {
    return allSessions.filter(s => s.is_pinned_for_publication).length;
  }, [allSessions]);

  // Calculate ready to publish count (pinned with commentary)
  const readyToPublishCount = useMemo(() => {
    if (!selectedClientId) return 0;
    return allSessions.filter(s => 
      s.is_pinned_for_publication && hasCommentaryForClient(s, selectedClientId)
    ).length;
  }, [allSessions, selectedClientId, hasCommentaryForClient]);

  const handleClearAll = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todas las sesiones? Esta acción no se puede deshacer.')) {
      await clearAllSessions();
    }
  };

  const handleSync = async () => {
    await syncFromCongress();
  };

  const handleOpenSession = (session: PeruSession) => {
    setSelectedSession(session);
    setDrawerOpen(true);
  };

  const handlePublishSession = (session: PeruSession, clientIds: string[], commentaries: SessionClientCommentary[]) => {
    publishSession(session.id, clientIds, commentaries);
    toast.success(`Sesión publicada a ${clientIds.length} cliente(s)`);
  };

  const handleBatchPublish = (sessionIds: string[], clientIds: string[]) => {
    sessionIds.forEach(sessionId => {
      publishSession(sessionId, clientIds, []);
    });
  };

  // Toggle filter helpers
  const toggleRecommended = () => {
    setFilters(prev => ({ ...prev, showOnlyRecommended: !prev.showOnlyRecommended }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards - Simplified to 3 key metrics */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-l-4 border-l-emerald-500 border-emerald-500/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-l-4 border-l-primary border-primary/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Pin className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Pineadas</span>
            </div>
            <p className="text-3xl font-bold text-foreground mt-1">{pinnedCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-l-4 border-l-purple-500 border-purple-500/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Analizadas</span>
            </div>
            <p className="text-3xl font-bold text-foreground mt-1">{analyzedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pinned' | 'all' | 'settings')}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="pinned" className="data-[state=active]:bg-background">
              <Pin className="h-4 w-4 mr-2" />
              Sesiones Pineadas
              {pinnedCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                  {pinnedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              Todas las Sesiones
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-background">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <SessionPublicationPanel
              pinnedSessions={allSessions.filter(s => s.is_pinned_for_publication)}
              selectedClientId={selectedClientId}
              onClientChange={setSelectedClientId}
              hasCommentaryForClient={hasCommentaryForClient}
              onBatchPublish={handleBatchPublish}
              onUnpinSession={(sessionId) => togglePinSession(sessionId)}
              onOpenSession={handleOpenSession}
            />
            <Button 
              variant="default" 
              onClick={handleSync}
              disabled={isSyncing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowImporter(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Subir Manual
            </Button>
            {stats.total > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar Todo
              </Button>
            )}
          </div>
        </div>

        {/* Pinned Sessions Tab */}
        <TabsContent value="pinned" className="mt-6 space-y-6">
          {/* Filters for Pinned */}
          <SessionsFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            sessions={allSessions}
          />

          {/* Pinned Sessions Content */}
          {pinnedSessions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <Pin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No hay sesiones pineadas</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ve a la pestaña "Todas las Sesiones" y pinea las sesiones que deseas revisar y publicar.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pinnedSessions.map(session => (
                <PeruSessionCard
                  key={session.id}
                  session={session}
                  onTogglePin={togglePinSession}
                  onResolveVideo={resolveSessionVideo}
                  onSetManualUrl={setManualVideoUrl}
                  onUpdateRecording={updateSessionRecording}
                  onOpenDetail={handleOpenSession}
                  showPinButton
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Sessions Tab */}
        <TabsContent value="all" className="mt-6 space-y-6">
          {/* Filters */}
          <SessionsFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            sessions={allSessions}
          />

          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filters.showOnlyRecommended ? "default" : "outline"}
              size="sm"
              onClick={toggleRecommended}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Recomendadas
            </Button>
          </div>

          {/* Sessions List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No se encontraron sesiones</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Intenta ajustar los filtros o sube sesiones desde el sitio web del Congreso.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredSessions.length} de {allSessions.length} sesiones
              </p>
              <div className="space-y-3">
                {filteredSessions.map(session => (
                  <PeruSessionCard
                    key={session.id}
                    session={session}
                    onTogglePin={togglePinSession}
                    onResolveVideo={resolveSessionVideo}
                    onSetManualUrl={setManualVideoUrl}
                    onUpdateRecording={updateSessionRecording}
                    onOpenDetail={handleOpenSession}
                    showPinButton
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <PeruWatchedCommissions
            watchedCommissions={watchedCommissions}
            allCommissions={PERU_COMMISSIONS as unknown as string[]}
            onAdd={addWatchedCommission}
            onRemove={removeWatchedCommission}
          />
        </TabsContent>
      </Tabs>

      {/* Session Detail Drawer */}
      <SessionDetailDrawer
        session={selectedSession}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onPublish={handlePublishSession}
        onUpdateExpertCommentary={updateSessionExpertCommentary}
        onResolveVideo={resolveSessionVideo}
        onSetManualUrl={setManualVideoUrl}
        onUpdateRecording={updateSessionRecording}
      />

      {/* Importer Dialog - Manual upload only */}
      {showImporter && (
        <PeruSessionImporter
          open={showImporter}
          onClose={() => setShowImporter(false)}
          onImport={importSessions}
        />
      )}
    </div>
  );
}