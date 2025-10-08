import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, Plus, X } from "lucide-react";

interface AlertSettings {
  emailEnabled: boolean;
  emails: string[];
  frequency: "instant" | "daily" | "weekly";
  riskThreshold: "low" | "medium" | "high";
}

interface AlertSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertSettingsDialog({ open, onOpenChange }: AlertSettingsDialogProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AlertSettings>({
    emailEnabled: false,
    emails: [],
    frequency: "daily",
    riskThreshold: "medium",
  });
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("alertSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, [open]);

  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!newEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (settings.emails.includes(newEmail)) {
      toast({
        title: "Duplicate email",
        description: "This email is already in the list.",
        variant: "destructive",
      });
      return;
    }

    if (settings.emails.length >= 5) {
      toast({
        title: "Maximum reached",
        description: "You can only add up to 5 email addresses.",
        variant: "destructive",
      });
      return;
    }

    setSettings(prev => ({ ...prev, emails: [...prev.emails, newEmail] }));
    setNewEmail("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      emails: prev.emails.filter(email => email !== emailToRemove)
    }));
  };

  const handleSave = () => {
    if (settings.emailEnabled && settings.emails.length === 0) {
      toast({
        title: "Email required",
        description: "Please add at least one email address to enable alerts.",
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

          {/* Email Addresses List */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Addresses (Max 5)
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                disabled={!settings.emailEnabled || settings.emails.length >= 5}
              />
              <Button
                type="button"
                onClick={handleAddEmail}
                disabled={!settings.emailEnabled || settings.emails.length >= 5}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            
            {settings.emails.length > 0 && (
              <div className="space-y-2 mt-3">
                {settings.emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2"
                  >
                    <span className="text-sm">{email}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  {settings.emails.length} of 5 email addresses added
                </p>
              </div>
            )}
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
