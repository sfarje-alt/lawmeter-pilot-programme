import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User, Building2, Shield, Eye, Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientUser } from "@/hooks/useClientUser";
import { ClientProfileView } from "./ClientProfileView";

interface ClientSettingsProps {
  defaultTab?: "account" | "profile";
}

export function ClientSettings({ defaultTab = "account" }: ClientSettingsProps) {
  const { profile } = useAuth();
  const { clientName } = useClientUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y revisa el perfil regulatorio
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="bg-muted/30 grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span>Cuenta</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span>Perfil</span>
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

        {/* Profile (read-only) */}
        <TabsContent value="profile" className="mt-6 space-y-4">
          <Alert className="bg-muted/40 border-border">
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-3">
              <span className="text-sm">
                Esta vista es de <strong>solo lectura</strong> y se muestra a efectos de
                referencia del perfil regulatorio configurado para tu cuenta. Para
                modificarlo, contacta a tu equipo legal.
              </span>
              <Badge variant="outline" className="bg-success/10 border-success/30 text-success-foreground shrink-0">
                <Eye className="h-3 w-3 mr-1" />
                Solo Lectura
              </Badge>
            </AlertDescription>
          </Alert>

          <ClientProfileView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
