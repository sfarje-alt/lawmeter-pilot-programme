// Analytics Design System - Standardized Color Palette
// All colors are HSL values for consistency with the design system

export const ANALYTICS_COLORS = {
  // Legislation types (consistent across entire app)
  legislationType: {
    bills: 'hsl(220, 70%, 55%)',         // Blue for Proyectos de Ley
    regulations: 'hsl(160, 60%, 45%)',   // Green for Normas/Reglamentos
  },

  // Legislative stages (consistent across funnel, timelines, etc.)
  stages: {
    comision: 'hsl(210, 60%, 55%)',      // Light blue
    dictamen: 'hsl(230, 55%, 50%)',      // Deeper blue
    pleno: 'hsl(270, 50%, 55%)',         // Purple
    tramite: 'hsl(30, 70%, 55%)',        // Orange
    publicado: 'hsl(140, 55%, 45%)',     // Green
    archivado: 'hsl(0, 0%, 50%)',        // Gray
    agenda: 'hsl(190, 60%, 50%)',        // Cyan
    observado: 'hsl(45, 80%, 50%)',      // Yellow
    promulgado: 'hsl(150, 60%, 40%)',    // Darker green
  },

  // Impact levels with associated icons for accessibility
  impact: {
    grave: {
      color: 'hsl(0, 65%, 50%)',         // Red
      background: 'hsl(0, 65%, 95%)',
      icon: 'alert-triangle',
      label: 'Grave',
    },
    medio: {
      color: 'hsl(40, 75%, 50%)',        // Amber
      background: 'hsl(40, 75%, 95%)',
      icon: 'alert-circle',
      label: 'Medio',
    },
    leve: {
      color: 'hsl(0, 0%, 55%)',          // Gray
      background: 'hsl(0, 0%, 95%)',
      icon: 'minus-circle',
      label: 'Leve',
    },
    positivo: {
      color: 'hsl(140, 55%, 45%)',       // Green
      background: 'hsl(140, 55%, 95%)',
      icon: 'check-circle',
      label: 'Positivo',
    },
  },

  // Urgency levels
  urgency: {
    alta: {
      color: 'hsl(0, 70%, 55%)',         // Red
      label: 'Alta',
    },
    media: {
      color: 'hsl(45, 80%, 50%)',        // Yellow
      label: 'Media',
    },
    baja: {
      color: 'hsl(200, 50%, 55%)',       // Light blue
      label: 'Baja',
    },
  },

  // Attention color (single accent for high-attention states)
  attention: 'hsl(0, 75%, 55%)',

  // Trend indicators
  trend: {
    up: 'hsl(140, 55%, 45%)',            // Green for positive
    down: 'hsl(0, 65%, 50%)',            // Red for negative
    stable: 'hsl(0, 0%, 55%)',           // Gray for no change
  },

  // Neutral scale for rankings and general charts
  neutral: [
    'hsl(220, 50%, 45%)',
    'hsl(220, 45%, 55%)',
    'hsl(220, 40%, 65%)',
    'hsl(220, 35%, 75%)',
    'hsl(220, 30%, 82%)',
    'hsl(220, 25%, 88%)',
  ],

  // Chart-specific colors
  chart: {
    primary: 'hsl(220, 70%, 55%)',
    secondary: 'hsl(160, 60%, 45%)',
    tertiary: 'hsl(270, 50%, 55%)',
    quaternary: 'hsl(30, 70%, 55%)',
    
    // For stacked/grouped charts
    published: 'hsl(140, 55%, 45%)',
    unpublished: 'hsl(0, 0%, 70%)',
    
    // Grid and axes — design-system tokens (work for both light/dark)
    grid: 'hsl(var(--border))',
    axis: 'hsl(var(--muted-foreground))',
    axisLabel: 'hsl(var(--muted-foreground))',
  },

  // Background colors for cards
  cardBackground: {
    default: 'hsl(220, 20%, 98%)',
    hover: 'hsl(220, 20%, 95%)',
    selected: 'hsl(220, 50%, 95%)',
  },

  // Empty state
  empty: 'hsl(220, 10%, 70%)',
};

// Helper to get impact color by level
export function getImpactColor(level: string): string {
  const normalized = level.toLowerCase();
  return ANALYTICS_COLORS.impact[normalized as keyof typeof ANALYTICS_COLORS.impact]?.color 
    || ANALYTICS_COLORS.impact.leve.color;
}

// Helper to get impact background by level
export function getImpactBackground(level: string): string {
  const normalized = level.toLowerCase();
  return ANALYTICS_COLORS.impact[normalized as keyof typeof ANALYTICS_COLORS.impact]?.background 
    || ANALYTICS_COLORS.impact.leve.background;
}

// Helper to get impact icon by level
export function getImpactIcon(level: string): string {
  const normalized = level.toLowerCase();
  return ANALYTICS_COLORS.impact[normalized as keyof typeof ANALYTICS_COLORS.impact]?.icon 
    || 'minus-circle';
}

// Helper to get stage color
export function getStageColor(stage: string): string {
  const normalized = stage.toLowerCase().replace(/\s+/g, '_');
  
  // Map common stage names
  const stageMap: Record<string, keyof typeof ANALYTICS_COLORS.stages> = {
    'en_comisión': 'comision',
    'en_comision': 'comision',
    'comision': 'comision',
    'dictamen': 'dictamen',
    'pleno': 'pleno',
    'en_agenda_del_pleno': 'agenda',
    'agenda': 'agenda',
    'trámite_final': 'tramite',
    'tramite_final': 'tramite',
    'tramite': 'tramite',
    'publicada': 'publicado',
    'publicado': 'publicado',
    'promulgada': 'promulgado',
    'promulgado': 'promulgado',
    'archivado': 'archivado',
    'al_archivo': 'archivado',
    'observado': 'observado',
  };

  const key = stageMap[normalized];
  return key ? ANALYTICS_COLORS.stages[key] : ANALYTICS_COLORS.neutral[0];
}

// Helper to get trend color
export function getTrendColor(direction: 'up' | 'down' | 'stable'): string {
  return ANALYTICS_COLORS.trend[direction];
}

// Helper to get neutral color from scale
export function getNeutralColor(index: number): string {
  return ANALYTICS_COLORS.neutral[index % ANALYTICS_COLORS.neutral.length];
}

// Helper to get legislation type color
export function getLegislationTypeColor(type: 'bills' | 'regulations' | string): string {
  if (type === 'bills' || type.toLowerCase().includes('proyecto')) {
    return ANALYTICS_COLORS.legislationType.bills;
  }
  return ANALYTICS_COLORS.legislationType.regulations;
}

// Chart color palette for multi-series
export const CHART_COLOR_PALETTE = [
  ANALYTICS_COLORS.chart.primary,
  ANALYTICS_COLORS.chart.secondary,
  ANALYTICS_COLORS.chart.tertiary,
  ANALYTICS_COLORS.chart.quaternary,
  ...ANALYTICS_COLORS.neutral.slice(0, 3),
];

// Accessibility patterns for charts (for colorblind users)
export const CHART_PATTERNS = [
  'solid',
  'diagonal-stripes',
  'dots',
  'horizontal-stripes',
  'crosshatch',
];
