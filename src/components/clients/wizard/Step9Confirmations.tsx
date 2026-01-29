import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientProfile } from "../types";
import { CheckCircle, AlertCircle, User } from "lucide-react";

interface Step9Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step9Confirmations({ data, onChange }: Step9Props) {
  const availableContacts = data.clientUsers.filter(u => u.email);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Confirmations</h2>
        <p className="text-sm text-muted-foreground">
          Review and confirm the client profile settings
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
            I acknowledge that the legislative information provided is sourced from official government 
            publications and that the analysis provided is for informational purposes only.
          </p>
        </div>
        <Switch
          id="sourceAcknowledgement"
          checked={data.sourceAcknowledgement}
          onCheckedChange={(checked) => onChange({ sourceAcknowledgement: checked })}
        />
      </div>

      {/* Primary Contact */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Primary Client Contact
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
        <p className="text-xs text-muted-foreground">
          This contact will be the main point of communication for this client profile.
        </p>
      </div>

      {/* Internal Notes */}
      <div className="space-y-2">
        <Label htmlFor="internalNotes">Internal Notes</Label>
        <Textarea
          id="internalNotes"
          value={data.internalNotes || ""}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          placeholder="Add any internal notes about this client profile..."
          className="bg-background/50 resize-none"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          These notes are only visible to the legal team and will not be shared with the client.
        </p>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="text-sm font-medium text-foreground mb-3">Profile Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Client:</span>
            <span className="ml-2 text-foreground font-medium">{data.legalName || 'Not set'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sector:</span>
            <span className="ml-2 text-foreground">{data.primarySector || 'Not set'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Users:</span>
            <span className="ml-2 text-foreground">{data.clientUsers.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Areas:</span>
            <span className="ml-2 text-foreground">{data.affectedAreas.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Keywords:</span>
            <span className="ml-2 text-foreground">{data.keywords.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Detail Level:</span>
            <span className="ml-2 text-foreground capitalize">{data.detailLevel}</span>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="space-y-2">
        <Label>Validation Status</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Basic Info', valid: !!data.legalName },
            { label: 'Users', valid: data.clientUsers.length > 0 },
            { label: 'Areas', valid: data.affectedAreas.length > 0 },
            { label: 'Monitoring', valid: data.keywords.length > 0 || data.lawBranches.length > 0 },
            { label: 'Priority', valid: !!data.highImpactDefinition || !!data.highUrgencyDefinition },
            { label: 'Acknowledgement', valid: data.sourceAcknowledgement },
          ].map((item) => (
            <div 
              key={item.label}
              className={`p-2 rounded text-xs flex items-center gap-2 ${
                item.valid 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {item.valid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
