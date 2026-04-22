import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, Save, Target, Tag as TagIcon, CheckCircle2 } from "lucide-react";
import { ClientProfile, DEFAULT_CLIENT_PROFILE } from "./types";
import { BEDSON_CLIENT_PROFILE } from "@/data/bedsonClientProfile";
import { Step1Basics } from "./wizard/Step1Basics";
import { Step2Monitoring } from "./wizard/Step2Monitoring";
import { Step3Tags } from "./wizard/Step3Tags";
import { Step5Confirm } from "./wizard/Step5Confirm";
import { toast } from "sonner";

const STORAGE_KEY = "lawmeter:company-profile";

function loadProfile(): ClientProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CLIENT_PROFILE, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...BEDSON_CLIENT_PROFILE };
}

export function ClientsPage() {
  const [profile, setProfile] = useState<ClientProfile>(() => loadProfile());
  const [dirty, setDirty] = useState(false);

  // Warn before unload if dirty
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleChange = (partial: Partial<ClientProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    setDirty(true);
  };

  const handleSave = () => {
    try {
      const toSave: ClientProfile = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setProfile(toSave);
      setDirty(false);
      toast.success("Perfil guardado correctamente");
    } catch {
      toast.error("No se pudo guardar el perfil");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
            <p className="text-muted-foreground">
              Configura el perfil único de tu organización: datos, criterios de monitoreo y etiquetas internas.
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={!dirty} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {dirty ? "Guardar cambios" : "Guardado"}
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{profile.legalName || "Sin nombre"}</CardTitle>
          <CardDescription>
            {profile.tradeName ? `${profile.tradeName} · ` : ""}
            {profile.primarySector || "Sin sector"}
            {profile.locations?.[0]?.country ? ` · ${profile.locations[0].country}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basics" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Datos básicos</span>
                <span className="sm:hidden">Datos</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Monitoreo</span>
                <span className="sm:hidden">Mon.</span>
              </TabsTrigger>
              <TabsTrigger value="tags" className="gap-2">
                <TagIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Etiquetas</span>
                <span className="sm:hidden">Tags</span>
              </TabsTrigger>
              <TabsTrigger value="confirm" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Confirmación</span>
                <span className="sm:hidden">Conf.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="mt-6">
              <Step1Basics data={profile} onChange={handleChange} />
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <Step2Monitoring data={profile} onChange={handleChange} />
            </TabsContent>

            <TabsContent value="tags" className="mt-6">
              <Step3Tags data={profile} onChange={handleChange} />
            </TabsContent>

            <TabsContent value="confirm" className="mt-6">
              <Step5Confirm data={profile} onChange={handleChange} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sticky footer save action for long forms */}
      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <Button onClick={handleSave} size="lg" className="shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Guardar cambios
          </Button>
        </div>
      )}
    </div>
  );
}
