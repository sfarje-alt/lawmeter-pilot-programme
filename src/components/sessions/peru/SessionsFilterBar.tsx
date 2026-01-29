// Sessions Filter Bar - Dynamic filters for Peru Congress sessions

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MultiSelect } from '@/components/ui/multi-select';
import { Search, Calendar as CalendarIcon, X, RotateCcw } from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { PeruSession } from '@/types/peruSessions';
import { cn } from '@/lib/utils';
import { MOCK_CLIENTS } from '@/data/peruAlertsMockData';

export interface SessionsFilters {
  searchQuery: string;
  commissions: string[];
  clientIds: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  quickDateRange: string;
  showOnlyRecommended: boolean;
  showOnlySelected: boolean;
  status: string[];
}

interface SessionsFilterBarProps {
  filters: SessionsFilters;
  onFiltersChange: (filters: SessionsFilters) => void;
  sessions: PeruSession[];
}

const QUICK_DATE_OPTIONS = [
  { label: 'Últimos 7 días', value: '7' },
  { label: 'Últimos 15 días', value: '15' },
  { label: 'Últimos 30 días', value: '30' },
  { label: 'Últimos 60 días', value: '60' },
  { label: 'Últimos 90 días', value: '90' },
];

export function SessionsFilterBar({
  filters,
  onFiltersChange,
  sessions,
}: SessionsFilterBarProps) {
  // Extract unique commissions from sessions dynamically
  const availableCommissions = useMemo(() => {
    const commissions = new Set<string>();
    sessions.forEach(session => {
      if (session.commission_name) {
        commissions.add(session.commission_name);
      }
    });
    return Array.from(commissions).sort();
  }, [sessions]);

  // Extract unique statuses from sessions dynamically
  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>();
    sessions.forEach(session => {
      if (session.status) {
        statuses.add(session.status);
      }
    });
    return Array.from(statuses);
  }, [sessions]);

  // Available clients
  const availableClients = useMemo(() => {
    return MOCK_CLIENTS.map(c => ({ id: c.id, name: c.name }));
  }, []);

  const statusLabels: Record<string, string> = {
    scheduled: 'Programada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    unknown: 'Desconocido',
  };

  const updateFilter = <K extends keyof SessionsFilters>(
    key: K,
    value: SessionsFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleQuickDateSelect = (days: string) => {
    if (filters.quickDateRange === days) {
      // Toggle off
      updateFilter('quickDateRange', '');
      updateFilter('dateFrom', undefined);
      updateFilter('dateTo', undefined);
    } else {
      const from = subDays(new Date(), parseInt(days));
      updateFilter('quickDateRange', days);
      updateFilter('dateFrom', from);
      updateFilter('dateTo', new Date());
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      commissions: [],
      clientIds: [],
      dateFrom: undefined,
      dateTo: undefined,
      quickDateRange: '',
      showOnlyRecommended: false,
      showOnlySelected: false,
      status: [],
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.commissions.length > 0) count++;
    if (filters.clientIds.length > 0) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.showOnlyRecommended) count++;
    if (filters.showOnlySelected) count++;
    if (filters.status.length > 0) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre de comisión..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Commission Multi-Select */}
        <MultiSelect
          options={availableCommissions.map(c => ({ label: c, value: c }))}
          selected={filters.commissions}
          onChange={(selected) => updateFilter('commissions', selected)}
          placeholder="Comisión: Todas"
          className="min-w-[180px]"
        />

        {/* Client Multi-Select */}
        <MultiSelect
          options={availableClients.map(c => ({ label: c.name, value: c.id }))}
          selected={filters.clientIds}
          onChange={(selected) => updateFilter('clientIds', selected)}
          placeholder="Cliente: Todos"
          className="min-w-[170px]"
        />

        {/* Status Multi-Select */}
        {availableStatuses.length > 0 && (
          <MultiSelect
            options={availableStatuses.map(s => ({ 
              label: statusLabels[s] || s, 
              value: s 
            }))}
            selected={filters.status}
            onChange={(selected) => updateFilter('status', selected)}
            placeholder="Estado: Todos"
            className="min-w-[150px]"
          />
        )}

        {/* Date Range Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {filters.dateFrom && filters.dateTo ? (
                <span className="text-sm">
                  {format(filters.dateFrom, 'dd/MM', { locale: es })} - {format(filters.dateTo, 'dd/MM', { locale: es })}
                </span>
              ) : (
                <span>Fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 bg-popover border border-border" align="start">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Desde</label>
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => {
                      updateFilter('dateFrom', date);
                      updateFilter('quickDateRange', '');
                    }}
                    className={cn("p-0 pointer-events-auto bg-background")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Hasta</label>
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => {
                      updateFilter('dateTo', date);
                      updateFilter('quickDateRange', '');
                    }}
                    className={cn("p-0 pointer-events-auto bg-background")}
                  />
                </div>
              </div>
              {(filters.dateFrom || filters.dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateFilter('dateFrom', undefined);
                    updateFilter('dateTo', undefined);
                    updateFilter('quickDateRange', '');
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar fechas
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpiar ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Quick Date Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Acceso rápido:</span>
        {QUICK_DATE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filters.quickDateRange === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickDateSelect(option.value)}
            className="text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Helper function to apply filters to sessions
export function applySessionFilters(
  sessions: PeruSession[],
  filters: SessionsFilters,
  clientWatchedCommissions?: Map<string, string[]>
): PeruSession[] {
  return sessions.filter(session => {
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        session.commission_name?.toLowerCase().includes(query) ||
        session.session_title?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Commission filter
    if (filters.commissions.length > 0) {
      if (!filters.commissions.includes(session.commission_name)) {
        return false;
      }
    }

    // Client filter - show sessions for commissions that selected clients are watching
    if (filters.clientIds.length > 0 && clientWatchedCommissions) {
      const watchedBySelectedClients = filters.clientIds.some(clientId => {
        const commissions = clientWatchedCommissions.get(clientId);
        return commissions && commissions.includes(session.commission_name);
      });
      if (!watchedBySelectedClients) {
        return false;
      }
    }

    // Status filter
    if (filters.status.length > 0) {
      if (!filters.status.includes(session.status)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const sessionDate = session.scheduled_at ? new Date(session.scheduled_at) : null;
      if (!sessionDate) return false;
      
      if (filters.dateFrom && filters.dateTo) {
        if (!isWithinInterval(sessionDate, {
          start: startOfDay(filters.dateFrom),
          end: endOfDay(filters.dateTo),
        })) {
          return false;
        }
      } else if (filters.dateFrom && sessionDate < startOfDay(filters.dateFrom)) {
        return false;
      } else if (filters.dateTo && sessionDate > endOfDay(filters.dateTo)) {
        return false;
      }
    }

    // Recommended filter
    if (filters.showOnlyRecommended && !session.is_recommended) {
      return false;
    }

    // Selected filter
    if (filters.showOnlySelected && !session.is_selected) {
      return false;
    }

    return true;
  });
}
