import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, FileText, Trash2 } from 'lucide-react';
import { useCertificate, useDeleteCertificate } from '@/hooks/useCertificates';
import { getStatusColor, downloadCertificateFile } from '@/lib/certificateUtils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsAdmin } from '@/hooks/useUserRole';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CertificateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: certificate, isLoading } = useCertificate(id!);
  const deleteCertificate = useDeleteCertificate();
  const isAdmin = useIsAdmin();

  const handleDelete = async () => {
    if (id) {
      await deleteCertificate.mutateAsync(id);
      navigate('/');
    }
  };

  const handleDownload = async () => {
    if (certificate?.certificate_file_key) {
      try {
        await downloadCertificateFile(
          certificate.certificate_file_key,
          `${certificate.certificate_name}.pdf`
        );
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div>
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Certificate not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Dashboard
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{certificate.certificate_name}</h1>
              <p className="text-muted-foreground">Certificate Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/certificates/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this certificate? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Certificate Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <p className="text-lg font-semibold mt-1">
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => navigate(`/clients/${certificate.client_id}`)}
                      >
                        {certificate.clients?.client_name}
                      </Button>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getStatusColor(certificate.status)}>
                        {certificate.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Certificate Type</label>
                    <p className="text-lg mt-1">
                      <Badge variant="outline">{certificate.certificate_type}</Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country/Region</label>
                    <p className="text-lg mt-1">{certificate.country_or_region}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                    <p className="text-lg mt-1">{certificate.product_name}</p>
                  </div>
                  {certificate.product_model && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Product Model</label>
                      <p className="text-lg mt-1">{certificate.product_model}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {certificate.regulatory_standard && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Regulatory Standard</label>
                      <p className="text-lg mt-1">{certificate.regulatory_standard}</p>
                    </div>
                  )}
                  {certificate.certification_body && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Certification Body</label>
                      <p className="text-lg mt-1">{certificate.certification_body}</p>
                    </div>
                  )}
                </div>

                {certificate.certificate_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Certificate Number</label>
                    <p className="text-lg mt-1 font-mono">{certificate.certificate_number}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                    <p className="text-lg mt-1">{format(new Date(certificate.issue_date), 'MMMM d, yyyy')}</p>
                  </div>
                  {certificate.expiration_date && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Expiration Date</label>
                      <p className="text-lg mt-1">{format(new Date(certificate.expiration_date), 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                </div>

                {certificate.internal_responsible && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Internal Responsible</label>
                    <p className="text-lg mt-1">{certificate.internal_responsible}</p>
                  </div>
                )}

                {certificate.internal_notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Internal Notes</label>
                    <p className="text-base mt-1 text-muted-foreground whitespace-pre-wrap">
                      {certificate.internal_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="text-muted-foreground min-w-[100px]">Created</div>
                  <div>{format(new Date(certificate.created_at), 'MMM d, yyyy h:mm a')}</div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="text-muted-foreground min-w-[100px]">Last Updated</div>
                  <div>{format(new Date(certificate.updated_at), 'MMM d, yyyy h:mm a')}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Certificate File</CardTitle>
              </CardHeader>
              <CardContent>
                {certificate.certificate_file_url ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No file uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
