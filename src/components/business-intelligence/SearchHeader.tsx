import { useState } from "react";
import { Search, Building2, AlertCircle, TrendingUp, Car, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Entity } from "@/types/businessIntelligence";

interface SearchHeaderProps {
  onSearch: (query: string, type: "cedula" | "nombre" | "placa" | "finca") => void;
  selectedEntity?: Entity;
}

export function SearchHeader({ onSearch, selectedEntity }: SearchHeaderProps) {
  const [searchType, setSearchType] = useState<"cedula" | "nombre" | "placa" | "finca">("cedula");
  const [searchValue, setSearchValue] = useState("");

  const formatCedula = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 1)}-${cleaned.slice(1)}`;
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 10)}`;
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue, searchType);
    }
  };

  const handleInputChange = (value: string) => {
    if (searchType === "cedula") {
      setSearchValue(formatCedula(value));
    } else {
      setSearchValue(value);
    }
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case "cedula":
        return "3-101-693322";
      case "nombre":
        return "Nombre de la empresa";
      case "placa":
        return "BDR954";
      case "finca":
        return "SJ-123456-000";
    }
  };

  const kpis = selectedEntity?.kpis;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Costa Rica – Inteligencia Empresarial
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of suppliers and competitors
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-4">
            {(["cedula", "nombre", "placa", "finca"] as const).map((type) => (
              <Button
                key={type}
                variant={searchType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType(type)}
              >
                {type === "cedula" && "Cédula Jurídica"}
                {type === "nombre" && "Nombre"}
                {type === "placa" && "Placa"}
                {type === "finca" && "Finca"}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1">
                    <Input
                      placeholder={getPlaceholder()}
                      value={searchValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {searchType === "cedula" && "Formato: 3-10X-XXXXXX"}
                  {searchType === "placa" && "Ejemplo: BDR954"}
                  {searchType === "finca" && "Ejemplo: SJ-123456-000"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Estado Tributario</span>
              </div>
              <Badge
                variant={
                  kpis.estado_tributario === "Al día"
                    ? "default"
                    : kpis.estado_tributario === "Incumplido"
                    ? "destructive"
                    : "secondary"
                }
              >
                {kpis.estado_tributario}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">CCSS</span>
              </div>
              <Badge variant={kpis.ccss === "Al día" ? "default" : "destructive"}>
                {kpis.ccss}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Movimientos RN (12m)</span>
              </div>
              <p className="text-2xl font-bold">{kpis.movimientos_rn_12m}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Propiedades</span>
              </div>
              <p className="text-2xl font-bold">{kpis.propiedades}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Vehículos</span>
              </div>
              <p className="text-2xl font-bold">{kpis.vehiculos}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Score de Riesgo</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{kpis.riesgo}</p>
                <Badge variant={kpis.riesgo >= 70 ? "default" : kpis.riesgo >= 50 ? "secondary" : "destructive"}>
                  {kpis.riesgo >= 70 ? "Bajo" : kpis.riesgo >= 50 ? "Medio" : "Alto"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
