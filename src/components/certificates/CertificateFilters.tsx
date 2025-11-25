import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { CertificateFilters as Filters, CertificateType, CertificateStatus } from '@/types/certificates';
import { useClients } from '@/hooks/useClients';

interface CertificateFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const certificateTypes: CertificateType[] = ['CE', 'FCC', 'UL', 'UKCA', 'CB', 'EMC', 'RF', 'Safety', 'Eco-design', 'Other'];
const statuses: CertificateStatus[] = ['Valid', 'Expiring Soon', 'Expired', 'In Progress'];

export function CertificateFilters({ filters, onFiltersChange }: CertificateFiltersProps) {
  const { data: clients = [] } = useClients();

  const handleReset = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="glass-card p-6 mb-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certificates..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <Select
          value={filters.clientId || 'all'}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, clientId: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.certificateType || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, certificateType: value === 'all' ? undefined : (value as CertificateType) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {certificateTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value === 'all' ? undefined : (value as CertificateStatus) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.expirationRange || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, expirationRange: value === 'all' ? undefined : (value as '30' | '60' | '90' | 'all') })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Expiration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="30">Next 30 days</SelectItem>
            <SelectItem value="60">Next 60 days</SelectItem>
            <SelectItem value="90">Next 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
