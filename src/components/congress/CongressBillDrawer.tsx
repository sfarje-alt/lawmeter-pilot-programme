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
import { ExternalLink, Calendar, Users, Building, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBillCosponsors } from "@/hooks/useCongressBills";

interface CongressBillDrawerProps {
  bill: CongressBill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CongressBillDrawer({ bill, open, onOpenChange }: CongressBillDrawerProps) {
  const [cosponsors, setCosponsors] = useState<any[]>([]);
  const [loadingCosponsors, setLoadingCosponsors] = useState(false);

  useEffect(() => {
    if (open && bill) {
      setLoadingCosponsors(true);
      fetchBillCosponsors(bill.congress, bill.type, bill.number)
        .then((data) => {
          setCosponsors(data);
        })
        .finally(() => {
          setLoadingCosponsors(false);
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

        <div className="overflow-y-auto px-6 pb-6 space-y-6">
          {/* Sponsors */}
          {bill.sponsors && bill.sponsors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patrocinadores
              </h3>
              <div className="space-y-2">
                {bill.sponsors.map((sponsor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{sponsor.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {sponsor.party} - {sponsor.state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Latest Action */}
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

          <Separator />

          {/* Cosponsors */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Copatrocinadores
              {loadingCosponsors && <Loader2 className="h-4 w-4 animate-spin" />}
            </h3>
            {loadingCosponsors ? (
              <p className="text-sm text-muted-foreground">Cargando copatrocinadores...</p>
            ) : cosponsors.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {cosponsors.map((cosponsor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{cosponsor.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {cosponsor.party} - {cosponsor.state}
                        {cosponsor.district ? ` - Distrito ${cosponsor.district}` : ""}
                      </p>
                      {cosponsor.sponsorshipDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Fecha: {formatDate(cosponsor.sponsorshipDate)}
                          {cosponsor.isOriginalCosponsor && " (Original)"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay copatrocinadores</p>
            )}
          </div>

          <Separator />

          {/* Subjects */}
          {bill.subjects?.legislativeSubjects && bill.subjects.legislativeSubjects.length > 0 && (
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
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Congreso:</span>
              <span className="font-medium">{bill.congress}º</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Última Actualización:</span>
              <span className="font-medium">{formatDate(bill.updateDate)}</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
