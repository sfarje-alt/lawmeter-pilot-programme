import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2, Globe, Users, FileText, Target,
  Eye, CheckCircle2,
} from "lucide-react";
import { BEDSON_CLIENT_PROFILE } from "@/data/bedsonClientProfile";

/**
 * Vista de perfil read-only para el portal cliente.
 * Renderiza el perfil rígido de Bedson Group (cliente piloto) leyendo el
 * mismo objeto fuente que se usa para el formulario de admin.
 */
export function ClientProfileView() {
  const profile = BEDSON_CLIENT_PROFILE;

  const Section = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
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
      <span className="text-muted-foreground min-w-[160px]">{label}:</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );

  const primaryLocation = profile.locations?.[0];
  const primaryCountry = primaryLocation?.country || "—";

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
                <CardDescription>
                  {profile.tradeName ? `${profile.tradeName} · ` : ""}
                  {profile.primarySector || "Sin sector"}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información General */}
          <Section title="Información General" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Razón social" value={profile.legalName} />
              <InfoRow label="Nombre comercial" value={profile.tradeName} />
              <InfoRow label="Tipo de empresa" value={profile.companyType} />
              <InfoRow label="País principal" value={primaryCountry} />
              <InfoRow label="Website" value={profile.website} />
              <InfoRow
                label="Regulado"
                value={
                  profile.isRegulated ? (
                    <Badge variant="secondary" className="text-xs">Sí — Entidad regulada</Badge>
                  ) : (
                    "No"
                  )
                }
              />
              <InfoRow
                label="Operación transfronteriza"
                value={
                  profile.isCrossBorder && profile.crossBorderCountries.length > 0 ? (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {profile.crossBorderCountries.join(", ")}
                    </span>
                  ) : (
                    "No"
                  )
                }
              />
            </div>
            {profile.shortDescription && (
              <div className="mt-4 bg-muted/30 p-4 rounded-lg text-sm text-foreground">
                {profile.shortDescription}
              </div>
            )}
          </Section>

          <Separator />

          {/* Contexto Regulatorio */}
          <Section title="Contexto Regulatorio" icon={FileText}>
            <div className="space-y-4">
              <InfoRow
                label="Autoridades supervisoras"
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.supervisingAuthorities.map((auth, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{auth}</Badge>
                    ))}
                  </div>
                }
              />
              <InfoRow label="Sector primario" value={profile.primarySector} />
              <InfoRow
                label="Sectores secundarios"
                value={profile.secondarySectors.join(", ") || "—"}
              />
              {profile.productsServices.length > 0 && (
                <InfoRow
                  label="Productos y servicios"
                  value={
                    <div className="flex flex-col gap-1">
                      {profile.productsServices.map((p, i) => (
                        <span key={i} className="text-sm">
                          <span className="font-medium">{p.name}</span>
                          {p.description ? ` — ${p.description}` : ""}
                        </span>
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          </Section>

          <Separator />

          {/* Alcance de Monitoreo */}
          <Section title="Alcance de Monitoreo" icon={Target}>
            <div className="space-y-4">
              <InfoRow
                label="Tipos de instrumento"
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.instrumentTypes.map((type, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs bg-primary/10 border-primary/30"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                }
              />
              <InfoRow
                label="Palabras clave"
                value={
                  <div className="flex flex-wrap gap-1">
                    {profile.keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                }
              />
              {profile.exclusions.length > 0 && (
                <InfoRow
                  label="Exclusiones"
                  value={
                    <div className="flex flex-wrap gap-1">
                      {profile.exclusions.map((ex, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{ex}</Badge>
                      ))}
                    </div>
                  }
                />
              )}
              {profile.watchedCommissions.length > 0 && (
                <InfoRow
                  label="Comisiones monitoreadas"
                  value={
                    <div className="flex flex-col gap-1">
                      {profile.watchedCommissions.map((c, i) => (
                        <span key={i} className="text-sm">{c}</span>
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          </Section>

          <Separator />

          {/* Etiquetas internas */}
          {profile.tagCategories.length > 0 && (
            <>
              <Section title="Etiquetas internas" icon={Users}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.tagCategories.map((cat) => (
                    <Card key={cat.id} className="bg-muted/20">
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <span className="font-medium text-sm">{cat.name}</span>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cat.tags.map((t, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
              <Separator />
            </>
          )}

          {/* Lógica de Priorización */}
          <Section title="Lógica de Priorización" icon={Target}>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                <span className="text-sm font-medium text-red-500 block mb-2">Alto impacto</span>
                <p className="text-sm text-foreground">{profile.highImpactCriteria}</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                <span className="text-sm font-medium text-orange-500 block mb-2">Alta urgencia</span>
                <p className="text-sm text-foreground">{profile.highUrgencyCriteria}</p>
              </div>
            </div>
          </Section>
        </CardContent>
      </Card>
    </div>
  );
}
