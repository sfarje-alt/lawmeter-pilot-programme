import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Users, Key, Palette, Mail, Phone, Globe, MapPin, 
  Briefcase, Shield, Clock, FileText, Copy, Trash2, Plus,
  Check, X, Edit2, UserPlus, AlertCircle, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { ClientProfile, ClientUser } from "./types";

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

interface InvitationCode {
  id: string;
  code: string;
  maxUsers: number;
  usedCount: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

interface ClientProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientProfile | null;
  onEdit: () => void;
  onUpdateClient?: (client: ClientProfile) => void;
}

export function ClientProfileDrawer({ 
  open, 
  onOpenChange, 
  client, 
  onEdit,
  onUpdateClient 
}: ClientProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIcon, setSelectedIcon] = useState("building");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>([
    {
      id: "inv-001",
      code: "FARMA2024",
      maxUsers: 10,
      usedCount: 4,
      createdAt: "2024-06-15T10:00:00Z",
      isActive: true
    }
  ]);
  const [newCodeMaxUsers, setNewCodeMaxUsers] = useState(5);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  if (!client) return null;

  const generateInvitationCode = () => {
    setIsGeneratingCode(true);
    
    // Generate a random code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const newCode: InvitationCode = {
      id: `inv-${Date.now()}`,
      code,
      maxUsers: newCodeMaxUsers,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    setTimeout(() => {
      setInvitationCodes([...invitationCodes, newCode]);
      setIsGeneratingCode(false);
      toast.success(`Código de invitación generado: ${code}`);
    }, 500);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado al portapapeles");
  };

  const deleteCode = (id: string) => {
    setInvitationCodes(invitationCodes.filter(c => c.id !== id));
    toast.success("Código de invitación eliminado");
  };

  const toggleCodeStatus = (id: string) => {
    setInvitationCodes(invitationCodes.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const deleteUser = (userId: string) => {
    if (!onUpdateClient) return;
    const updatedUsers = client.clientUsers.filter(u => u.id !== userId);
    onUpdateClient({ ...client, clientUsers: updatedUsers });
    toast.success("Usuario eliminado");
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
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }
            >
              {client.status === 'active' ? 'Activo' : 'Pendiente'}
            </Badge>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden mt-4">
          <TabsList className="grid grid-cols-4 flex-shrink-0">
            <TabsTrigger value="overview" className="text-xs">Resumen</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Usuarios</TabsTrigger>
            <TabsTrigger value="invitations" className="text-xs">Invitaciones</TabsTrigger>
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
                          <Badge key={a} className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
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
                    <Label className="text-xs text-muted-foreground">Ramas del Derecho</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.lawBranches.map(b => (
                        <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Palabras Clave</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.keywords.slice(0, 10).map(k => (
                        <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                      ))}
                      {client.keywords.length > 10 && (
                        <Badge variant="outline" className="text-xs">+{client.keywords.length - 10} más</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Áreas Afectadas</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.affectedAreas.map(a => (
                        <Badge key={a.area} className="bg-primary/20 text-primary border-primary/30 text-xs">
                          {a.area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Configuración de Entregas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Canales</Label>
                      <div className="flex gap-2 mt-1">
                        {client.deliveryChannels.email && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Mail className="h-3 w-3" /> Email
                          </Badge>
                        )}
                        {client.deliveryChannels.whatsapp && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Phone className="h-3 w-3" /> WhatsApp
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Zona Horaria</Label>
                      <p className="font-medium">{client.timezone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Reporte Diario</Label>
                      <p className="font-medium">{client.dailyReportSchedule || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Nivel de Detalle</Label>
                      <p className="font-medium capitalize">{client.detailLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pb-4">
                <Button onClick={onEdit} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Editar Configuración Completa
                </Button>
              </div>
            </TabsContent>

            {/* USERS TAB */}
            <TabsContent value="users" className="m-0 space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                      <CardDescription>{client.clientUsers.length} usuarios registrados</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Agregar Usuario
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {client.clientUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No hay usuarios registrados</p>
                      <p className="text-xs">Genera un código de invitación para que los usuarios se registren</p>
                    </div>
                  ) : (
                    client.clientUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.title} • {user.area}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </span>
                              {user.whatsappEnabled && (
                                <Badge variant="outline" className="text-xs h-5">
                                  <Phone className="h-3 w-3 mr-1" />
                                  WhatsApp
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteUser(user.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* INVITATIONS TAB */}
            <TabsContent value="invitations" className="m-0 space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    Generar Nuevo Código
                  </CardTitle>
                  <CardDescription>
                    Los códigos de invitación permiten a los usuarios registrarse como parte de este cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Label htmlFor="maxUsers" className="text-xs">Usuarios Permitidos</Label>
                      <Input
                        id="maxUsers"
                        type="number"
                        min={1}
                        max={100}
                        value={newCodeMaxUsers}
                        onChange={(e) => setNewCodeMaxUsers(parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={generateInvitationCode}
                      disabled={isGeneratingCode}
                      className="gap-2"
                    >
                      {isGeneratingCode ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Generar Código
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Códigos Activos</CardTitle>
                  <CardDescription>{invitationCodes.filter(c => c.isActive).length} códigos activos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {invitationCodes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No hay códigos de invitación</p>
                      <p className="text-xs">Genera un código para permitir el registro de usuarios</p>
                    </div>
                  ) : (
                    invitationCodes.map((code) => (
                      <div key={code.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${code.isActive ? 'bg-emerald-500/20' : 'bg-muted'}`}>
                            <Key className={`h-5 w-5 ${code.isActive ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="font-mono font-bold text-sm bg-background px-2 py-1 rounded">
                                {code.code}
                              </code>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6"
                                onClick={() => copyCode(code.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {code.usedCount}/{code.maxUsers} usuarios
                              </span>
                              <span>
                                Creado: {new Date(code.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant={code.isActive ? "outline" : "secondary"}
                            className="h-8 text-xs"
                            onClick={() => toggleCodeStatus(code.id)}
                          >
                            {code.isActive ? (
                              <><X className="h-3 w-3 mr-1" /> Desactivar</>
                            ) : (
                              <><Check className="h-3 w-3 mr-1" /> Activar</>
                            )}
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-400">Instrucciones de Uso</p>
                      <p className="text-muted-foreground mt-1">
                        Comparte el código de invitación con los usuarios del cliente. Al registrarse, 
                        deberán ingresar este código para ser asociados automáticamente a {client.legalName}.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    Personaliza el ícono y color que identificará a este cliente en el sistema
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
                              ? 'border-white ring-2 ring-primary ring-offset-2 ring-offset-background' 
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
