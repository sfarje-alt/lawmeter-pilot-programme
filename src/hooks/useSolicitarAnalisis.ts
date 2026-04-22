// Solicita análisis IA on-demand para una sesión.
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSolicitarAnalisis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solicitar = async (externalId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke(
        "solicitar-analisis-sesion",
        { body: { external_id: externalId } },
      );
      if (invokeErr) throw invokeErr;
      if (data?.error) throw new Error(data.error);
      return data as { status: string; estimated_seconds: number };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al solicitar análisis";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { solicitar, loading, error };
}
