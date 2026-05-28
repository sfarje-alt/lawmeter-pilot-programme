import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReportArchivo {
  filename: string;
  format: string;
  size_bytes?: number | null;
  storage_key?: string | null;
  public_url?: string | null;
  signed_url?: string | null;
}

export interface ReportRow {
  id: string;
  organization_id: string;
  client_id: string;
  cliente_slug: string;
  cliente_nombre: string;
  periodo_desde: string;
  periodo_hasta: string;
  modelo: string;
  formatos: string[];
  idioma: string;
  paises: string[];
  pipelines: string[];
  total_pl: number;
  total_normas: number;
  total_sesiones: number;
  decisiones_requeridas: number;
  expert_comments_count: number;
  archivos: ReportArchivo[];
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export function useReports(clientId?: string | null) {
  return useQuery({
    queryKey: ["reports", clientId ?? "all"],
    queryFn: async (): Promise<ReportRow[]> => {
      let query = supabase
        .from("reports")
        .select("*")
        .order("periodo_hasta", { ascending: false })
        .order("generated_at", { ascending: false });

      if (clientId) query = query.eq("client_id", clientId);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        ...r,
        archivos: Array.isArray(r.archivos) ? r.archivos : [],
        formatos: r.formatos ?? [],
        paises: r.paises ?? [],
        pipelines: r.pipelines ?? [],
      }));
    },
  });
}
