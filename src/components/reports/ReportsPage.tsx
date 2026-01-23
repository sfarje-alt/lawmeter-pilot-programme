import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportClientConfigs } from "./ReportClientConfigs";
import { ReportScheduleDashboard } from "./ReportScheduleDashboard";
import { ReportHistory } from "./ReportHistory";
import { ReportManualGeneration } from "./ReportManualGeneration";
import { Building2, Calendar, History, FileDown } from "lucide-react";

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <p className="text-muted-foreground">
          Configure la generación automática de reportes por cliente y consulte el historial
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="clients" className="gap-2">
            <Building2 className="h-4 w-4" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            Programación
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <FileDown className="h-4 w-4" />
            Generar Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-6">
          <ReportClientConfigs />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <ReportScheduleDashboard />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ReportHistory />
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <ReportManualGeneration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
