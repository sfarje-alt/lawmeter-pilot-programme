import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReportConfig, DEFAULT_REPORT_CONFIG } from "./types";
import { Step01TypeOfReport } from "./ReportWizardSteps/Step01TypeOfReport";
import { Step02ChooseAction } from "./ReportWizardSteps/Step02ChooseAction";
import { Step03Audience } from "./ReportWizardSteps/Step03Audience";
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
import { Step14PreviewConfirm } from "./ReportWizardSteps/Step14PreviewConfirm";
import { Step15AuditTrail } from "./ReportWizardSteps/Step15AuditTrail";
import { ReportPDFGenerator } from "./ReportPDFGenerator";
import { ChevronLeft, ChevronRight, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

const WIZARD_STEPS = [
  { id: 1, title: 'Tipo de Reporte' },
  { id: 2, title: 'Acción' },
  { id: 3, title: 'Audiencia' },
  { id: 4, title: 'Fechas' },
  { id: 5, title: 'Etapa' },
  { id: 6, title: 'Estados PL' },
  { id: 7, title: 'Tipos Norma' },
  { id: 8, title: 'Filtros' },
  { id: 9, title: 'Contenido' },
  { id: 10, title: 'Analytics' },
  { id: 11, title: 'Formato' },
  { id: 12, title: 'Programación' },
  { id: 13, title: 'Destinatarios' },
  { id: 14, title: 'Confirmar' },
  { id: 15, title: 'Historial' },
];

export function ReportGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ReportConfig>(DEFAULT_REPORT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const updateConfig = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 15) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPdfPreview(true);
      toast.success("Reporte generado exitosamente");
    } catch {
      toast.error("Error al generar el reporte");
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = (currentStep / 15) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step01TypeOfReport config={config} onUpdate={updateConfig} />;
      case 2: return <Step02ChooseAction config={config} onUpdate={updateConfig} />;
      case 3: return <Step03Audience config={config} onUpdate={updateConfig} />;
      case 4: return <Step04DateRange config={config} onUpdate={updateConfig} />;
      case 5: return <Step05Stage config={config} onUpdate={updateConfig} />;
      case 6: return <Step06BillsStatus config={config} onUpdate={updateConfig} />;
      case 7: return <Step07TypeOfLaws config={config} onUpdate={updateConfig} />;
      case 8: return <Step08BusinessFilters config={config} onUpdate={updateConfig} />;
      case 9: return <Step09ContentOptions config={config} onUpdate={updateConfig} />;
      case 10: return <Step10AnalyticsOptions config={config} onUpdate={updateConfig} />;
      case 11: return <Step11OutputDelivery config={config} onUpdate={updateConfig} />;
      case 12: return <Step12ScheduleSettings config={config} onUpdate={updateConfig} />;
      case 13: return <Step13Recipients config={config} onUpdate={updateConfig} />;
      case 14: return <Step14PreviewConfirm config={config} onUpdate={updateConfig} />;
      case 15: return <Step15AuditTrail showHistory={config.action === 'view_history'} />;
      default: return null;
    }
  };

  if (showPdfPreview) {
    return (
      <ReportPDFGenerator 
        config={config} 
        onBack={() => setShowPdfPreview(false)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Generador de Reportes</h1>
          <p className="text-muted-foreground">Configure y genere reportes legislativos profesionales</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Paso {currentStep} de 15</span>
          <span className="font-medium">{WIZARD_STEPS[currentStep - 1].title}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex gap-1 overflow-x-auto pb-2">
          {WIZARD_STEPS.map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`px-2 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                step.id === currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : step.id < currentStep 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {step.id}. {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 border-border/50 min-h-[500px]">
        {renderStep()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {currentStep === 14 && config.action !== 'view_history' && (
            <Button onClick={handleGenerate} disabled={isGenerating || config.clientIds.length === 0}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              Generar Reporte
            </Button>
          )}
          
          {currentStep < 15 && (
            <Button onClick={handleNext}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
