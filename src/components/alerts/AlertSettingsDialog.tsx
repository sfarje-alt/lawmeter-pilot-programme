import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell } from "lucide-react";

interface AlertSettings {
  emailEnabled: boolean;
  email: string;
  frequency: "instant" | "daily" | "weekly";
  riskThreshold: "low" | "medium" | "high";
  maxAlertsPerEmail: number;
  portfolioKeywordsOnly: boolean;
}

interface AlertSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertSettingsDialog({ open, onOpenChange }: AlertSettingsDialogProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AlertSettings>({
    emailEnabled: false,
    email: "",
    frequency: "daily",
    riskThreshold: "medium",
    maxAlertsPerEmail: 5,
    portfolioKeywordsOnly: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("alertSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, [open]);

  const handleSave = () => {
    if (settings.emailEnabled && !settings.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to enable alerts.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("alertSettings", JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your alert preferences have been updated.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Settings
          </DialogTitle>
          <DialogDescription>
            Configure how and when you receive alerts about legislative changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Alerts Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email when new alerts match your criteria
              </p>
            </div>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, emailEnabled: checked }))
              }
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={settings.email}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!settings.emailEnabled}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Alert Frequency</Label>
            <Select
              value={settings.frequency}
              onValueChange={(value: any) =>
                setSettings((prev) => ({ ...prev, frequency: value }))
              }
              disabled={!settings.emailEnabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant (as they happen)</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Threshold */}
          <div className="space-y-2">
            <Label>Minimum Risk Level</Label>
            <Select
              value={settings.riskThreshold}
              onValueChange={(value: any) =>
                setSettings((prev) => ({ ...prev, riskThreshold: value }))
              }
              disabled={!settings.emailEnabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low and above</SelectItem>
                <SelectItem value="medium">Medium and above</SelectItem>
                <SelectItem value="high">High only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Only receive alerts for items at or above this risk level
            </p>
          </div>

          {/* Max Alerts Per Email */}
          <div className="space-y-2">
            <Label htmlFor="maxAlerts">Maximum Alerts per Email</Label>
            <Input
              id="maxAlerts"
              type="number"
              min={1}
              max={20}
              value={settings.maxAlertsPerEmail}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  maxAlertsPerEmail: parseInt(e.target.value) || 5,
                }))
              }
              disabled={!settings.emailEnabled}
            />
            <p className="text-sm text-muted-foreground">
              Limit the number of alerts included in each email (1-20)
            </p>
          </div>

          {/* Portfolio Keywords Only */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Portfolio Keywords Only</Label>
              <p className="text-sm text-muted-foreground">
                Only receive alerts that match your portfolio keywords
              </p>
            </div>
            <Switch
              checked={settings.portfolioKeywordsOnly}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, portfolioKeywordsOnly: checked }))
              }
              disabled={!settings.emailEnabled}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
