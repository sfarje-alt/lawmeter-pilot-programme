import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientProfile, DETAIL_LEVELS, AREAS, LAW_BRANCHES, SECTORS, INSTRUMENT_TYPES } from "../types";

interface Step8Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

const STAGES = [
  'Presentado',
  'En Comisión',
  'Dictamen',
  'Al Pleno',
  'Aprobado',
  'Publicado',
];

export function Step8ReportDefaults({ data, onChange }: Step8Props) {
  const toggleFilter = (filterType: keyof NonNullable<ClientProfile['reportDefaultFilters']>, value: string) => {
    const currentFilters = data.reportDefaultFilters || {};
    const currentValues = currentFilters[filterType] || [];
    
    if (currentValues.includes(value)) {
      onChange({
        reportDefaultFilters: {
          ...currentFilters,
          [filterType]: currentValues.filter((v: string) => v !== value)
        }
      });
    } else {
      onChange({
        reportDefaultFilters: {
          ...currentFilters,
          [filterType]: [...currentValues, value]
        }
      });
    }
  };

  const isFilterSelected = (filterType: keyof NonNullable<ClientProfile['reportDefaultFilters']>, value: string) => {
    return data.reportDefaultFilters?.[filterType]?.includes(value) || false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Report Defaults</h2>
        <p className="text-sm text-muted-foreground">
          Configure default settings for generated reports (optional)
        </p>
      </div>

      {/* Default Filters */}
      <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border/30">
        <Label className="text-base font-medium">Default Filters</Label>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Areas</Label>
            <div className="flex flex-wrap gap-1">
              {AREAS.slice(0, 6).map((area) => (
                <Badge
                  key={area}
                  variant={isFilterSelected('areas', area) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleFilter('areas', area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Temas (Law Branches)</Label>
            <div className="flex flex-wrap gap-1">
              {LAW_BRANCHES.slice(0, 6).map((branch) => (
                <Badge
                  key={branch}
                  variant={isFilterSelected('themes', branch) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleFilter('themes', branch)}
                >
                  {branch}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Sectores</Label>
            <div className="flex flex-wrap gap-1">
              {SECTORS.slice(0, 6).map((sector) => (
                <Badge
                  key={sector}
                  variant={isFilterSelected('sectors', sector) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleFilter('sectors', sector)}
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Tipos de instrumento</Label>
            <div className="flex flex-wrap gap-1">
              {INSTRUMENT_TYPES.slice(0, 5).map((type) => (
                <Badge
                  key={type}
                  variant={isFilterSelected('types', type) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleFilter('types', type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Fases</Label>
            <div className="flex flex-wrap gap-1">
              {STAGES.map((stage) => (
                <Badge
                  key={stage}
                  variant={isFilterSelected('stages', stage) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleFilter('stages', stage)}
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Include Analytics Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
        <div>
          <Label htmlFor="includeAnalytics">Include Analytics</Label>
          <p className="text-sm text-muted-foreground">
            Add analytics and charts to generated reports
          </p>
        </div>
        <Switch
          id="includeAnalytics"
          checked={data.includeAnalytics}
          onCheckedChange={(checked) => onChange({ includeAnalytics: checked })}
        />
      </div>

      {/* Detail Level */}
      <div className="space-y-2">
        <Label>Detail Level</Label>
        <Select
          value={data.detailLevel}
          onValueChange={(value: 'summary' | 'detailed' | 'comprehensive') => onChange({ detailLevel: value })}
        >
          <SelectTrigger className="bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DETAIL_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Include Expert Commentary */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
        <div>
          <Label htmlFor="includeExpertCommentary">Include Expert Commentary</Label>
          <p className="text-sm text-muted-foreground">
            Add expert analysis and commentary to reports
          </p>
        </div>
        <Switch
          id="includeExpertCommentary"
          checked={data.includeExpertCommentary}
          onCheckedChange={(checked) => onChange({ includeExpertCommentary: checked })}
        />
      </div>

      {/* PDF Naming Convention */}
      <div className="space-y-2">
        <Label htmlFor="pdfNaming">PDF Naming Convention</Label>
        <Input
          id="pdfNaming"
          value={data.pdfNamingConvention || ""}
          onChange={(e) => onChange({ pdfNamingConvention: e.target.value })}
          placeholder="e.g., {client}_{date}_{type}_report"
          className="bg-background/50"
        />
        <p className="text-xs text-muted-foreground">
          Available variables: {'{client}'}, {'{date}'}, {'{type}'}, {'{period}'}
        </p>
      </div>
    </div>
  );
}
