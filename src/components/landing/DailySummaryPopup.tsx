import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Inbox, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DailySummaryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailySummaryPopup({ open, onOpenChange }: DailySummaryPopupProps) {
  const { profile, dismissDailyPopup } = useAuth();
  const [greeting, setGreeting] = useState("Buen día");

  // Mock data for demo - replace with real queries later
  const stats = {
    lawsAnalyzed: 47,
    alertsDetected: 12,
    urgentAlerts: 3,
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Buenos días");
    } else if (hour < 18) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }
  }, []);

  const handleDismiss = async () => {
    await dismissDailyPopup();
    onOpenChange(false);
  };

  const handleGoToInbox = async () => {
    await dismissDailyPopup();
    onOpenChange(false);
    // Navigation will be handled by parent component
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl">
              {greeting}, {profile?.full_name?.split(' ')[0] || 'usuario'}
            </DialogTitle>
            {stats.urgentAlerts > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {stats.urgentAlerts} Urgentes
              </Badge>
            )}
          </div>
          <DialogDescription className="text-base pt-2">
            Esto es lo que ha pasado desde tu último ingreso
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {stats.lawsAnalyzed}
              </div>
              <div className="text-xs text-muted-foreground">
                Leyes y proyectos analizados
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Inbox className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {stats.alertsDetected}
              </div>
              <div className="text-xs text-muted-foreground">
                Alertas relevantes detectadas
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground text-center">
            Consulta tu bandeja para ver las fichas de alerta y su análisis.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            Cerrar
          </Button>
          <Button onClick={handleGoToInbox} className="flex-1">
            Ir a Bandeja
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
