// Peru Sessions Section - Main container for Peru Congress sessions

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  Settings, 
  Video, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Clock,
  Search,
  Filter,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { usePeruSessions } from '@/hooks/usePeruSessions';
import { PeruSessionCard } from './PeruSessionCard';
import { PeruWatchedCommissions } from './PeruWatchedCommissions';
import { PeruSessionImporter } from './PeruSessionImporter';
import { PERU_COMMISSIONS } from '@/types/peruSessions';

export function PeruSessionsSection() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'settings'>('sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showImporter, setShowImporter] = useState(false);

  const {
    sessions,
    watchedCommissions,
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
  } = usePeruSessions({
    commissionFilter: searchQuery,
    showOnlyRecommended,
    showOnlySelected,
  });

  const handleClearAll = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todas las sesiones? Esta acción no se puede deshacer.')) {
      await clearAllSessions();
    }
  };

  const handleSync = async () => {
    await syncFromCongress();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
              <span className="text-sm text-muted-foreground">Recommended</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.recommended}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Selected</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.selected}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">With Video</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.withVideo}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 border-slate-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'sessions' | 'settings')}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="sessions" className="data-[state=active]:bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-background">
              <Settings className="h-4 w-4 mr-2" />
              Monitoring Settings
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
              Upload Manual
            </Button>
            {stats.total > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🇵🇪</span>
                    Peru Congress Sessions
                  </CardTitle>
                  <CardDescription>
                    Committee sessions from Congreso de la República del Perú
                  </CardDescription>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by commission name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Button
                  variant={showOnlyRecommended ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
                  className="gap-2"
                >
                  <Star className="h-4 w-4" />
                  Recommended
                </Button>

                <Button
                  variant={showOnlySelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlySelected(!showOnlySelected)}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Selected
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No sessions found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters or upload sessions from the Congress website.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {sessions.map(session => (
                      <PeruSessionCard
                        key={session.id}
                        session={session}
                        onToggleSelection={toggleSessionSelection}
                        onResolveVideo={resolveSessionVideo}
                        onSetManualUrl={setManualVideoUrl}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
