import { useState } from "react";
import { SearchHeader } from "@/components/business-intelligence/SearchHeader";
import { EntityProfile } from "@/components/business-intelligence/EntityProfile";
import { mockEntities } from "@/data/mockBusinessIntelligence";
import { Entity } from "@/types/businessIntelligence";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BusinessIntelligence() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (query: string, type: "cedula" | "nombre" | "placa" | "finca") => {
    const cleanedQuery = query.replace(/[^0-9a-zA-Z]/gi, "").toLowerCase();

    let found: Entity | undefined;

    if (type === "cedula") {
      found = mockEntities.find((e) =>
        e.cedula_juridica.replace(/[^0-9]/g, "") === cleanedQuery
      );
    } else if (type === "nombre") {
      found = mockEntities.find((e) =>
        e.nombre.toLowerCase().includes(query.toLowerCase())
      );
    } else if (type === "placa") {
      found = mockEntities.find((e) =>
        e.vehiculos?.some((v) => v.placa.toLowerCase().replace(/[^0-9a-z]/g, "") === cleanedQuery)
      );
    } else if (type === "finca") {
      found = mockEntities.find((e) =>
        e.propiedades?.some((p) => p.finca.toLowerCase().replace(/[^0-9a-z]/g, "") === cleanedQuery)
      );
    }

    if (found) {
      setSelectedEntity(found);
      toast({
        title: "Entidad encontrada",
        description: `Se encontró información para: ${found.nombre}`,
      });
    } else {
      setSelectedEntity(undefined);
      toast({
        title: "No se encontraron resultados",
        description: `No hay información disponible para la búsqueda: ${query}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateAlert = () => {
    toast({
      title: "Crear Alerta",
      description: "Configuración de alertas - funcionalidad en desarrollo (mock)",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,40%,8%)] via-[hsl(220,45%,6%)] to-[hsl(220,50%,4%)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4 gap-2 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Button>
        <SearchHeader onSearch={handleSearch} selectedEntity={selectedEntity} />

        {selectedEntity ? (
          <EntityProfile entity={selectedEntity} onCreateAlert={handleCreateAlert} />
        ) : (
          <Card>
            <CardContent className="py-16">
              <div className="text-center space-y-4">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Busca una entidad para comenzar
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Utiliza el buscador para encontrar información detallada sobre proveedores
                    y competidores en Costa Rica. Puedes buscar por cédula jurídica, nombre, placa o finca.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  <p className="text-sm text-muted-foreground w-full mb-2">
                    Prueba con estas cédulas jurídicas de ejemplo:
                  </p>
                  {mockEntities.map((entity) => (
                    <button
                      key={entity.cedula_juridica}
                      onClick={() => handleSearch(entity.cedula_juridica, "cedula")}
                      className="text-sm px-3 py-1 rounded-md border border-muted hover:bg-muted/50 transition-colors"
                    >
                      {entity.cedula_juridica}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
