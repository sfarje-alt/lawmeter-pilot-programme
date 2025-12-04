import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2 } from 'lucide-react';
import { Certificate } from '@/types/certificates';
import { getStatusColor } from '@/lib/certificateUtils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDeleteCertificate } from '@/hooks/useCertificates';
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
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CertificateTableProps {
  certificates: Certificate[];
}

const ITEMS_PER_PAGE = 10;

export function CertificateTable({ certificates }: CertificateTableProps) {
  const navigate = useNavigate();
  const deleteCertificate = useDeleteCertificate();
  const isAdmin = useIsAdmin();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(certificates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCertificates = certificates.slice(startIndex, endIndex);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCertificate.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (certificates.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">No certificates found</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Product / Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country/Region</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Cert. Body</TableHead>
                <TableHead>Cert. Number</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">
                    {cert.clients?.client_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cert.product_name}</div>
                      {cert.product_model && (
                        <div className="text-xs text-muted-foreground">{cert.product_model}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cert.certificate_type}</Badge>
                  </TableCell>
                  <TableCell>{cert.country_or_region}</TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {cert.regulatory_standard || '-'}
                  </TableCell>
                  <TableCell>{cert.certification_body || '-'}</TableCell>
                  <TableCell className="max-w-[120px] truncate">
                    {cert.certificate_number || '-'}
                  </TableCell>
                  <TableCell>{format(new Date(cert.issue_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {cert.expiration_date
                      ? format(new Date(cert.expiration_date), 'MMM d, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/certificates/${cert.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(cert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
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
    </>
  );
}
