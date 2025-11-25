import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/certificates';

export const useUserRole = () => {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // User has no role assigned, default to 'user'
        return 'user' as AppRole;
      }

      return data?.role as AppRole;
    },
  });
};

export const useIsAdmin = () => {
  const { data: role } = useUserRole();
  return role === 'admin';
};
