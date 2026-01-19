import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { ClientProfile, COMPANY_TYPES } from "../types";

interface Step1Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

const COUNTRIES = [
  { code: 'PE', name: 'Perú' },
  { code: 'CO', name: 'Colombia' },
  { code: 'MX', name: 'México' },
  { code: 'CL', name: 'Chile' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brasil' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'BO', name: 'Bolivia' },
];

const SUPERVISING_AUTHORITIES = [
  'Banco Central de Reserva del Perú (BCRP)',
  'Superintendencia de Banca, Seguros y AFP (SBS)',
  'Superintendencia del Mercado de Valores (SMV)',
  'OSINERGMIN',
  'OSIPTEL',
  'SUNASS',
  'INDECOPI',
  'SUNAT',
  'Ministerio de Trabajo (MTPE)',
  'OEFA',
];

export function Step1ClientBasics({ data, onChange }: Step1Props) {
  const [newAuthority, setNewAuthority] = useState("");

  const addLocation = (country: string) => {
    if (!data.locations.find(l => l.country === country)) {
      onChange({
        locations: [...data.locations, { country, regions: [] }]
      });
    }
  };

  const removeLocation = (country: string) => {
    onChange({
      locations: data.locations.filter(l => l.country !== country)
    });
  };

  const addAuthority = (authority: string) => {
    if (authority && !data.supervisingAuthorities.includes(authority)) {
      onChange({
        supervisingAuthorities: [...data.supervisingAuthorities, authority]
      });
    }
    setNewAuthority("");
  };

  const removeAuthority = (authority: string) => {
    onChange({
      supervisingAuthorities: data.supervisingAuthorities.filter(a => a !== authority)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Client Basics</h2>
        <p className="text-sm text-muted-foreground">
          Basic information about the client organization
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="legalName">Legal Name *</Label>
          <Input
            id="legalName"
            value={data.legalName}
            onChange={(e) => onChange({ legalName: e.target.value })}
            placeholder="e.g., Empresa ABC S.A.C."
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tradeName">Trade Name</Label>
          <Input
            id="tradeName"
            value={data.tradeName || ""}
            onChange={(e) => onChange({ tradeName: e.target.value })}
            placeholder="e.g., ABC Corp"
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description (ES)</Label>
        <Textarea
          id="shortDescription"
          value={data.shortDescription || ""}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          placeholder="Brief description of the client's business..."
          className="bg-background/50 resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            value={data.website || ""}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://www.example.com"
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyType">Company Type</Label>
          <Select
            value={data.companyType || ""}
            onValueChange={(value) => onChange({ companyType: value })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-2">
        <Label>Locations (Perú + regions if needed)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.locations.map((loc) => (
            <Badge key={loc.country} variant="secondary" className="gap-1">
              {COUNTRIES.find(c => c.code === loc.country)?.name || loc.country}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeLocation(loc.country)}
              />
            </Badge>
          ))}
        </div>
        <Select onValueChange={addLocation}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Add location..." />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.filter(c => !data.locations.find(l => l.country === c.code)).map((country) => (
              <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Regulated Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
        <div>
          <Label htmlFor="isRegulated">Regulated Entity</Label>
          <p className="text-sm text-muted-foreground">
            Is this client subject to regulatory supervision?
          </p>
        </div>
        <Switch
          id="isRegulated"
          checked={data.isRegulated}
          onCheckedChange={(checked) => onChange({ isRegulated: checked })}
        />
      </div>

      {/* Supervising Authorities */}
      {data.isRegulated && (
        <div className="space-y-2">
          <Label>Supervising Authorities</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.supervisingAuthorities.map((authority) => (
              <Badge key={authority} variant="secondary" className="gap-1">
                {authority}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeAuthority(authority)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select onValueChange={addAuthority}>
              <SelectTrigger className="bg-background/50 flex-1">
                <SelectValue placeholder="Select authority..." />
              </SelectTrigger>
              <SelectContent>
                {SUPERVISING_AUTHORITIES.filter(a => !data.supervisingAuthorities.includes(a)).map((auth) => (
                  <SelectItem key={auth} value={auth}>{auth}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input
              value={newAuthority}
              onChange={(e) => setNewAuthority(e.target.value)}
              placeholder="Or add custom authority..."
              className="bg-background/50"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addAuthority(newAuthority)}
              disabled={!newAuthority}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
