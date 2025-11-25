import { useState } from "react";
import { useCongressBills, SortOption } from "@/hooks/useCongressBills";
import { CongressBillCard } from "./CongressBillCard";
import { CongressBillDrawer } from "./CongressBillDrawer";
import { EmailSetupDialog } from "./EmailSetupDialog";
import { CongressBill } from "@/types/congress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowUpDown, Database, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useBatchStatusLoader } from "@/hooks/useBatchStatusLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CongressBillsSection() {
  const [sortBy, setSortBy] = useState<SortOption>("latestAction-desc");
  const { bills, loading, error } = useCongressBills(sortBy);
  const [selectedBill, setSelectedBill] = useState<CongressBill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChamber, setSelectedChamber] = useState<string | null>(null);
  const [emailSetupOpen, setEmailSetupOpen] = useState(false);
  const { loadAllStatuses, loading: batchLoading, progress } = useBatchStatusLoader();
  const { toast } = useToast();

  const handleBatchLoad = async () => {
    const result = await loadAllStatuses();
    
    if (result.success) {
      toast({
        title: "Base de datos actualizada",
        description: `${result.successCount} de ${result.total} proyectos de ley actualizados exitosamente`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo completar la actualización",
        variant: "destructive",
      });
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${bill.type} ${bill.number}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChamber = !selectedChamber || bill.originChamber === selectedChamber;
    return matchesSearch && matchesChamber;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar datos del Congreso: {error}
          <br />
          <span className="text-xs mt-2 block">
            Nota: Necesitas una clave API de Congress.gov. 
            <a 
              href="https://api.congress.gov/sign-up/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Regístrate aquí
            </a>
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Proyectos de Ley del Congreso de EE.UU.</h2>
          <p className="text-muted-foreground">
            119º Congreso (2025-2027) • {bills.length} proyectos de ley
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Buscar proyectos de ley..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="introducedDate-desc">Fecha de Introducción - Más Reciente</SelectItem>
                <SelectItem value="introducedDate-asc">Fecha de Introducción - Más Antigua</SelectItem>
                <SelectItem value="latestAction-desc">Última Acción - Más Reciente</SelectItem>
                <SelectItem value="latestAction-asc">Última Acción - Más Antigua</SelectItem>
                <SelectItem value="number-asc">Número - Ascendente</SelectItem>
                <SelectItem value="number-desc">Número - Descendente</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="lawNumber-asc">Número de Ley - Ascendente</SelectItem>
                <SelectItem value="lawNumber-desc">Número de Ley - Descendente</SelectItem>
                <SelectItem value="cosponsorCount-desc">Copatrocinadores - Más a Menos</SelectItem>
                <SelectItem value="cosponsorCount-asc">Copatrocinadores - Menos a Más</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedChamber === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamber(null)}
            >
              Todos
            </Button>
            <Button
              variant={selectedChamber === "House" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamber("House")}
            >
              Cámara
            </Button>
            <Button
              variant={selectedChamber === "Senate" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamber("Senate")}
            >
              Senado
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchLoad}
            disabled={batchLoading}
          >
            {batchLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {progress.current}/{progress.total}
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Actualizar Base de Datos
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailSetupOpen(true)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Notifications
          </Button>
        </div>
        
        {/* Progress Bar */}
        {batchLoading && progress.total > 0 && (
          <div className="space-y-2">
            <Progress value={(progress.current / progress.total) * 100} />
            <p className="text-xs text-muted-foreground">{progress.status}</p>
          </div>
        )}
      </div>

      {/* Bills List - Vertical Stack */}
      {filteredBills.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron proyectos de ley
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <CongressBillCard
              key={`${bill.type}-${bill.number}`}
              bill={bill}
              onViewDetails={() => setSelectedBill(bill)}
            />
          ))}
        </div>
      )}

      {/* Bill Details Drawer */}
      {selectedBill && (
        <CongressBillDrawer
          bill={selectedBill}
          open={!!selectedBill}
          onOpenChange={(open) => !open && setSelectedBill(null)}
        />
      )}

      {/* Email Setup Dialog */}
      <EmailSetupDialog
        open={emailSetupOpen}
        onOpenChange={setEmailSetupOpen}
      />
    </div>
  );
}
