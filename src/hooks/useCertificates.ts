import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Certificate, CertificateFilters } from '@/types/certificates';
import { toast } from '@/hooks/use-toast';

export const useCertificates = (filters?: CertificateFilters) => {
  return useQuery({
    queryKey: ['certificates', filters],
    queryFn: async () => {
      let query = supabase
        .from('certificates')
        .select(`
          *,
          clients (
            id,
            client_name,
            primary_country
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.clientId) {
        query = query.eq('client_id', filters.clientId);
      }

      if (filters?.countryOrRegion) {
        query = query.eq('country_or_region', filters.countryOrRegion);
      }

      if (filters?.certificateType) {
        query = query.eq('certificate_type', filters.certificateType);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.expirationRange && filters.expirationRange !== 'all') {
        const days = parseInt(filters.expirationRange);
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        
        query = query
          .gte('expiration_date', new Date().toISOString())
          .lte('expiration_date', futureDate.toISOString());
      }

      if (filters?.search) {
        query = query.or(`
          certificate_name.ilike.%${filters.search}%,
          product_name.ilike.%${filters.search}%,
          product_model.ilike.%${filters.search}%,
          certificate_number.ilike.%${filters.search}%,
          regulatory_standard.ilike.%${filters.search}%
        `);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Certificate[];
    },
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          clients (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Certificate;
    },
    enabled: !!id,
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificate: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...certificate, created_by: user?.id, updated_by: user?.id } as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: 'Success',
        description: 'Certificate created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('certificates')
        .update({ ...updates, updated_by: user?.id } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificate', variables.id] });
      toast({
        title: 'Success',
        description: 'Certificate updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: 'Success',
        description: 'Certificate deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
