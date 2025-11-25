import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CertificateFilters } from '@/components/certificates/CertificateFilters';
import { SummaryCards } from '@/components/certificates/SummaryCards';
import { CertificateTable } from '@/components/certificates/CertificateTable';
import { useCertificates } from '@/hooks/useCertificates';
import { CertificateFilters as Filters } from '@/types/certificates';
import { Skeleton } from '@/components/ui/skeleton';

export default function CertificatesDashboard() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({});
  const { data: certificates = [], isLoading } = useCertificates(filters);

  const handleExport = () => {
    // Convert to CSV
    const headers = [
      'Client',
      'Product',
      'Model',
      'Type',
      'Country/Region',
      'Standard',
      'Cert Body',
      'Cert Number',
      'Issue Date',
      'Expiration',
      'Status',
    ];
    
    const rows = certificates.map(cert => [
      cert.clients?.client_name || '',
      cert.product_name,
      cert.product_model || '',
      cert.certificate_type,
      cert.country_or_region,
      cert.regulatory_standard || '',
      cert.certification_body || '',
      cert.certificate_number || '',
      cert.issue_date,
      cert.expiration_date || '',
      cert.status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificates-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Certificate Repository</h1>
            <p className="text-muted-foreground">
              Go Global Compliance - Manage and track all certifications
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => navigate('/certificates/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Certificate
            </Button>
          </div>
        </div>

        <CertificateFilters filters={filters} onFiltersChange={setFilters} />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            <SummaryCards certificates={certificates} />
            <CertificateTable certificates={certificates} />
          </>
        )}
      </div>
    </div>
  );
}
