import { useState } from "react";
import { useCongressBills, SortOption } from "@/hooks/useCongressBills";
import { CongressBillCard } from "./CongressBillCard";
import { CongressBillDrawer } from "./CongressBillDrawer";
import { CongressBill } from "@/types/congress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
                <SelectItem value="latestAction-desc">Última Acción - Más Reciente</SelectItem>
                <SelectItem value="latestAction-asc">Última Acción - Más Antigua</SelectItem>
                <SelectItem value="title-asc">Título - A a Z</SelectItem>
                <SelectItem value="title-desc">Título - Z a A</SelectItem>
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
        </div>
      </div>

      {/* Bills Grid */}
      {filteredBills.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron proyectos de ley
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    </div>
  );
}
