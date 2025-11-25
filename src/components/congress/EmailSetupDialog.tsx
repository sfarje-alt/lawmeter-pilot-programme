import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle2, Mail, Webhook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmailSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailSetupDialog({ open, onOpenChange }: EmailSetupDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const webhookUrl = `${window.location.origin}/functions/v1/email-bill-updates`;

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Webhook URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configure Email Notifications
          </DialogTitle>
          <DialogDescription>
            Get real-time updates when Congress.gov sends email alerts about bills you're tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Subscribe to Congress.gov */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <h3 className="font-semibold">Subscribe to Congress.gov Email Alerts</h3>
            </div>
            <Alert>
              <AlertDescription className="space-y-2">
                <p>For each bill you want to track:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                  <li>Go to the bill page on Congress.gov</li>
                  <li>Click "Get email alerts for this legislation"</li>
                  <li>Sign in or create a Congress.gov account</li>
                  <li>Confirm your subscription</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>

          {/* Step 2: Set up Email Forwarding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <h3 className="font-semibold">Forward Emails to Webhook</h3>
            </div>
            <Alert>
              <AlertDescription className="space-y-3">
                <p className="text-sm">Use one of these services to forward Congress.gov emails:</p>
                
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Option A: Zapier Email Parser (Recommended)</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                    <li>Create free account at <a href="https://parser.zapier.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">parser.zapier.com</a></li>
                    <li>Create a new mailbox and get your parser email address</li>
                    <li>Forward Congress.gov emails to your parser address</li>
                    <li>Create a Zap that sends POST request to the webhook URL below</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-sm">Option B: Mailgun Email Forwarding</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                    <li>Sign up at <a href="https://mailgun.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mailgun.com</a> (free tier available)</li>
                    <li>Set up a route to forward emails to the webhook URL</li>
                    <li>Configure your email to forward to your Mailgun address</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Webhook URL */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              <Label htmlFor="webhook-url">Webhook URL</Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyWebhookUrl}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy this URL and paste it into your email forwarding service configuration
            </p>
          </div>

          {/* How it Works */}
          <Alert>
            <AlertDescription>
              <p className="font-semibold mb-2 text-sm">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>Congress.gov sends you email when a tracked bill is updated</li>
                <li>Your email service forwards it to the webhook</li>
                <li>The webhook automatically marks the bill as updated</li>
                <li>You'll see a <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-500 text-white">🔔 New Update</span> badge on the bill card</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
