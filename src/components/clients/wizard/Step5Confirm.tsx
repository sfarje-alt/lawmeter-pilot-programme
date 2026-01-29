import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientProfile } from "../types";
import { CheckCircle, AlertCircle, User } from "lucide-react";

interface Step5Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step5Confirm({ data, onChange }: Step5Props) {
  const availableContacts = data.clientUsers.filter(u => u.email);

  const validationItems = [
    { label: 'Razón Social', valid: !!data.legalName },
    { label: 'Sector', valid: !!data.primarySector },
    { label: 'Palabras Clave', valid: data.keywords.length > 0 },
    { label: 'Usuarios', valid: data.clientUsers.length > 0 },
    { label: 'Reconocimiento', valid: data.sourceAcknowledgement },
  ];

  const completionPercent = Math.round(
    (validationItems.filter(i => i.valid).length / validationItems.length) * 100
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Revisar y Confirmar</h2>
        <p className="text-sm text-muted-foreground">
          Revisa el perfil del cliente antes de guardar
        </p>
      </div>

      {/* Source Acknowledgement */}
      <div className="flex items-start gap-4 p-4 rounded-lg bg-background/30 border border-border/30">
        <div className="flex-1">
          <Label htmlFor="sourceAcknowledgement" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Reconocimiento de Fuentes Oficiales
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Reconozco que la información legislativa proviene de fuentes oficiales y el análisis es solo con fines informativos.
          </p>
        </div>
        <Switch
          id="sourceAcknowledgement"
          checked={data.sourceAcknowledgement}
          onCheckedChange={(checked) => onChange({ sourceAcknowledgement: checked })}
        />
      </div>

      {/* Primary Contact */}
      {availableContacts.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Contacto Principal
          </Label>
          <Select
            value={data.primaryContactId || ""}
            onValueChange={(value) => onChange({ primaryContactId: value })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Seleccionar contacto principal..." />
            </SelectTrigger>
            <SelectContent>
              {availableContacts.map((user) => (
                <SelectItem key={user.id || user.email} value={user.id || user.email}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Internal Notes */}
      <div className="space-y-2">
        <Label htmlFor="internalNotes">Notas Internas</Label>
        <Textarea
          id="internalNotes"
          value={data.internalNotes || ""}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          placeholder="Agregar notas internas..."
          className="bg-background/50 resize-none"
          rows={3}
        />
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Resumen del Perfil</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Cliente:</span>
            <span className="ml-2 font-medium">{data.legalName || 'No definido'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sector:</span>
            <span className="ml-2">{data.primarySector || 'No definido'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Palabras Clave:</span>
            <span className="ml-2">{data.keywords.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Usuarios:</span>
            <span className="ml-2">{data.clientUsers.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Categorías de Etiquetas:</span>
            <span className="ml-2">{data.tagCategories.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Instrumentos:</span>
            <span className="ml-2">{data.instrumentTypes.length}</span>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Estado de Completitud</Label>
          <span className={`text-sm font-medium ${completionPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {completionPercent}%
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {validationItems.map((item) => (
            <div 
              key={item.label}
              className={`p-2 rounded text-xs flex items-center gap-1 ${
                item.valid 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {item.valid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
