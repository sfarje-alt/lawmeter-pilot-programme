// Suscripción Realtime + fallback polling para una sesión.
// Devuelve la última versión de la row mientras el drawer esté abierto.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Sesion } from "./useSesiones";

export function useSesionRealtime(
  initial: Sesion | null,
  enabled: boolean,
): Sesion | null {
  const [sesion, setSesion] = useState<Sesion | null>(initial);

  // Resync cuando cambia la sesión seleccionada
  useEffect(() => {
    setSesion(initial);
  }, [initial?.external_id]);

  const externalId = initial?.external_id;

  useEffect(() => {
    if (!enabled || !externalId) return;

    const channel = supabase
      .channel(`sesion:${externalId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sesiones",
          filter: `external_id=eq.${externalId}`,
        },
        (payload) => {
          setSesion(payload.new as unknown as Sesion);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, externalId]);

  // Fallback polling mientras esté en proceso
  useEffect(() => {
    if (!enabled || !externalId) return;
    const status = sesion?.analysis_status;
    if (status !== "REQUESTED" && status !== "PROCESSING") return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("sesiones" as any)
        .select("*")
        .eq("external_id", externalId)
        .maybeSingle();
      if (data) setSesion(data as unknown as Sesion);
    }, 15000);

    return () => clearInterval(interval);
  }, [enabled, externalId, sesion?.analysis_status]);

  return sesion;
}
