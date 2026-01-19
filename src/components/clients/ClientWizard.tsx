import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";
import { ClientProfile, DEFAULT_CLIENT_PROFILE, WIZARD_STEPS } from "./types";
import { WizardProgress } from "./wizard/WizardProgress";
import { Step1ClientBasics } from "./wizard/Step1ClientBasics";
import { Step2BusinessScope } from "./wizard/Step2BusinessScope";
import { Step3ClientAreas } from "./wizard/Step3ClientAreas";
import { Step4MonitoringScope } from "./wizard/Step4MonitoringScope";
import { Step5PriorityLogic } from "./wizard/Step5PriorityLogic";
import { Step6ClientUsers } from "./wizard/Step6ClientUsers";
import { Step7DeliverySettings } from "./wizard/Step7DeliverySettings";
import { Step8ReportDefaults } from "./wizard/Step8ReportDefaults";
import { Step9Confirmations } from "./wizard/Step9Confirmations";

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
    if (currentStep < 9) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    const clientToSave = { ...data, id: data.id || crypto.randomUUID(), status: 'active' as const, createdAt: new Date().toISOString() };
    onSave(clientToSave);
    toast.success("Client profile saved successfully!");
    onOpenChange(false);
    setData(DEFAULT_CLIENT_PROFILE);
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1ClientBasics data={data} onChange={updateData} />;
      case 2: return <Step2BusinessScope data={data} onChange={updateData} />;
      case 3: return <Step3ClientAreas data={data} onChange={updateData} />;
      case 4: return <Step4MonitoringScope data={data} onChange={updateData} />;
      case 5: return <Step5PriorityLogic data={data} onChange={updateData} />;
      case 6: return <Step6ClientUsers data={data} onChange={updateData} />;
      case 7: return <Step7DeliverySettings data={data} onChange={updateData} />;
      case 8: return <Step8ReportDefaults data={data} onChange={updateData} />;
      case 9: return <Step9Confirmations data={data} onChange={updateData} />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Client Profile' : 'Create Client Profile'}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <WizardProgress currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        <div className="flex-1 overflow-y-auto py-4 min-h-[400px]">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">Step {currentStep} of 9</span>
          {currentStep < 9 ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!data.legalName}>
              <Save className="h-4 w-4 mr-1" /> Save Profile
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
