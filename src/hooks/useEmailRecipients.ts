import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type RecipientKind = "to" | "cc" | "bcc";

export interface EmailRecipient {
  id: string;
  organization_id: string;
  client_id: string;
  email: string;
  nombre: string | null;
  kind: RecipientKind;
  activo: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewRecipient {
  client_id: string;
  organization_id: string;
  email: string;
  nombre?: string | null;
  kind: RecipientKind;
  activo?: boolean;
  notes?: string | null;
}

export function useEmailRecipients(clientId?: string | null) {
  return useQuery({
    queryKey: ["client_email_recipients", clientId ?? "none"],
    enabled: !!clientId,
    queryFn: async (): Promise<EmailRecipient[]> => {
      const { data, error } = await supabase
        .from("client_email_recipients")
        .select("*")
        .eq("client_id", clientId!)
        .order("kind", { ascending: true })
        .order("email", { ascending: true });
      if (error) throw error;
      return (data ?? []) as EmailRecipient[];
    },
  });
}

export function useRecipientMutations(clientId?: string | null) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["client_email_recipients", clientId ?? "none"] });

  const create = useMutation({
    mutationFn: async (payload: NewRecipient) => {
      const { error } = await supabase
        .from("client_email_recipients")
        .insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Destinatario agregado" });
      invalidate();
    },
    onError: (e: any) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<EmailRecipient> }) => {
      const { error } = await supabase
        .from("client_email_recipients")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Destinatario actualizado" });
      invalidate();
    },
    onError: (e: any) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("client_email_recipients")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Destinatario eliminado" });
      invalidate();
    },
    onError: (e: any) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return { create, update, remove };
}
