import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";
import { ClientProfile, DEFAULT_CLIENT_PROFILE, WIZARD_STEPS } from "./types";
import { WizardProgress } from "./wizard/WizardProgress";
import { Step1Basics } from "./wizard/Step1Basics";
import { Step2Monitoring } from "./wizard/Step2Monitoring";
import { Step3Tags } from "./wizard/Step3Tags";
import { Step4Users } from "./wizard/Step4Users";
import { Step5Confirm } from "./wizard/Step5Confirm";

interface ClientWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClientProfile;
  onSave: (client: ClientProfile) => void;
}

export function ClientWizard({ open, onOpenChange, initialData, onSave }: ClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ClientProfile>(initialData || DEFAULT_CLIENT_PROFILE);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const updateData = (updates: Partial<ClientProfile>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    const clientToSave = { 
      ...data, 
      id: data.id || crypto.randomUUID(), 
      status: 'active' as const, 
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(clientToSave);
    toast.success("¡Perfil de cliente guardado exitosamente!");
    onOpenChange(false);
    setData(DEFAULT_CLIENT_PROFILE);
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Basics data={data} onChange={updateData} />;
      case 2: return <Step2Monitoring data={data} onChange={updateData} />;
      case 3: return <Step3Tags data={data} onChange={updateData} />;
      case 4: return <Step4Users data={data} onChange={updateData} />;
      case 5: return <Step5Confirm data={data} onChange={updateData} />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Perfil de Cliente' : 'Crear Perfil de Cliente'}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <WizardProgress currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        <div className="flex-1 overflow-y-auto py-4 min-h-[400px]">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Paso {currentStep} de 5</span>
          {currentStep < 5 ? (
            <Button onClick={handleNext}>
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!data.legalName}>
              <Save className="h-4 w-4 mr-1" /> Guardar Perfil
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
