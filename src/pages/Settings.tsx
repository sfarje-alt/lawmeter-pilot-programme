import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  User, Bell, FileText, Phone, Calendar, Mail, Users,
  Building2, Shield, CheckCircle2, ArrowLeft, Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState({
    newAlerts: true,
    clientPublications: true,
    reportGenerated: true,
    weeklyDigest: true,
    emailFrequency: "daily",
  });

  const handleSaveNotifications = () => {
    toast.success("Preferencias de notificación guardadas");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tu cuenta y preferencias de administrador
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-muted/30 grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Cuenta</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Organización</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contacto</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información de la Cuenta
                </CardTitle>
                <CardDescription>
                  Tu información personal y de acceso como administrador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{profile?.full_name || "Administrador"}</h3>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <Badge className="mt-1 bg-primary/20 text-primary border-primary/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrador
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Correo Electrónico</Label>
                    <Input value={profile?.email || ""} disabled className="bg-muted/30" />
                    <p className="text-xs text-muted-foreground">
                      Para cambiar tu correo, contacta a soporte técnico
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>Nombre Completo</Label>
                    <Input value={profile?.full_name || ""} placeholder="Tu nombre completo" />
                  </div>

                  <div className="grid gap-2">
                    <Label>Tipo de Cuenta</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Administrador - Acceso Completo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Puedes revisar, comentar y publicar alertas a clientes
                    </p>
                  </div>
                </div>

                <Button className="w-full">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Preferencias de Notificación
                </CardTitle>
                <CardDescription>
                  Configura cómo y cuándo recibir notificaciones sobre alertas y clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Nuevas Alertas Detectadas</Label>
                      <p className="text-xs text-muted-foreground">
                        Recibe notificación cuando se detecten nuevas alertas legislativas
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.newAlerts}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Publicaciones a Clientes</Label>
                      <p className="text-xs text-muted-foreground">
                        Confirmación cuando una alerta es publicada exitosamente
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.clientPublications}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, clientPublications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Reportes Generados</Label>
                      <p className="text-xs text-muted-foreground">
                        Recibe notificación cuando se generen reportes automáticos
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.reportGenerated}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reportGenerated: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Resumen Semanal</Label>
                      <p className="text-xs text-muted-foreground">
                        Recibe un resumen semanal de actividad de todos los clientes
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Frecuencia de Correos</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "immediate", label: "Inmediato" },
                      { value: "daily", label: "Diario" },
                      { value: "weekly", label: "Semanal" },
                    ].map(option => (
                      <Button
                        key={option.value}
                        variant={notifications.emailFrequency === option.value ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setNotifications(prev => ({ ...prev, emailFrequency: option.value }))}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Settings */}
          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Información de la Organización
                </CardTitle>
                <CardDescription>
                  Datos de tu organización y plan activo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Plan Profesional</h3>
                      <p className="text-sm text-muted-foreground">LawMeter - Monitoreo Regulatorio</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Nombre de la Organización</Label>
                    <Input value="LawMeter Legal Services" placeholder="Nombre de la organización" />
                  </div>

                  <div className="grid gap-2">
                    <Label>País Principal</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-lg">🇵🇪</span>
                      <span>Perú</span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Clientes Activos</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>6 clientes registrados</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Características del Plan</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Monitoreo legislativo ilimitado",
                      "Publicación multi-cliente",
                      "Reportes automatizados",
                      "Calendario de sesiones",
                      "Analytics avanzados",
                      "Comentarios expertos",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Gestionar Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact / Calendly */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Soporte y Contacto
                </CardTitle>
                <CardDescription>
                  Programa una llamada o contacta a nuestro equipo de soporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendly Embed */}
                <div className="bg-muted/30 rounded-lg overflow-hidden">
                  <iframe
                    src="https://calendly.com/lawmeter-demo/30min"
                    width="100%"
                    height="630"
                    frameBorder="0"
                    title="Schedule a meeting"
                    className="border-0"
                  />
                </div>

                <Separator />

                {/* Alternative Contact */}
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ¿Prefieres otro método de contacto?
                  </p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" className="gap-2" asChild>
                      <a href="mailto:soporte@lawmeter.io">
                        <Mail className="h-4 w-4" />
                        soporte@lawmeter.io
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="gap-2" asChild>
                      <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer">
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
