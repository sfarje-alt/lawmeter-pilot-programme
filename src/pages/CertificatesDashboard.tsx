import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Radio, Shield, Lock, Battery, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CertificateFilters } from '@/components/certificates/CertificateFilters';
import { SummaryCards } from '@/components/certificates/SummaryCards';
import { CertificateTable } from '@/components/certificates/CertificateTable';
import { useCertificates } from '@/hooks/useCertificates';
import { CertificateFilters as Filters } from '@/types/certificates';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Certification categories relevant to smart kettles and espresso machines
const CERTIFICATION_CATEGORIES = [
  {
    name: "Radio/RF",
    icon: Radio,
    examples: "FCC, CE RED, IC, TELEC, KC, NCC, TRA",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    name: "Product Safety",
    icon: Shield,
    examples: "UL, CSA, CB, PSE, KC Safety, BSMI, GSO",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  {
    name: "Cybersecurity",
    icon: Lock,
    examples: "ETSI EN 303 645, RED Art. 3.3, CRA",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    name: "Battery",
    icon: Battery,
    examples: "UN 38.3, IEC 62133, UL 2054",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    name: "Food Contact",
    icon: Utensils,
    examples: "FDA, EU FCM, LFGB, Food Grade",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
  },
];

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Certification Monitor</h1>
            <p className="text-muted-foreground">
              Track and manage global certifications for smart kettles and espresso machines
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

        {/* Certification Categories Overview */}
        <Card className="mb-6 bg-muted/30 border-muted">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">
                Tracking certifications for:
              </span>
              {CERTIFICATION_CATEGORIES.map((cat) => (
                <Badge
                  key={cat.name}
                  variant="outline"
                  className={`gap-1.5 ${cat.color}`}
                >
                  <cat.icon className="h-3 w-3" />
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs opacity-70">({cat.examples.split(',')[0]}...)</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Coverage Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { region: "North America", markets: "USA, Canada" },
            { region: "Europe", markets: "EU 27, UK" },
            { region: "Asia Pacific", markets: "Japan, Korea, Taiwan" },
            { region: "Middle East", markets: "UAE, Saudi, GCC" },
            { region: "Latin America", markets: "Mexico, Brazil" },
          ].map((r) => (
            <Card key={r.region} className="bg-background/50">
              <CardContent className="py-3 px-4">
                <div className="text-sm font-medium">{r.region}</div>
                <div className="text-xs text-muted-foreground">{r.markets}</div>
              </CardContent>
            </Card>
          ))}
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

        {/* Empty state with guidance */}
        {!isLoading && certificates.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Start tracking your product certifications across global markets. 
                Add certificates for RF/Radio, Safety, EMC, Battery, and Food Contact compliance.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/certificates/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
