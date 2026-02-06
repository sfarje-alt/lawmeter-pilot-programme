import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  Target,
  Activity,
  Users,
  Layers,
  Sparkles,
  Shield,
  Gauge,
  LayoutTemplate,
  Save,
  RotateCcw,
} from "lucide-react";
import { AnalyticsBlockConfig, CLIENT_ANALYTICS_BLOCKS } from "@/types/analytics";
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
  industry_benchmark: Target,
};

interface SortableBlockItemProps {
  block: AnalyticsBlockConfig;
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
        flex items-center gap-3 p-3 rounded-lg border transition-all
        ${isDragging ? "opacity-50 border-primary bg-primary/5" : "border-border/50 bg-card/50"}
        ${block.enabled ? "" : "opacity-60"}
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Icon */}
      <div className={`p-2 rounded-lg ${block.enabled ? "bg-primary/10" : "bg-muted"}`}>
        <Icon className={`h-4 w-4 ${block.enabled ? "text-primary" : "text-muted-foreground"}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${block.enabled ? "text-foreground" : "text-muted-foreground"}`}>
            {block.title}
          </span>
          {block.visibility === "internal" && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30 text-amber-500">
              Interno
            </Badge>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground truncate cursor-help">
                {block.takeaway}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-xs">{block.infoTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Toggle */}
      <button
        onClick={() => onToggle(block.key)}
        className="p-1.5 rounded hover:bg-muted/50 transition-colors"
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
  blocks: AnalyticsBlockConfig[];
  onChange: (blocks: AnalyticsBlockConfig[]) => void;
  onSaveTemplate?: (name: string) => void;
  showInternalBlocks?: boolean;
}

export function ReportLayoutBuilder({
  blocks,
  onChange,
  onSaveTemplate,
  showInternalBlocks = false,
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

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Configurar Analíticas del Reporte</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {enabledCount} de {visibleBlocks.length} activas
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Arrastra para reordenar. Máximo 3-5 bloques recomendados para el PDF.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={enableAll} className="text-xs">
            Activar todas
          </Button>
          <Button variant="outline" size="sm" onClick={disableAll} className="text-xs">
            Desactivar todas
          </Button>
          <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-xs ml-auto">
            <RotateCcw className="h-3 w-3 mr-1" />
            Restablecer
          </Button>
        </div>

        <Separator />

        {/* Sortable List */}
        <ScrollArea className="h-[400px] pr-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleBlocks.map(b => b.key)}
              strategy={verticalListSortingStrategy}
            >
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
            </SortableContext>
          </DndContext>
        </ScrollArea>

        {/* Warning for too many blocks */}
        {enabledCount > 5 && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-600 dark:text-amber-400">
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
