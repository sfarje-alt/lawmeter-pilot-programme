import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  User, Bell, FileText, Phone, Calendar, Mail, 
  Building2, Shield, CheckCircle2, ExternalLink
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientUser } from "@/hooks/useClientUser";
import { toast } from "sonner";

export function ClientSettings() {
  const { profile } = useAuth();
  const { clientName } = useClientUser();
  const [notifications, setNotifications] = useState({
    newAlerts: true,
    reportGenerated: true,
    weeklyDigest: true,
    emailFrequency: "immediate",
  });

  const handleSaveNotifications = () => {
    toast.success("Preferencias de notificación guardadas");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="account">
        <TabsList className="bg-muted/30 grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Cuenta</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Facturación</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contacto</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información de la Cuenta
              </CardTitle>
              <CardDescription>
                Tu información personal y de acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{profile?.full_name || "Usuario"}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    Cliente
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Correo Electrónico</Label>
                  <Input value={profile?.email || ""} disabled className="bg-muted/30" />
                  <p className="text-xs text-muted-foreground">
                    Para cambiar tu correo, contacta a tu administrador
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Organización</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{clientName || "Sin organización"}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Tipo de Cuenta</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Cliente - Acceso de Solo Lectura</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Preferencias de Notificación
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Nuevas Alertas Publicadas</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe notificación cuando se publiquen nuevas alertas para tu organización
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.newAlerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Reportes Generados</Label>
                    <p className="text-xs text-muted-foreground">
                      Recibe notificación cuando se genere un nuevo reporte
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
                      Recibe un resumen semanal de toda la actividad
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

        {/* Invoicing (Terms) */}
        <TabsContent value="invoicing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Términos y Condiciones
              </CardTitle>
              <CardDescription>
                Información sobre tu suscripción y términos del servicio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Plan Activo</h3>
                    <p className="text-sm text-muted-foreground">Acceso Cliente - Monitoreo Regulatorio</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Términos del Servicio</h4>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">1. Acceso:</strong> Tu acceso al servicio de monitoreo regulatorio 
                    está gestionado por tu equipo legal designado. Tienes acceso de solo lectura a las alertas 
                    y reportes publicados específicamente para tu organización.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">2. Contenido:</strong> Las alertas, análisis y comentarios 
                    expertos son preparados por profesionales legales. El contenido es informativo y no 
                    constituye asesoría legal formal.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">3. Confidencialidad:</strong> Toda la información 
                    compartida a través de la plataforma es confidencial y no debe ser compartida 
                    fuera de tu organización sin autorización previa.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">4. Facturación:</strong> Los términos de facturación 
                    son acordados directamente con tu equipo legal. Para consultas sobre pagos, 
                    contacta a tu representante de cuenta.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Para más información sobre términos, condiciones o facturación
                </p>
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contactar Soporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact / Calendly */}
        <TabsContent value="contact" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Agendar Reunión con LawMeter
              </CardTitle>
              <CardDescription>
                Programa una llamada con nuestro equipo
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
  );
}
