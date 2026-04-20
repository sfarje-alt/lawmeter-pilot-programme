import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  PieChart,
  Grid3X3,
  Activity,
  Users,
  Layers,
  Sparkles,
  Shield,
  Gauge,
  LayoutTemplate,
  Save,
  RotateCcw,
  Clock,
  Bot,
  FileBarChart,
  Eye as EyeIcon,
} from "lucide-react";
import { CLIENT_ANALYTICS_BLOCKS, type AnalyticsBlockConfigExtended } from "@/types/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icon mapping for block types
const blockIcons: Record<string, React.ElementType> = {
  impact_matrix: Grid3X3,
  regulatory_pulse: Activity,
  alert_priority: TrendingUp,
  alert_distribution: PieChart,
  top_entities: Users,
  legislative_funnel: Layers,
  key_movements: Sparkles,
  popular_topics: BarChart3,
  emerging_topics: TrendingUp,
  exposure: Shield,
  service_kpis: Gauge,
  editorial_response_time: Activity,
  pin_archive: Shield,
  reviewed_alerts: EyeIcon,
  detection_to_action_time: Clock,
  ai_usage: Bot,
  reports_generated: FileBarChart,
};

interface SortableBlockItemProps {
  block: AnalyticsBlockConfigExtended;
  onToggle: (key: string) => void;
}

function SortableBlockItem({ block, onToggle }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = blockIcons[block.key] || BarChart3;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-start gap-3 p-4 rounded-lg border transition-all
        ${isDragging ? "opacity-50 border-primary bg-primary/5 shadow-lg" : "border-border/60 bg-card/60 hover:border-border hover:bg-card"}
        ${block.enabled ? "" : "opacity-70"}
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-muted/60 text-muted-foreground flex-shrink-0 mt-0.5"
        aria-label="Reordenar bloque"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Icon */}
      <div className={`p-2 rounded-lg flex-shrink-0 ${block.enabled ? "bg-primary/10" : "bg-muted/40"}`}>
        <Icon className={`h-4 w-4 ${block.enabled ? "text-primary" : "text-muted-foreground"}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`font-medium text-sm ${block.enabled ? "text-foreground" : "text-muted-foreground"}`}>
            {block.title}
          </span>
          {block.visibility === "internal" && (
            <Badge variant="outline" className="text-[10px] h-5 bg-warning/10 border-warning/30 text-warning">
              Interno
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {block.takeaway}
        </p>
        <p className="text-[11px] text-muted-foreground/70 italic mt-1.5 line-clamp-2">
          {block.infoTooltip}
        </p>
      </div>

      {/* Toggle */}
      <button
        onClick={() => onToggle(block.key)}
        className={`p-2 rounded-md transition-colors flex-shrink-0 ${
          block.enabled ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted/60"
        }`}
        aria-label={block.enabled ? "Ocultar bloque" : "Mostrar bloque"}
      >
        {block.enabled ? (
          <Eye className="h-4 w-4 text-primary" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

interface ReportLayoutBuilderProps {
  blocks: AnalyticsBlockConfigExtended[];
  onChange: (blocks: AnalyticsBlockConfigExtended[]) => void;
  onSaveTemplate?: (name: string) => void;
  showInternalBlocks?: boolean;
  mode?: 'report' | 'dashboard';
}

export function ReportLayoutBuilder({
  blocks,
  onChange,
  onSaveTemplate,
  showInternalBlocks = false,
  mode = 'report',
}: ReportLayoutBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter blocks based on visibility
  const visibleBlocks = useMemo(() => {
    if (showInternalBlocks) return blocks;
    return blocks.filter(b => b.visibility === "client" || b.visibility === "both");
  }, [blocks, showInternalBlocks]);

  const enabledCount = visibleBlocks.filter(b => b.enabled).length;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.key === active.id);
      const newIndex = blocks.findIndex(b => b.key === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index,
      }));

      onChange(newBlocks);
    }
  };

  const toggleBlock = (key: string) => {
    const newBlocks = blocks.map(block =>
      block.key === key ? { ...block, enabled: !block.enabled } : block
    );
    onChange(newBlocks);
  };

  const enableAll = () => {
    const newBlocks = blocks.map(block => ({
      ...block,
      enabled: showInternalBlocks || block.visibility !== "internal",
    }));
    onChange(newBlocks);
  };

  const disableAll = () => {
    const newBlocks = blocks.map(block => ({ ...block, enabled: false }));
    onChange(newBlocks);
  };

  const resetToDefault = () => {
    // Reset to default order and enabled states from CLIENT_ANALYTICS_BLOCKS
    const defaultBlocks = CLIENT_ANALYTICS_BLOCKS.map((block, index) => ({
      ...block,
      order: index,
      enabled: block.renderPDF,
    }));
    onChange(defaultBlocks);
  };

  const isDashboard = mode === 'dashboard';

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">
              {isDashboard ? 'Bloques del Dashboard' : 'Configurar Analíticas del Reporte'}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {enabledCount} de {visibleBlocks.length} activas
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {isDashboard
            ? 'Arrastra para reordenar. Usa los toggles para mostrar u ocultar cada bloque del dashboard.'
            : 'Arrastra para reordenar. Máximo 3-5 bloques recomendados para el PDF.'}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={enableAll} className="text-xs">
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Activar todas
          </Button>
          <Button variant="outline" size="sm" onClick={disableAll} className="text-xs">
            <EyeOff className="h-3.5 w-3.5 mr-1.5" />
            Desactivar todas
          </Button>
          <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-xs ml-auto">
            <RotateCcw className="h-3 w-3 mr-1" />
            Restablecer
          </Button>
        </div>

        <Separator />

        {/* Sortable List — grid layout in dashboard mode for better use of width */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleBlocks.map(b => b.key)}
            strategy={verticalListSortingStrategy}
          >
            {isDashboard ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleBlocks
                  .sort((a, b) => a.order - b.order)
                  .map(block => (
                    <SortableBlockItem
                      key={block.key}
                      block={block}
                      onToggle={toggleBlock}
                    />
                  ))}
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {visibleBlocks
                    .sort((a, b) => a.order - b.order)
                    .map(block => (
                      <SortableBlockItem
                        key={block.key}
                        block={block}
                        onToggle={toggleBlock}
                      />
                    ))}
                </div>
              </ScrollArea>
            )}
          </SortableContext>
        </DndContext>

        {/* Warning for too many blocks (only for PDF mode) */}
        {!isDashboard && enabledCount > 5 && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
            <p className="text-xs text-warning">
              ⚠️ Tienes {enabledCount} bloques activos. Se recomienda máximo 5 para mantener el PDF legible.
            </p>
          </div>
        )}

        {/* Save Template (optional) */}
        {onSaveTemplate && (
          <>
            <Separator />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onSaveTemplate("Mi Plantilla")}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar como Plantilla
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
