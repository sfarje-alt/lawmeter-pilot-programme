import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReportConfig } from "../types";
import { SECTORS } from "@/data/peruAlertsMockData";
import { Briefcase, MapPin, Tag } from "lucide-react";

interface Step08Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

// Business areas (áreas legales)
const LEGAL_AREAS = [
  'Salud',
  'Ambiental',
  'Tributario',
  'Laboral',
  'Comercio Exterior',
  'Telecomunicaciones',
  'Energía',
  'Minería',
  'Educación',
  'Agrario',
  'Financiero',
  'Transporte',
  'Defensa del Consumidor',
  'Propiedad Intelectual',
  'Seguridad Social',
];

// Themes (ramas del derecho)
const LAW_THEMES = [
  'Regulación Sectorial',
  'Derechos Fundamentales',
  'Fiscalización y Sanciones',
  'Procedimientos Administrativos',
  'Política Pública',
  'Reforma Institucional',
  'Presupuesto Público',
  'Cooperación Internacional',
];

export function Step08BusinessFilters({ config, onUpdate }: Step08Props) {
  const toggleSector = (sector: string) => {
    const newSectors = config.sectors.includes(sector)
      ? config.sectors.filter(s => s !== sector)
      : [...config.sectors, sector];
    onUpdate({ sectors: newSectors });
  };

  const toggleArea = (area: string) => {
    const newAreas = config.areas.includes(area)
      ? config.areas.filter(a => a !== area)
      : [...config.areas, area];
    onUpdate({ areas: newAreas });
  };

  const toggleTheme = (theme: string) => {
    const newThemes = config.themes.includes(theme)
      ? config.themes.filter(t => t !== theme)
      : [...config.themes, theme];
    onUpdate({ themes: newThemes });
  };

  const selectAllSectors = () => onUpdate({ sectors: [...SECTORS] });
  const clearAllSectors = () => onUpdate({ sectors: [] });
  const selectAllAreas = () => onUpdate({ areas: [...LEGAL_AREAS] });
  const clearAllAreas = () => onUpdate({ areas: [] });
  const selectAllThemes = () => onUpdate({ themes: [...LAW_THEMES] });
  const clearAllThemes = () => onUpdate({ themes: [] });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Filtros de Negocio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Refine el reporte por sector, área y temática (opcional)
        </p>
      </div>

      {/* Sectors */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="font-medium">Sector Económico</span>
            <div className="ml-auto flex items-center gap-2">
              {config.sectors.length > 0 && (
                <Badge variant="secondary">
                  {config.sectors.length}
                </Badge>
              )}
              <button onClick={selectAllSectors} className="text-xs text-primary hover:underline">
                Todos
              </button>
              <span className="text-muted-foreground text-xs">|</span>
              <button onClick={clearAllSectors} className="text-xs text-muted-foreground hover:underline">
                Ninguno
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto">
            {SECTORS.map(sector => (
              <Label
                key={sector}
                htmlFor={`sector-${sector}`}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
              >
                <Checkbox
                  id={`sector-${sector}`}
                  checked={config.sectors.includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                />
                <span className="truncate">{sector}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Areas */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Área Legal</span>
            <div className="ml-auto flex items-center gap-2">
              {config.areas.length > 0 && (
                <Badge variant="secondary">
                  {config.areas.length}
                </Badge>
              )}
              <button onClick={selectAllAreas} className="text-xs text-primary hover:underline">
                Todos
              </button>
              <span className="text-muted-foreground text-xs">|</span>
              <button onClick={clearAllAreas} className="text-xs text-muted-foreground hover:underline">
                Ninguno
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto">
            {LEGAL_AREAS.map(area => (
              <Label
                key={area}
                htmlFor={`area-${area}`}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
              >
                <Checkbox
                  id={`area-${area}`}
                  checked={config.areas.includes(area)}
                  onCheckedChange={() => toggleArea(area)}
                />
                <span className="truncate">{area}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Themes */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium">Temática</span>
            <div className="ml-auto flex items-center gap-2">
              {config.themes.length > 0 && (
                <Badge variant="secondary">
                  {config.themes.length}
                </Badge>
              )}
              <button onClick={selectAllThemes} className="text-xs text-primary hover:underline">
                Todos
              </button>
              <span className="text-muted-foreground text-xs">|</span>
              <button onClick={clearAllThemes} className="text-xs text-muted-foreground hover:underline">
                Ninguno
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LAW_THEMES.map(theme => (
              <Label
                key={theme}
                htmlFor={`theme-${theme}`}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
              >
                <Checkbox
                  id={`theme-${theme}`}
                  checked={config.themes.includes(theme)}
                  onCheckedChange={() => toggleTheme(theme)}
                />
                <span className="truncate">{theme}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
