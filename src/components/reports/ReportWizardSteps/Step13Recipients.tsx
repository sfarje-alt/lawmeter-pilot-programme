import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportConfig } from "../types";
import { Mail, Phone, Plus, X } from "lucide-react";

interface Step13Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step13Recipients({ config, onUpdate }: Step13Props) {
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const addEmail = () => {
    if (emailInput && emailInput.includes('@') && !config.emailRecipients.includes(emailInput)) {
      onUpdate({ emailRecipients: [...config.emailRecipients, emailInput] });
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    onUpdate({ emailRecipients: config.emailRecipients.filter(e => e !== email) });
  };

  const addPhone = () => {
    if (phoneInput && !config.whatsappRecipients.includes(phoneInput)) {
      onUpdate({ whatsappRecipients: [...config.whatsappRecipients, phoneInput] });
      setPhoneInput("");
    }
  };

  const removePhone = (phone: string) => {
    onUpdate({ whatsappRecipients: config.whatsappRecipients.filter(p => p !== phone) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Destinatarios</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Agregue los contactos que recibirán el reporte
        </p>
      </div>

      {/* Email Recipients */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-4 w-4 text-primary" />
            <span className="font-medium">Correo Electrónico</span>
          </div>
          
          <div className="flex gap-2 mb-3">
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEmail()}
            />
            <Button onClick={addEmail} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {config.emailRecipients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.emailRecipients.map(email => (
                <Badge key={email} variant="secondary" className="gap-1 pr-1">
                  <Mail className="h-3 w-3" />
                  {email}
                  <button
                    onClick={() => removeEmail(email)}
                    className="ml-1 p-0.5 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Recipients */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-emerald-400" />
            <span className="font-medium">WhatsApp</span>
            <Badge variant="outline" className="text-xs">Opcional</Badge>
          </div>
          
          <div className="flex gap-2 mb-3">
            <Input
              type="tel"
              placeholder="+51 999 999 999"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPhone()}
            />
            <Button onClick={addPhone} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {config.whatsappRecipients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.whatsappRecipients.map(phone => (
                <Badge key={phone} variant="secondary" className="gap-1 pr-1">
                  <Phone className="h-3 w-3" />
                  {phone}
                  <button
                    onClick={() => removePhone(phone)}
                    className="ml-1 p-0.5 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {config.emailRecipients.length === 0 && config.whatsappRecipients.length === 0 && (
        <p className="text-sm text-amber-400 text-center">
          ⚠️ No ha agregado ningún destinatario. El reporte solo estará disponible para descarga.
        </p>
      )}
    </div>
  );
}
