import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ReportConfig, DEFAULT_REPORT_CONFIG } from "./types";
import { Step01TypeOfReport } from "./ReportWizardSteps/Step01TypeOfReport";
import { Step04DateRange } from "./ReportWizardSteps/Step04DateRange";
import { Step05Stage } from "./ReportWizardSteps/Step05Stage";
import { Step06BillsStatus } from "./ReportWizardSteps/Step06BillsStatus";
import { Step07TypeOfLaws } from "./ReportWizardSteps/Step07TypeOfLaws";
import { Step08BusinessFilters } from "./ReportWizardSteps/Step08BusinessFilters";
import { Step09ContentOptions } from "./ReportWizardSteps/Step09ContentOptions";
import { Step10AnalyticsOptions } from "./ReportWizardSteps/Step10AnalyticsOptions";
import { Step11OutputDelivery } from "./ReportWizardSteps/Step11OutputDelivery";
import { Step12ScheduleSettings } from "./ReportWizardSteps/Step12ScheduleSettings";
import { Step13Recipients } from "./ReportWizardSteps/Step13Recipients";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";

interface ReportConfigDialogProps {
  clientId: string | null;
  clientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONFIG_STEPS = [
  { id: 1, title: 'Tipo de Reporte' },
  { id: 2, title: 'Rango de Fechas' },
  { id: 3, title: 'Etapa Legislativa' },
  { id: 4, title: 'Estados de PLs' },
  { id: 5, title: 'Tipos de Normas' },
  { id: 6, title: 'Filtros de Negocio' },
  { id: 7, title: 'Contenido' },
  { id: 8, title: 'Analytics' },
  { id: 9, title: 'Formato' },
  { id: 10, title: 'Programación' },
  { id: 11, title: 'Destinatarios' },
];

export function ReportConfigDialog({ clientId, clientName, open, onOpenChange }: ReportConfigDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ReportConfig>({
    ...DEFAULT_REPORT_CONFIG,
    clientIds: clientId ? [clientId] : [],
    action: 'schedule', // Force schedule mode for client config
  });

  const updateConfig = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 11) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSave = () => {
    toast.success(`Configuración de reportes guardada para ${clientName}`);
    onOpenChange(false);
    setCurrentStep(1);
  };

  const progress = (currentStep / 11) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step01TypeOfReport config={config} onUpdate={updateConfig} />;
      case 2: return <Step04DateRange config={config} onUpdate={updateConfig} />;
      case 3: return <Step05Stage config={config} onUpdate={updateConfig} />;
      case 4: return <Step06BillsStatus config={config} onUpdate={updateConfig} />;
      case 5: return <Step07TypeOfLaws config={config} onUpdate={updateConfig} />;
      case 6: return <Step08BusinessFilters config={config} onUpdate={updateConfig} />;
      case 7: return <Step09ContentOptions config={config} onUpdate={updateConfig} />;
      case 8: return <Step10AnalyticsOptions config={config} onUpdate={updateConfig} />;
      case 9: return <Step11OutputDelivery config={config} onUpdate={updateConfig} />;
      case 10: return <Step12ScheduleSettings config={{...config, action: 'schedule'}} onUpdate={updateConfig} />;
      case 11: return <Step13Recipients config={config} onUpdate={updateConfig} />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Reportes: {clientName}</DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paso {currentStep} de 11</span>
            <span className="font-medium">{CONFIG_STEPS[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] py-4">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentStep === 11 ? (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
