import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Globe, 
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { ClientProfile } from "./types";

interface ClientsListProps {
  clients: ClientProfile[];
  onCreateClient: () => void;
  onSelectClient: (client: ClientProfile) => void;
}

export function ClientsList({ clients, onCreateClient, onSelectClient }: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.tradeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.primarySector?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.legalName.localeCompare(b.legalName);
      } else if (sortBy === 'date') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Activo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactivo</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pendiente</Badge>;
      default:
        return <Badge variant="outline">Sin estado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestiona perfiles de clientes y reglas de monitoreo</p>
        </div>
        <Button onClick={onCreateClient} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Perfil de Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Clientes Activos</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              {clients.reduce((acc, c) => acc + c.clientUsers.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Usuarios de Clientes</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              {clients.reduce((acc, c) => acc + c.keywords.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Palabras Clave de Monitoreo</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/30"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[180px] bg-background/50 border-border/30">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Alfabético</SelectItem>
            <SelectItem value="date">Fecha de Creación</SelectItem>
            <SelectItem value="status">Estado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-[150px] bg-background/50 border-border/30">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client List */}
      {filteredClients.length > 0 ? (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="glass-card border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => onSelectClient(client)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{client.legalName}</h3>
                        {getStatusBadge(client.status)}
                      </div>
                      {client.tradeName && (
                        <p className="text-sm text-muted-foreground">{client.tradeName}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        {client.primarySector && (
                          <span>{client.primarySector}</span>
                        )}
                        {client.locations.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {client.locations.map(l => l.country).join(', ')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {client.clientUsers.length} usuarios
                        </span>
                        {client.isCrossBorder && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Transfronterizo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Perfiles de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aún no hay perfiles de clientes.</p>
              <p className="text-sm mt-1">Crea tu primer perfil de cliente para comenzar a monitorear legislación.</p>
              <Button className="mt-4" onClick={onCreateClient}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Perfil de Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-border/30">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ningún cliente coincide con tu búsqueda.</p>
              <p className="text-sm mt-1">Intenta ajustar los filtros o el término de búsqueda.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
