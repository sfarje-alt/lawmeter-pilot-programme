import { Building2, ShieldCheck, FileText, Home, Car, Heart, MapPin, Clock, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Entity } from "@/types/businessIntelligence";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EntityProfileProps {
  entity: Entity;
  onCreateAlert: () => void;
}

export function EntityProfile({ entity, onCreateAlert }: EntityProfileProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const allMovements = [
    ...(entity.rn?.movimientos_historicos.map(m => ({ ...m, source: "RN" })) || []),
    ...(entity.propiedades?.flatMap(p => 
      p.gravamenes.map(g => ({ fecha: g.fecha, tipo: `Gravamen: ${g.tipo}`, source: "Propiedades", detalle: `Finca ${p.finca}` }))
    ) || []),
    ...(entity.vehiculos?.flatMap(v => 
      v.infracciones_12m.map(i => ({ fecha: i.fecha, tipo: `Infracción: ${i.tipo}`, source: "Cosevi", detalle: `Placa ${v.placa}` }))
    ) || []),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="space-y-6">
      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="ovt">OVT</TabsTrigger>
          <TabsTrigger value="rn">Registro Nacional</TabsTrigger>
          <TabsTrigger value="propiedades">Inmuebles</TabsTrigger>
          <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
          <TabsTrigger value="ccss">CCSS</TabsTrigger>
          <TabsTrigger value="mapa">Mapa</TabsTrigger>
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle>{entity.nombre}</CardTitle>
                    <CardDescription>Cédula Jurídica: {entity.cedula_juridica}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={entity.kpis.estado_tributario === "Al día" ? "default" : "destructive"}>
                        OVT: {entity.kpis.estado_tributario}
                      </Badge>
                      <Badge variant={entity.kpis.ccss === "Al día" ? "default" : "destructive"}>
                        CCSS: {entity.kpis.ccss}
                      </Badge>
                      {entity.rn && (
                        <Badge variant="secondary">RN: {entity.rn.estado}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button onClick={onCreateAlert}>
                  <Bell className="w-4 h-4 mr-2" />
                  Crear Alerta
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Domicilio</p>
                  <p className="text-sm">{entity.domicilio}</p>
                </div>
                {entity.fecha_constitucion && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha de Constitución</p>
                    <p className="text-sm">{formatDate(entity.fecha_constitucion)}</p>
                  </div>
                )}
                {entity.rn && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Objeto Social</p>
                    <p className="text-sm">{entity.rn.objeto_social}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">AI Summary - Análisis de Riesgo</h3>
                </div>
                <div className={`p-4 rounded-lg border ${entity.kpis.riesgo >= 70 ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : entity.kpis.riesgo >= 50 ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900" : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"}`}>
                  <p className="text-sm leading-relaxed">{entity.ai_summary}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Fuentes: OVT (Hacienda), Registro Nacional, CCSS, Cosevi
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ovt" className="space-y-4">
          {entity.ovt ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Estado Tributario</CardTitle>
                  <CardDescription>
                    <Badge variant={entity.ovt.estado_cumplimiento === "Al día" ? "default" : "destructive"}>
                      {entity.ovt.estado_cumplimiento}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Régimen Tributario</h4>
                      <p className="text-sm">
                        {entity.ovt.regimen_tributario.tipo} (desde {formatDate(entity.ovt.regimen_tributario.desde)})
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Actividades Económicas</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Desde</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entity.ovt.actividades_economicas.map((act, i) => (
                            <TableRow key={i}>
                              <TableCell>{act.codigo}</TableCell>
                              <TableCell>{act.descripcion}</TableCell>
                              <TableCell>{formatDate(act.desde)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Representantes Tributarios</h4>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="text-xs">
                                ⓘ
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Los representantes aquí listados son solo los registrados ante tributación.
                                Esta lista no siempre está actualizada. Consulte RN para información completa.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Cédula</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entity.ovt.representantes_tributarios.map((rep, i) => (
                            <TableRow key={i}>
                              <TableCell>{rep.nombre}</TableCell>
                              <TableCell>{rep.cargo}</TableCell>
                              <TableCell>{rep.cedula || "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {entity.ovt.factores_retencion.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Factores de Retención</h4>
                        <div className="flex flex-wrap gap-2">
                          {entity.ovt.factores_retencion.map((factor, i) => (
                            <Badge key={i} variant="secondary">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No hay datos de OVT disponibles</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rn" className="space-y-4">
          {entity.rn ? (
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Históricos (12 meses)</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{entity.rn.movimientos_historicos.length} movimientos</Badge>
                    <p className="text-xs text-muted-foreground">
                      Consultas Gratuitas - RN | Alertas de pago por suscripción
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo de Movimiento</TableHead>
                      <TableHead>Cita</TableHead>
                      <TableHead>Oficina</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entity.rn.movimientos_historicos.map((mov, i) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-nowrap">{formatDate(mov.fecha)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {mov.tipo}
                            {mov.tipo.includes("Anotación judicial") && (
                              <Badge variant="destructive" className="text-xs">
                                Alerta
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{mov.cita}</TableCell>
                        <TableCell className="text-sm">{mov.oficina}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="max-w-xs space-y-1">
                                  <p className="font-semibold">Documento - Cita {mov.cita}</p>
                                  <p className="text-xs">{mov.detalle || mov.tipo}</p>
                                  <p className="text-xs text-muted-foreground">Oficina: {mov.oficina}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No hay datos del Registro Nacional disponibles</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="propiedades" className="space-y-4">
          {entity.propiedades && entity.propiedades.length > 0 ? (
            entity.propiedades.map((prop, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Finca {prop.finca}</CardTitle>
                      <CardDescription>
                        {prop.ubicacion.provincia}, {prop.ubicacion.canton}
                        {prop.ubicacion.distrito && `, ${prop.ubicacion.distrito}`}
                      </CardDescription>
                    </div>
                    {(prop.gravamenes.length > 0 || prop.anotaciones.length > 0) && (
                      <Badge variant="destructive">
                        {prop.gravamenes.length} gravamen(es), {prop.anotaciones.length} anotación(es)
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Titulares</p>
                      {prop.titulares.map((t, j) => (
                        <p key={j} className="text-sm">
                          {t}
                        </p>
                      ))}
                    </div>
                    {prop.plano && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Plano</p>
                        <p className="text-sm">
                          {prop.plano.numero} - {prop.plano.area_m2.toFixed(2)} m²
                        </p>
                      </div>
                    )}
                    {prop.uso && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Uso</p>
                        <p className="text-sm">{prop.uso}</p>
                      </div>
                    )}
                  </div>

                  {prop.gravamenes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">Gravámenes</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Acreedor</TableHead>
                            <TableHead>Monto</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prop.gravamenes.map((grav, j) => (
                            <TableRow key={j}>
                              <TableCell>{grav.tipo}</TableCell>
                              <TableCell>{formatDate(grav.fecha)}</TableCell>
                              <TableCell>{grav.acreedor || "—"}</TableCell>
                              <TableCell>{grav.monto_crc ? formatCurrency(grav.monto_crc) : "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {prop.anotaciones.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">Anotaciones</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Detalle</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prop.anotaciones.map((anot, j) => (
                            <TableRow key={j}>
                              <TableCell>
                                <Badge variant="destructive">{anot.tipo}</Badge>
                              </TableCell>
                              <TableCell>{formatDate(anot.fecha)}</TableCell>
                              <TableCell>{anot.detalle || "—"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No hay propiedades registradas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vehiculos" className="space-y-4">
          {entity.vehiculos && entity.vehiculos.length > 0 ? (
            entity.vehiculos.map((veh, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Placa {veh.placa}</CardTitle>
                      <CardDescription>
                        {veh.marca} {veh.modelo} ({veh.year})
                      </CardDescription>
                    </div>
                    {veh.infracciones_12m.length > 0 && (
                      <Badge variant="destructive">
                        {veh.infracciones_12m.length} infracción(es) en 12 meses
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                {veh.infracciones_12m.length > 0 && (
                  <CardContent>
                    <h4 className="font-semibold mb-2">Infracciones COSEVI (12 meses)</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {veh.infracciones_12m.map((inf, j) => (
                          <TableRow key={j}>
                            <TableCell>{formatDate(inf.fecha)}</TableCell>
                            <TableCell>{inf.tipo}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  inf.estado === "Pagada"
                                    ? "secondary"
                                    : inf.estado === "Pendiente"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {inf.estado}
                              </Badge>
                            </TableCell>
                            <TableCell>{inf.monto_crc ? formatCurrency(inf.monto_crc) : "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No hay vehículos registrados</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ccss">
          <Card>
            <CardHeader>
              <CardTitle>Caja Costarricense de Seguro Social</CardTitle>
              <CardDescription>
                Estado de cumplimiento como patrono | Última actualización:{" "}
                {entity.ccss && formatDate(entity.ccss.ultima_actualizacion)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entity.ccss ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Estado</p>
                      <Badge variant={entity.ccss.estado === "Al día" ? "default" : "destructive"} className="text-base px-3 py-1">
                        {entity.ccss.estado}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Inscrito como Patrono</p>
                      <Badge variant={entity.ccss.inscrito_patrono ? "default" : "secondary"} className="text-base px-3 py-1">
                        {entity.ccss.inscrito_patrono ? "Sí" : "No"}
                      </Badge>
                    </div>
                    {entity.ccss.monto_deuda && entity.ccss.monto_deuda > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Monto de Deuda</p>
                        <p className="text-2xl font-bold text-destructive">
                          {formatCurrency(entity.ccss.monto_deuda)}
                        </p>
                      </div>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-4 border border-muted rounded-lg bg-muted/30 cursor-help">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              ⓘ
                            </Badge>
                            La obligación de estar al día con CCSS aplica únicamente a sociedades inscritas como patrono
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Si la empresa no tiene empleados o no está inscrita como patrono, este requisito no aplica.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay datos de CCSS disponibles</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa">
          <Card>
            <CardHeader>
              <CardTitle>Ubicación Geográfica</CardTitle>
              <CardDescription>Mapa de propiedades y domicilios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Mapa interactivo (Placeholder - Integración con API Geo CR)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mostrando ubicaciones de: {entity.domicilio}
                  </p>
                  {entity.propiedades && entity.propiedades.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {entity.propiedades.map((prop, i) => (
                        <Badge key={i} variant="secondary">
                          {prop.ubicacion.provincia}, {prop.ubicacion.canton}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actividad">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente & Señales</CardTitle>
              <CardDescription>Timeline unificado de todos los cambios y eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allMovements.slice(0, 15).map((mov, i) => (
                  <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        mov.source === "RN" ? "bg-blue-100 dark:bg-blue-900" :
                        mov.source === "Propiedades" ? "bg-purple-100 dark:bg-purple-900" :
                        "bg-orange-100 dark:bg-orange-900"
                      }`}>
                        {mov.source === "RN" && <FileText className="w-5 h-5" />}
                        {mov.source === "Propiedades" && <Home className="w-5 h-5" />}
                        {mov.source === "Cosevi" && <Car className="w-5 h-5" />}
                      </div>
                      {i < allMovements.slice(0, 15).length - 1 && (
                        <div className="w-0.5 h-full bg-muted mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {mov.source}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{formatDate(mov.fecha)}</p>
                          </div>
                          <p className="font-medium">{mov.tipo}</p>
                          {mov.detalle && <p className="text-sm text-muted-foreground mt-1">{mov.detalle}</p>}
                        </div>
                        {(mov.tipo.includes("Embargo") || 
                          mov.tipo.includes("Hipoteca") || 
                          mov.tipo.includes("Infracción") ||
                          mov.tipo.includes("judicial")) && (
                          <Badge variant="destructive" className="ml-2">
                            Alerta
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Alertas</CardTitle>
              <CardDescription>Configure notificaciones automáticas para esta entidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-4">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold mb-2">Sistema de Alertas (Mock)</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Configure alertas para recibir notificaciones cuando ocurran cambios importantes:
                      </p>
                    </div>
                    <Button onClick={onCreateAlert} size="lg">
                      <Bell className="w-4 h-4 mr-2" />
                      Crear Nueva Alerta
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Alertas de Registro Nacional</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevos movimientos</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevos documentos</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Alertas OVT</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cambio de cumplimiento</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cambio de régimen</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Alertas CCSS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cambio de estado</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Alertas de Propiedades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevos gravámenes</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevas anotaciones</span>
                        <Badge variant="outline">Disponible</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> El servicio de alertas RN es de pago por sociedad/bien.
                    Este mock solo representa la interfaz de usuario.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
