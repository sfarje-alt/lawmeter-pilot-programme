import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import lawmeterLogo from "@/assets/lawmeter-logo-white.png";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

type AuthView = "login" | "forgot-password" | "signup";

export default function Auth() {
  const [view, setView] = useState<AuthView>("login");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTitle = () => {
    switch (view) {
      case "forgot-password":
        return "Reset Password";
      case "signup":
        return "Create Account";
      default:
        return "Welcome Back";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md glass-card border-border/30">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-xl">
              <img src={lawmeterLogo} alt="LawMeter" className="h-10 w-auto" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {view === "login" && (
            <LoginForm
              onForgotPassword={() => setView("forgot-password")}
              onSignUp={() => setView("signup")}
            />
          )}
          {view === "forgot-password" && (
            <ForgotPasswordForm onBack={() => setView("login")} />
          )}
          {view === "signup" && (
            <SignUpForm onBack={() => setView("login")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
