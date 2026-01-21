// Peru Sessions Section - Main container for Peru Congress sessions

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Settings, 
  Video, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Clock,
  RefreshCw,
  Trash2,
  Brain,
  Eye
} from 'lucide-react';
import { usePeruSessions } from '@/hooks/usePeruSessions';
import { PeruSessionCard } from './PeruSessionCard';
import { PeruWatchedCommissions } from './PeruWatchedCommissions';
import { PeruSessionImporter } from './PeruSessionImporter';
import { DemoAnalyzedCard } from './DemoAnalyzedCard';
import { DemoSessionCards } from './DemoSessionCards';
import { DemoRecommendedSessions } from './DemoRecommendedSessions';
import { SessionsFilterBar, SessionsFilters, applySessionFilters } from './SessionsFilterBar';
import { PERU_COMMISSIONS } from '@/types/peruSessions';

const defaultFilters: SessionsFilters = {
  searchQuery: '',
  commissions: [],
  dateFrom: undefined,
  dateTo: undefined,
  quickDateRange: '',
  showOnlyRecommended: false,
  showOnlySelected: false,
  status: [],
};

export function PeruSessionsSection() {
  const [activeTab, setActiveTab] = useState<'monitored' | 'all' | 'settings'>('monitored');
  const [filters, setFilters] = useState<SessionsFilters>(defaultFilters);
  const [showImporter, setShowImporter] = useState(false);

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
  } = usePeruSessions();

  // Apply filters to sessions
  const filteredSessions = useMemo(() => {
    return applySessionFilters(allSessions, filters);
  }, [allSessions, filters]);

  // Get monitored (selected) sessions with filters
  const monitoredSessions = useMemo(() => {
    const monitored = allSessions.filter(s => s.is_selected);
    // Apply filters except showOnlySelected
    const filtersWithoutSelected = { ...filters, showOnlySelected: false };
    return applySessionFilters(monitored, filtersWithoutSelected);
  }, [allSessions, filters]);

  // Calculate analyzed count
  const analyzedCount = useMemo(() => {
    return allSessions.filter(s => s.recording?.analysis_status === 'COMPLETED').length;
  }, [allSessions]);

  const handleClearAll = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todas las sesiones? Esta acción no se puede deshacer.')) {
      await clearAllSessions();
    }
  };

  const handleSync = async () => {
    await syncFromCongress();
  };

  // Toggle filter helpers
  const toggleRecommended = () => {
    setFilters(prev => ({ ...prev, showOnlyRecommended: !prev.showOnlyRecommended }));
  };

  const toggleSelected = () => {
    setFilters(prev => ({ ...prev, showOnlySelected: !prev.showOnlySelected }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-muted-foreground">Recomendadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.recommended}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Seleccionadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.selected}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Con Video</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.withVideo}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Próximas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 border-slate-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-muted-foreground">Completadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Analizadas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{analyzedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'monitored' | 'all' | 'settings')}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="monitored" className="data-[state=active]:bg-background">
              <Eye className="h-4 w-4 mr-2" />
              Sesiones Monitoreadas
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

        {/* Monitored Sessions Tab */}
        <TabsContent value="monitored" className="mt-6 space-y-6">
          {/* Filters for Monitored */}
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

          {/* Demo Cards - Newest first */}
          <DemoSessionCards />

          {/* Demo Analyzed Card - Oldest, shown at bottom */}
          <DemoAnalyzedCard />

          {/* Monitored Sessions Content */}
          {monitoredSessions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No hay sesiones seleccionadas para monitoreo</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ve a la pestaña "Todas las Sesiones" para seleccionar las sesiones que deseas monitorear.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {monitoredSessions.map(session => (
                <PeruSessionCard
                  key={session.id}
                  session={session}
                  onToggleSelection={toggleSessionSelection}
                  onResolveVideo={resolveSessionVideo}
                  onSetManualUrl={setManualVideoUrl}
                  onUpdateRecording={updateSessionRecording}
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
            <Button
              variant={filters.showOnlySelected ? "default" : "outline"}
              size="sm"
              onClick={toggleSelected}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Seleccionadas
            </Button>
          </div>

          {/* Recommendation explanation - shows when filter is active */}
          {filters.showOnlyRecommended && <DemoRecommendedSessions />}

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
                    onToggleSelection={toggleSessionSelection}
                    onResolveVideo={resolveSessionVideo}
                    onSetManualUrl={setManualVideoUrl}
                    onUpdateRecording={updateSessionRecording}
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
