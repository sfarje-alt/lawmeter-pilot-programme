import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Globe, Users, MapPin, FileText, Target, 
  Eye, CheckCircle2, Mail, Phone, Calendar 
} from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { MOCK_CLIENTS, SECTORS } from "@/data/peruAlertsMockData";

// Mock detailed client profile data
const MOCK_CLIENT_PROFILE = {
  id: "client-farmasalud",
  legalName: "FarmaSalud Perú S.A.C.",
  tradeName: "FarmaSalud",
  internalCode: "FS-001",
  industry: "Farmacéutico",
  primaryCountry: "Perú",
  companyType: "Sociedad Anónima Cerrada",
  website: "www.farmasalud.com.pe",
  isRegulated: true,
  supervisingAuthorities: ["DIGEMID", "MINSA", "SUNAT"],
  primarySector: "Farmacéutico",
  secondarySectors: ["Dispositivos Médicos", "Salud Pública"],
  customerSegments: ["B2B", "B2G", "Hospitales", "Clínicas"],
  distributionChannels: ["Distribuidores", "Venta Directa", "Licitaciones"],
  isCrossBorder: true,
  crossBorderCountries: ["Ecuador", "Bolivia", "Colombia"],
  monitoringObjective: "Identificar cambios regulatorios que afecten la comercialización y registro de medicamentos y dispositivos médicos en Perú y la región Andina.",
  lawBranches: ["Derecho Farmacéutico", "Derecho Administrativo", "Derecho Tributario", "Contrataciones del Estado"],
  keywords: ["medicamentos", "DIGEMID", "registro sanitario", "dispositivos médicos", "licitaciones CENARES"],
  instrumentTypes: ["Leyes", "Decretos Supremos", "Resoluciones Ministeriales", "Directivas"],
  affectedAreas: [
    { name: "Asuntos Regulatorios", responsibilityNotes: "Registros sanitarios y compliance" },
    { name: "Comercial", responsibilityNotes: "Impacto en precios y acceso a mercado" },
    { name: "Legal", responsibilityNotes: "Cumplimiento normativo general" },
    { name: "Supply Chain", responsibilityNotes: "Importación y distribución" },
  ],
  stakeholdersAffected: ["Accionistas", "Clientes", "Reguladores", "Proveedores"],
  highImpactDefinition: "Cualquier normativa que afecte el registro, comercialización o precio de medicamentos oncológicos o de alta especialidad.",
  highUrgencyDefinition: "Normativas con plazo de cumplimiento menor a 30 días o que requieran acción inmediata.",
  contactPerson: "Dr. Carlos Mendoza",
  contactEmail: "cmendoza@farmasalud.com.pe",
  contactPhone: "+51 1 234 5678",
  status: "active",
  createdAt: "2024-06-15",
};

export function ClientProfileView() {
  const { clientName } = useClientUser();
  const profile = MOCK_CLIENT_PROFILE;

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground min-w-[140px]">{label}:</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Configuración de monitoreo definida por tu equipo legal
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">
          <Eye className="h-3 w-3 mr-1" />
          Solo Lectura
        </Badge>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{profile.legalName}</CardTitle>
                <CardDescription>{profile.tradeName} • {profile.internalCode}</CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <Section title="Información General" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Industria" value={profile.industry} />
              <InfoRow label="Tipo de Empresa" value={profile.companyType} />
              <InfoRow label="País Principal" value={profile.primaryCountry} />
              <InfoRow label="Website" value={profile.website} />
              <InfoRow 
                label="Regulado" 
                value={profile.isRegulated ? (
                  <Badge variant="secondary" className="text-xs">Sí - Entidad Regulada</Badge>
                ) : "No"} 
              />
              <InfoRow 
                label="Operación Transfronteriza" 
                value={profile.isCrossBorder ? (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {profile.crossBorderCountries.join(", ")}
                  </span>
                ) : "No"} 
              />
            </div>
          </Section>

          <Separator />

          {/* Regulatory Context */}
          <Section title="Contexto Regulatorio" icon={FileText}>
            <div className="space-y-4">
              <InfoRow 
                label="Autoridades Supervisoras" 
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.supervisingAuthorities.map((auth, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{auth}</Badge>
                    ))}
                  </div>
                } 
              />
              <InfoRow label="Sector Primario" value={profile.primarySector} />
              <InfoRow 
                label="Sectores Secundarios" 
                value={profile.secondarySectors.join(", ")} 
              />
            </div>
          </Section>

          <Separator />

          {/* Monitoring Scope */}
          <Section title="Alcance de Monitoreo" icon={Target}>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <span className="text-sm text-muted-foreground block mb-2">Objetivo de Monitoreo:</span>
                <p className="text-sm text-foreground">{profile.monitoringObjective}</p>
              </div>
              
              <InfoRow 
                label="Ramas del Derecho" 
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.lawBranches.map((branch, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{branch}</Badge>
                    ))}
                  </div>
                } 
              />

              <InfoRow 
                label="Tipos de Instrumento" 
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.instrumentTypes.map((type, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-primary/10 border-primary/30">{type}</Badge>
                    ))}
                  </div>
                } 
              />

              <InfoRow 
                label="Keywords de Búsqueda" 
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                } 
              />
            </div>
          </Section>

          <Separator />

          {/* Affected Areas */}
          <Section title="Áreas Afectadas" icon={Users}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.affectedAreas.map((area, i) => (
                <Card key={i} className="bg-muted/20">
                  <CardContent className="p-3">
                    <span className="font-medium text-sm">{area.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{area.responsibilityNotes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Separator />

          {/* Priority Logic */}
          <Section title="Lógica de Priorización" icon={Target}>
            <div className="space-y-4">
              <InfoRow 
                label="Stakeholders" 
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.stakeholdersAffected.map((sh, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{sh}</Badge>
                    ))}
                  </div>
                } 
              />
              
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                <span className="text-sm font-medium text-red-500 block mb-2">Alto Impacto:</span>
                <p className="text-sm text-foreground">{profile.highImpactDefinition}</p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                <span className="text-sm font-medium text-orange-500 block mb-2">Alta Urgencia:</span>
                <p className="text-sm text-foreground">{profile.highUrgencyDefinition}</p>
              </div>
            </div>
          </Section>

          <Separator />

          {/* Contact Info */}
          <Section title="Contacto Principal" icon={Mail}>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <span className="font-medium text-foreground">{profile.contactPerson}</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {profile.contactEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {profile.contactPhone}
                  </span>
                </div>
              </div>
            </div>
          </Section>
        </CardContent>
      </Card>
    </div>
  );
}
