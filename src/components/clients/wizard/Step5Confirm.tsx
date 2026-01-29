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
    { label: 'Company Name', valid: !!data.legalName },
    { label: 'Sector', valid: !!data.primarySector },
    { label: 'Keywords', valid: data.keywords.length > 0 },
    { label: 'Users', valid: data.clientUsers.length > 0 },
    { label: 'Acknowledgement', valid: data.sourceAcknowledgement },
  ];

  const completionPercent = Math.round(
    (validationItems.filter(i => i.valid).length / validationItems.length) * 100
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Review & Confirm</h2>
        <p className="text-sm text-muted-foreground">
          Review the client profile before saving
        </p>
      </div>

      {/* Source Acknowledgement */}
      <div className="flex items-start gap-4 p-4 rounded-lg bg-background/30 border border-border/30">
        <div className="flex-1">
          <Label htmlFor="sourceAcknowledgement" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Official Source Acknowledgement
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            I acknowledge that legislative information is from official sources and analysis is for informational purposes.
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
            Primary Contact
          </Label>
          <Select
            value={data.primaryContactId || ""}
            onValueChange={(value) => onChange({ primaryContactId: value })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select primary contact..." />
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
        <Label htmlFor="internalNotes">Internal Notes</Label>
        <Textarea
          id="internalNotes"
          value={data.internalNotes || ""}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          placeholder="Add any internal notes..."
          className="bg-background/50 resize-none"
          rows={3}
        />
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Profile Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Client:</span>
            <span className="ml-2 font-medium">{data.legalName || 'Not set'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sector:</span>
            <span className="ml-2">{data.primarySector || 'Not set'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Keywords:</span>
            <span className="ml-2">{data.keywords.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Users:</span>
            <span className="ml-2">{data.clientUsers.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tag Categories:</span>
            <span className="ml-2">{data.tagCategories.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Instruments:</span>
            <span className="ml-2">{data.instrumentTypes.length}</span>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Completion Status</Label>
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
