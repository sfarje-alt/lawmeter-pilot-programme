import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { useCertificate, useCreateCertificate, useUpdateCertificate } from '@/hooks/useCertificates';
import { useClients, useCreateClient } from '@/hooks/useClients';
import { CertificateType } from '@/types/certificates';
import { calculateCertificateStatus, uploadCertificateFile } from '@/lib/certificateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const certificateTypes: CertificateType[] = [
  'CE',
  'FCC',
  'UL',
  'UKCA',
  'CB',
  'EMC',
  'RF',
  'Safety',
  'Eco-design',
  'Other',
];

const formSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  certificate_name: z.string().min(1, 'Certificate name is required'),
  certificate_type: z.enum(['CE', 'FCC', 'UL', 'UKCA', 'CB', 'EMC', 'RF', 'Safety', 'Eco-design', 'Other']),
  product_name: z.string().min(1, 'Product name is required'),
  product_model: z.string().optional(),
  country_or_region: z.string().min(1, 'Country/Region is required'),
  regulatory_standard: z.string().optional(),
  certification_body: z.string().optional(),
  certificate_number: z.string().optional(),
  issue_date: z.string().min(1, 'Issue date is required'),
  expiration_date: z.string().optional(),
  internal_responsible: z.string().optional(),
  internal_notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.expiration_date && data.issue_date) {
      return new Date(data.expiration_date) > new Date(data.issue_date);
    }
    return true;
  },
  {
    message: 'Expiration date must be after issue date',
    path: ['expiration_date'],
  }
);

type FormValues = z.infer<typeof formSchema>;

export default function CertificateForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== 'new';
  
  const { data: certificate, isLoading: loadingCertificate } = useCertificate(isEdit ? id! : '');
  const { data: clients = [], isLoading: loadingClients } = useClients();
  const createCertificate = useCreateCertificate();
  const updateCertificate = useUpdateCertificate();
  const createClient = useCreateClient();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: '',
      certificate_name: '',
      certificate_type: 'CE',
      product_name: '',
      product_model: '',
      country_or_region: '',
      regulatory_standard: '',
      certification_body: '',
      certificate_number: '',
      issue_date: '',
      expiration_date: '',
      internal_responsible: '',
      internal_notes: '',
    },
  });

  useEffect(() => {
    if (certificate && isEdit) {
      form.reset({
        client_id: certificate.client_id,
        certificate_name: certificate.certificate_name,
        certificate_type: certificate.certificate_type,
        product_name: certificate.product_name,
        product_model: certificate.product_model || '',
        country_or_region: certificate.country_or_region,
        regulatory_standard: certificate.regulatory_standard || '',
        certification_body: certificate.certification_body || '',
        certificate_number: certificate.certificate_number || '',
        issue_date: certificate.issue_date,
        expiration_date: certificate.expiration_date || '',
        internal_responsible: certificate.internal_responsible || '',
        internal_notes: certificate.internal_notes || '',
      });
    }
  }, [certificate, isEdit, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsUploading(true);

      let fileData = null;
      if (file) {
        const certificateId = id !== 'new' ? id : crypto.randomUUID();
        fileData = await uploadCertificateFile(file, values.client_id, certificateId);
      }

      const status = calculateCertificateStatus(values.expiration_date || null);

      const certificateData = {
        ...values,
        status,
        ...(fileData && {
          certificate_file_url: fileData.url,
          certificate_file_key: fileData.key,
        }),
      };

      if (isEdit) {
        await updateCertificate.mutateAsync({
          id: id!,
          updates: certificateData,
        });
      } else {
        await createCertificate.mutateAsync(certificateData);
      }

      navigate('/?tab=certificates');
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to save certificate',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isEdit && loadingCertificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/?tab=certificates')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Edit Certificate' : 'New Certificate'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update certificate information' : 'Add a new certificate to the repository'}
            </p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Certificate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.client_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certificate_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {certificateTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="certificate_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. FCC Certificate – Router X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="product_model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Model number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country_or_region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country/Region *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. USA, EU, China" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regulatory_standard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regulatory Standard</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. EN 55032, FCC Part 15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="certification_body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certification Body</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. TÜV, UL, Intertek" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certificate_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Certificate number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="issue_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiration_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="internal_responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Responsible</FormLabel>
                      <FormControl>
                        <Input placeholder="Person responsible" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internal_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any internal notes or comments"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-2 border-dashed rounded-lg p-6">
                  <FormLabel>Certificate File</FormLabel>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isUploading || createCertificate.isPending || updateCertificate.isPending}
                  >
                    {isUploading ? 'Uploading...' : isEdit ? 'Update Certificate' : 'Create Certificate'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/?tab=certificates')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
