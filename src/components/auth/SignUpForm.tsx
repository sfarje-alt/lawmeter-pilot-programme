import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Loader2, ArrowLeft, Building2, Users, Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Invitation codes mapping (in production, this would be validated server-side)
// Must match PRIMARY_CLIENT_ID from peruAlertsMockData for FarmaSalud
const INVITATION_CODES: Record<string, { clientId: string; clientName: string }> = {
  'FARMA2024': { clientId: 'client-farmasalud', clientName: 'FarmaSalud Perú S.A.C.' },
  'BANCO2024': { clientId: 'client-banco-nacional', clientName: 'Banco Nacional' },
  'MINERA2024': { clientId: 'client-minera-andina', clientName: 'Minera Andina S.A.' },
};

interface SignUpFormProps {
  onBack: () => void;
}

export function SignUpForm({ onBack }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState<'admin' | 'user'>('admin');
  const [invitationCode, setInvitationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const validateInvitationCode = (code: string): { valid: boolean; clientId?: string; clientName?: string } => {
    const normalizedCode = code.trim().toUpperCase();
    const mapping = INVITATION_CODES[normalizedCode];
    if (mapping) {
      return { valid: true, clientId: mapping.clientId, clientName: mapping.clientName };
    }
    return { valid: false };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    let clientId: string | undefined;

    if (accountType === 'user') {
      if (!invitationCode.trim()) {
        setError("Por favor ingresa tu código de invitación.");
        return;
      }
      
      const codeValidation = validateInvitationCode(invitationCode);
      if (!codeValidation.valid) {
        setError("Código de invitación inválido. Contacta a tu administrador.");
        return;
      }
      clientId = codeValidation.clientId;
    }

    setIsLoading(true);
    const { error } = await signUp(email.trim(), password, fullName.trim(), accountType, clientId);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este correo ya está registrado. Inicia sesión en su lugar.");
      } else {
        setError(error.message || "No se pudo crear la cuenta. Intenta de nuevo.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Account Type Selection */}
      <div className="space-y-2">
        <Label>Tipo de Cuenta</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccountType('admin')}
            className={`p-3 rounded-lg border-2 transition-all ${
              accountType === 'admin'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Building2 className={`h-5 w-5 mx-auto mb-1 ${accountType === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${accountType === 'admin' ? 'text-primary' : 'text-muted-foreground'}`}>
              Equipo Legal
            </span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('user')}
            className={`p-3 rounded-lg border-2 transition-all ${
              accountType === 'user'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Users className={`h-5 w-5 mx-auto mb-1 ${accountType === 'user' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${accountType === 'user' ? 'text-primary' : 'text-muted-foreground'}`}>
              Cliente
            </span>
          </button>
        </div>
      </div>

      {/* Invitation Code (only for Client account type) */}
      {accountType === 'user' && (
        <div className="space-y-2">
          <Label htmlFor="invitationCode">Código de Invitación</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="invitationCode"
              type="text"
              placeholder="Ingresa tu código de invitación"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              className="pl-10 uppercase"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>
          {invitationCode.trim() && validateInvitationCode(invitationCode).valid && (
            <div className="flex items-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded-md">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">
                Organización: <strong>{validateInvitationCode(invitationCode).clientName}</strong>
              </span>
            </div>
          )}
          {invitationCode.trim() && !validateInvitationCode(invitationCode).valid && (
            <p className="text-xs text-destructive">
              Código inválido. Contacta a tu administrador.
            </p>
          )}
          {!invitationCode.trim() && (
            <p className="text-xs text-muted-foreground">
              Contacta a tu administrador si no tienes un código de invitación.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10"
            autoComplete="name"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear Cuenta"
        )}
      </Button>

      <Button type="button" variant="ghost" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio de sesión
      </Button>
    </form>
  );
}
