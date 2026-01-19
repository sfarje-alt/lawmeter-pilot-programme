import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      setError("Unable to send reset email. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="bg-success/20 p-3 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">
          Enter your registered email and we'll send you a reset link.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <Button type="button" variant="ghost" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Button>
    </form>
  );
}
