import { CongressBill } from "@/types/congress";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ExternalLink, 
  Calendar, 
  Users, 
  Building, 
  Loader2, 
  FileText,
  History,
  Scale,
  Info,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
  fetchBillCosponsors,
  fetchBillDetails,
  fetchBillActions,
  fetchBillSummaries,
  fetchBillAmendments,
  fetchBillTextVersions,
  fetchMemberDetails
} from "@/hooks/useCongressBills";

interface CongressBillDrawerProps {
  bill: CongressBill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CongressBillDrawer({ bill, open, onOpenChange }: CongressBillDrawerProps) {
  const [cosponsors, setCosponsors] = useState<any[]>([]);
  const [billDetails, setBillDetails] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [amendments, setAmendments] = useState<any[]>([]);
  const [textVersions, setTextVersions] = useState<any[]>([]);
  const [sponsorDetails, setSponsorDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && bill) {
      setLoading(true);
      
      // Fetch all bill data in parallel
      Promise.all([
        fetchBillDetails(bill.congress, bill.type, bill.number),
        fetchBillCosponsors(bill.congress, bill.type, bill.number),
        fetchBillActions(bill.congress, bill.type, bill.number),
        fetchBillSummaries(bill.congress, bill.type, bill.number),
        fetchBillAmendments(bill.congress, bill.type, bill.number),
        fetchBillTextVersions(bill.congress, bill.type, bill.number),
      ])
        .then(async ([details, cosponsorData, actionsData, summariesData, amendmentsData, textVersionsData]) => {
          setBillDetails(details);
          setCosponsors(cosponsorData);
          setActions(actionsData);
          setSummaries(summariesData);
          setAmendments(amendmentsData);
          setTextVersions(textVersionsData);
          
          // Fetch sponsor details if available
          if (details?.sponsors?.[0]?.bioguideId) {
            const sponsorData = await fetchMemberDetails(details.sponsors[0].bioguideId);
            setSponsorDetails(sponsorData);
          }
        })
        .catch((error) => {
          console.error("Error fetching bill data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, bill]);

  const getBillTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      hr: "H.R.",
      s: "S.",
      hjres: "H.J.Res.",
      sjres: "S.J.Res.",
      hconres: "H.Con.Res.",
      sconres: "S.Con.Res.",
      hres: "H.Res.",
      sres: "S.Res.",
    };
    return types[type.toLowerCase()] || type.toUpperCase();
  };

  const getPartyLabel = (partyCode: string) => {
    const parties: Record<string, string> = {
      R: "Republicano",
      D: "Demócrata",
      I: "Independiente",
      ID: "Independiente Demócrata",
      L: "Libertario",
    };
    return parties[partyCode] || partyCode;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono">
                  {getBillTypeLabel(bill.type)} {bill.number}
                </Badge>
                <Badge variant="secondary">{bill.originChamber}</Badge>
                {bill.policyArea && (
                  <Badge>{bill.policyArea.name}</Badge>
                )}
              </div>
              <DrawerTitle className="text-left">{bill.title}</DrawerTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={bill.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Congress.gov
              </a>
            </Button>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  <Info className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="sponsors">
                  <Users className="h-4 w-4 mr-2" />
                  Patrocinadores
                </TabsTrigger>
                <TabsTrigger value="actions">
                  <History className="h-4 w-4 mr-2" />
                  Acciones
                </TabsTrigger>
                <TabsTrigger value="summaries">
                  <FileText className="h-4 w-4 mr-2" />
                  Resúmenes
                </TabsTrigger>
                <TabsTrigger value="amendments">
                  <Scale className="h-4 w-4 mr-2" />
                  Enmiendas
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Bill Details */}
                {billDetails && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha de Introducción:</span>
                        <span className="text-sm font-medium">{formatDate(billDetails.introducedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Última Actualización:</span>
                        <span className="text-sm font-medium">{formatDate(billDetails.updateDate)}</span>
                      </div>
                      {billDetails.cosponsors && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Copatrocinadores:</span>
                          <span className="text-sm font-medium">{billDetails.cosponsors.count || 0}</span>
                        </div>
                      )}
                    </div>

                    {/* Constitutional Authority */}
                    {billDetails.constitutionalAuthorityStatementText && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h3 className="font-semibold">Autoridad Constitucional</h3>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm whitespace-pre-wrap">
                              {billDetails.constitutionalAuthorityStatementText}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Latest Action */}
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Última Acción
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <p className="text-sm font-medium">
                      {formatDate(bill.latestAction.actionDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bill.latestAction.text}
                    </p>
                  </div>
                </div>

                {/* Subjects */}
                {bill.subjects?.legislativeSubjects && bill.subjects.legislativeSubjects.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Temas Legislativos
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {bill.subjects.legislativeSubjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Text Versions */}
                {textVersions.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold">Versiones del Texto</h3>
                      <div className="space-y-2">
                        {textVersions.map((version, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{version.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(version.date)}
                              </p>
                            </div>
                            {version.formats && version.formats.length > 0 && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={version.formats[0].url} target="_blank" rel="noopener noreferrer">
                                  Ver Texto
                                </a>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Sponsors Tab */}
              <TabsContent value="sponsors" className="space-y-6 mt-6">
                {/* Primary Sponsor with Details */}
                {sponsorDetails && billDetails?.sponsors?.[0] && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Patrocinador Principal</h3>
                    
                    {/* Profile Section */}
                    <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage 
                            src={sponsorDetails.depiction?.imageUrl} 
                            alt={billDetails.sponsors[0].fullName}
                          />
                          <AvatarFallback>
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="font-medium text-lg">
                              {sponsorDetails.honorificName} {sponsorDetails.directOrderName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getPartyLabel(billDetails.sponsors[0].party)} - {billDetails.sponsors[0].state}
                              {billDetails.sponsors[0].district ? ` - Distrito ${billDetails.sponsors[0].district}` : ""}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap">
                            {sponsorDetails.currentMember && (
                              <Badge variant="secondary">Miembro Actual</Badge>
                            )}
                            {sponsorDetails.birthYear && (
                              <Badge variant="outline">Nacido: {sponsorDetails.birthYear}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      {sponsorDetails.addressInformation && (
                        <div className="space-y-2 pt-3 border-t">
                          <h4 className="text-sm font-semibold">Información de Contacto</h4>
                          {sponsorDetails.addressInformation.officeAddress && (
                            <p className="text-sm text-muted-foreground">
                              {sponsorDetails.addressInformation.officeAddress}
                            </p>
                          )}
                          {sponsorDetails.addressInformation.phoneNumber && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${sponsorDetails.addressInformation.phoneNumber}`}>
                                📞 {sponsorDetails.addressInformation.phoneNumber}
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {/* Legislative Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                        {sponsorDetails.sponsoredLegislation?.count && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Bills Patrocinados</p>
                            <p className="text-xl font-semibold">{sponsorDetails.sponsoredLegislation.count}</p>
                          </div>
                        )}
                        {sponsorDetails.cosponsoredLegislation?.count && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Bills Copatrocinados</p>
                            <p className="text-xl font-semibold">{sponsorDetails.cosponsoredLegislation.count}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Leadership Positions */}
                      {sponsorDetails.leadership?.length > 0 && (
                        <div className="space-y-2 pt-3 border-t">
                          <h4 className="text-sm font-semibold">Posiciones de Liderazgo</h4>
                          <div className="flex flex-wrap gap-2">
                            {sponsorDetails.leadership.map((position: any, idx: number) => (
                              <Badge key={idx} variant={position.current ? "default" : "outline"}>
                                {position.type} - Congreso {position.congress}
                                {position.current && " (Actual)"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Links */}
                      <div className="flex gap-2 pt-3 border-t">
                        {sponsorDetails.officialWebsiteUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={sponsorDetails.officialWebsiteUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Sitio Oficial
                            </a>
                          </Button>
                        )}
                        {sponsorDetails.bioguideId && (
                          <Button variant="outline" size="sm" asChild>
                            <a 
                              href={`https://bioguide.congress.gov/search/bio/${sponsorDetails.bioguideId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Biografía
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Terms of Service */}
                    {sponsorDetails.terms?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Historial de Servicio</h4>
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-2 pr-4">
                            {sponsorDetails.terms.map((term: any, idx: number) => (
                              <div key={idx} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{term.chamber}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {term.memberType} - {term.stateName}
                                      {term.district ? ` Distrito ${term.district}` : ""}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {term.startYear} - {term.endYear} ({term.partyName})
                                    </p>
                                  </div>
                                  <Badge variant="outline">Congreso {term.congress}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Cosponsors */}
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    Copatrocinadores ({cosponsors.length})
                  </h3>
                  {cosponsors.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-4">
                        {cosponsors.map((cosponsor, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{cosponsor.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {getPartyLabel(cosponsor.party)} - {cosponsor.state}
                                {cosponsor.district ? ` - Distrito ${cosponsor.district}` : ""}
                              </p>
                              {cosponsor.sponsorshipDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Fecha: {formatDate(cosponsor.sponsorshipDate)}
                                  {cosponsor.isOriginalCosponsor && " (Original)"}
                                </p>
                              )}
                            </div>
                            {cosponsor.bioguideId && (
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={`https://bioguide.congress.gov/search/bio/${cosponsor.bioguideId}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  Biografía
                                </a>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay copatrocinadores</p>
                  )}
                </div>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    Historial de Acciones ({actions.length})
                  </h3>
                  {actions.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3 pr-4">
                        {actions.map((action, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-muted/50 space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium">
                                {formatDate(action.actionDate)}
                              </p>
                              {action.sourceSystem && (
                                <Badge variant="outline" className="text-xs">
                                  {action.sourceSystem.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {action.text}
                            </p>
                            {action.type && (
                              <p className="text-xs text-muted-foreground">
                                Tipo: {action.type}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay acciones disponibles</p>
                  )}
                </div>
              </TabsContent>

              {/* Summaries Tab */}
              <TabsContent value="summaries" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    Resúmenes del CRS ({summaries.length})
                  </h3>
                  {summaries.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4 pr-4">
                        {summaries.map((summary, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-muted/50 space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium">{summary.actionDesc}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(summary.actionDate)}
                                </p>
                              </div>
                              {summary.versionCode && (
                                <Badge variant="outline">{summary.versionCode}</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {summary.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay resúmenes disponibles</p>
                  )}
                </div>
              </TabsContent>

              {/* Amendments Tab */}
              <TabsContent value="amendments" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    Enmiendas ({amendments.length})
                  </h3>
                  {amendments.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3 pr-4">
                        {amendments.map((amendment, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-muted/50 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{amendment.number}</p>
                              {amendment.type && (
                                <Badge variant="outline">{amendment.type}</Badge>
                              )}
                            </div>
                            {amendment.purpose && (
                              <p className="text-sm text-muted-foreground">
                                {amendment.purpose}
                              </p>
                            )}
                            {amendment.latestAction && (
                              <div className="text-xs text-muted-foreground">
                                <p>Última acción: {formatDate(amendment.latestAction.actionDate)}</p>
                                <p>{amendment.latestAction.text}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay enmiendas disponibles</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
