import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { useClient, useClientCertificates } from '@/hooks/useClients';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificateTable } from '@/components/certificates/CertificateTable';

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading: loadingClient } = useClient(id!);
  const { data: certificates = [], isLoading: loadingCertificates } = useClientCertificates(id!);

  if (loadingClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Client not found</p>
            <Button onClick={() => navigate('/clients')} className="mt-4">
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{client.client_name}</h1>
              <p className="text-muted-foreground">Client Profile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {client.primary_country && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Primary Country</label>
                    <p className="text-lg mt-1">{client.primary_country}</p>
                  </div>
                )}
                {client.industry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="text-lg mt-1">{client.industry}</p>
                  </div>
                )}
              </div>

              {client.internal_code && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Internal Code</label>
                  <p className="text-lg mt-1 font-mono">{client.internal_code}</p>
                </div>
              )}

              {client.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-base mt-1 text-muted-foreground whitespace-pre-wrap">
                    {client.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.contact_person && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                  <p className="text-lg mt-1">{client.contact_person}</p>
                </div>
              )}
              {client.contact_email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg mt-1">
                    <a href={`mailto:${client.contact_email}`} className="text-primary hover:underline">
                      {client.contact_email}
                    </a>
                  </p>
                </div>
              )}
              {client.contact_phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg mt-1">
                    <a href={`tel:${client.contact_phone}`} className="text-primary hover:underline">
                      {client.contact_phone}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Certificates</h2>
            <Button onClick={() => navigate('/certificates/new')}>
              Add Certificate
            </Button>
          </div>

          {loadingCertificates ? (
            <Skeleton className="h-96" />
          ) : (
            <CertificateTable certificates={certificates as any} />
          )}
        </div>
      </div>
    </div>
  );
}
