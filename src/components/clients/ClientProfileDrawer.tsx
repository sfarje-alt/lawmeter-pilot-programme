import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Building2, Palette, Globe, MapPin,
  Briefcase, Shield, FileText, Check,
  Edit2, Sparkles, AlertTriangle, Zap, Trash2, Users,
} from "lucide-react";
import { toast } from "sonner";
import { ClientProfile } from "./types";

// Available icons for client identification
const CLIENT_ICONS = [
  { id: "building", icon: Building2, label: "Edificio" },
  { id: "briefcase", icon: Briefcase, label: "Maletín" },
  { id: "shield", icon: Shield, label: "Escudo" },
  { id: "globe", icon: Globe, label: "Globo" },
  { id: "users", icon: Users, label: "Usuarios" },
  { id: "file", icon: FileText, label: "Documento" },
];

// Available colors for client identification
const CLIENT_COLORS = [
  { id: "blue", color: "hsl(217, 91%, 60%)", label: "Azul" },
  { id: "emerald", color: "hsl(160, 84%, 39%)", label: "Esmeralda" },
  { id: "amber", color: "hsl(45, 93%, 47%)", label: "Ámbar" },
  { id: "rose", color: "hsl(350, 89%, 60%)", label: "Rosa" },
  { id: "purple", color: "hsl(270, 76%, 60%)", label: "Púrpura" },
  { id: "cyan", color: "hsl(190, 95%, 45%)", label: "Cian" },
  { id: "orange", color: "hsl(25, 95%, 53%)", label: "Naranja" },
  { id: "indigo", color: "hsl(235, 85%, 60%)", label: "Índigo" },
];

interface ClientProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientProfile | null;
  onEdit: () => void;
  onUpdateClient?: (client: ClientProfile) => void;
  onDeleteClient?: (clientId: string) => void;
}

export function ClientProfileDrawer({
  open,
  onOpenChange,
  client,
  onEdit,
  onDeleteClient,
}: ClientProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIcon, setSelectedIcon] = useState("building");
  const [selectedColor, setSelectedColor] = useState("blue");

  if (!client) return null;

  const handleDelete = () => {
    if (!client.id || !onDeleteClient) return;
    if (window.confirm(`¿Eliminar el perfil "${client.legalName}"? Esta acción no se puede deshacer.`)) {
      onDeleteClient(client.id);
      toast.success("Perfil eliminado");
      onOpenChange(false);
    }
  };

  const getSelectedIconComponent = () => {
    const iconData = CLIENT_ICONS.find(i => i.id === selectedIcon);
    return iconData?.icon || Building2;
  };

  const getSelectedColorValue = () => {
    const colorData = CLIENT_COLORS.find(c => c.id === selectedColor);
    return colorData?.color || CLIENT_COLORS[0].color;
  };

  const IconComponent = getSelectedIconComponent();
  const hasAICriteria = !!(client.highImpactCriteria?.trim() || client.highUrgencyCriteria?.trim());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${getSelectedColorValue()}20` }}
            >
              <IconComponent
                className="h-7 w-7"
                style={{ color: getSelectedColorValue() }}
              />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl">{client.legalName}</SheetTitle>
              {client.tradeName && (
                <p className="text-sm text-muted-foreground">{client.tradeName}</p>
              )}
            </div>
            <Badge
              className={client.status === 'active'
                ? "bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.35)]"
                : "bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.35)]"
              }
            >
              {client.status === 'active' ? 'Activo' : 'Pendiente'}
            </Badge>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden mt-4">
          <TabsList className="grid grid-cols-3 flex-shrink-0">
            <TabsTrigger value="overview" className="text-xs">Resumen</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" /> Criterios IA
            </TabsTrigger>
            <TabsTrigger value="branding" className="text-xs">Identidad</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="m-0 space-y-4">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Razón Social</Label>
                      <p className="font-medium">{client.legalName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Nombre Comercial</Label>
                      <p className="font-medium">{client.tradeName || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Tipo de Empresa</Label>
                      <p className="font-medium">{client.companyType || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sitio Web</Label>
                      <p className="font-medium text-primary">{client.website || '-'}</p>
                    </div>
                  </div>
                  {client.shortDescription && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Descripción</Label>
                      <p className="text-muted-foreground">{client.shortDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Alcance de Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Sector Principal</Label>
                      <p className="font-medium">{client.primarySector || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sectores Secundarios</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.secondarySectors.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Ubicaciones</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.locations.map((loc, i) => (
                        <Badge key={i} variant="outline" className="text-xs gap-1">
                          <MapPin className="h-3 w-3" />
                          {loc.country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {client.isRegulated && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Entidades Supervisoras</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {client.supervisingAuthorities.map(a => (
                          <Badge key={a} className="bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.35)] text-xs">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Alcance de Monitoreo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Palabras Clave</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.keywords.slice(0, 12).map(k => (
                        <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                      ))}
                      {client.keywords.length > 12 && (
                        <Badge variant="outline" className="text-xs">+{client.keywords.length - 12} más</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tipos de Instrumentos</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.instrumentTypes.slice(0, 8).map(t => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                      {client.instrumentTypes.length > 8 && (
                        <Badge variant="secondary" className="text-xs">+{client.instrumentTypes.length - 8}</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Categorías de Etiquetas</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(client.tagCategories || []).map(cat => (
                        <Badge key={cat.id} className="bg-primary/20 text-primary border-primary/30 text-xs">
                          {cat.name} ({cat.tags.length})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center pb-4">
                {onDeleteClient && client.id && (
                  <Button onClick={handleDelete} variant="outline" className="gap-2 text-destructive hover:text-destructive border-destructive/30">
                    <Trash2 className="h-4 w-4" />
                    Eliminar Perfil
                  </Button>
                )}
                <Button onClick={onEdit} className="gap-2 ml-auto">
                  <Edit2 className="h-4 w-4" />
                  Editar Perfil
                </Button>
              </div>
            </TabsContent>

            {/* AI CRITERIA TAB */}
            <TabsContent value="ai" className="m-0 space-y-4">
              <Card className="border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.05)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Criterios de Clasificación IA
                  </CardTitle>
                  <CardDescription>
                    La IA usa estos criterios para asignar Impacto y Urgencia a cada alerta entrante asociada a este perfil.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasAICriteria && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No has definido criterios de IA. Edita el perfil para configurarlos.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" />
                    Criterios de Alto Impacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {client.highImpactCriteria?.trim() ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{client.highImpactCriteria}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin criterios definidos.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[hsl(var(--warning))]" />
                    Criterios de Alta Urgencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {client.highUrgencyCriteria?.trim() ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{client.highUrgencyCriteria}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin criterios definidos.</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end pb-4">
                <Button onClick={onEdit} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Editar Criterios IA
                </Button>
              </div>
            </TabsContent>

            {/* BRANDING TAB */}
            <TabsContent value="branding" className="m-0 space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    Identidad Visual
                  </CardTitle>
                  <CardDescription>
                    Personaliza el ícono y color que identificará a este perfil en el sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preview */}
                  <div className="flex items-center justify-center py-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all"
                      style={{ backgroundColor: `${getSelectedColorValue()}20` }}
                    >
                      <IconComponent
                        className="h-10 w-10 transition-all"
                        style={{ color: getSelectedColorValue() }}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Icon Selection */}
                  <div>
                    <Label className="text-sm mb-3 block">Seleccionar Ícono</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {CLIENT_ICONS.map((iconOption) => {
                        const Icon = iconOption.icon;
                        return (
                          <button
                            key={iconOption.id}
                            onClick={() => setSelectedIcon(iconOption.id)}
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                              selectedIcon === iconOption.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border/50 hover:border-primary/50 bg-muted/30'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${selectedIcon === iconOption.id ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="text-xs text-muted-foreground">{iconOption.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <Label className="text-sm mb-3 block">Seleccionar Color</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {CLIENT_COLORS.map((colorOption) => (
                        <button
                          key={colorOption.id}
                          onClick={() => setSelectedColor(colorOption.id)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            selectedColor === colorOption.id
                              ? 'border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                              : 'border-transparent hover:scale-110'
                          }`}
                          style={{ backgroundColor: colorOption.color }}
                          title={colorOption.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => toast.success("Identidad visual guardada")}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
