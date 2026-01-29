import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ClientProfile, INSTRUMENT_TYPES } from "../types";

interface Step4Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

const ENTITIES = [
  'Congreso de la República',
  'Poder Ejecutivo',
  'Tribunal Constitucional',
  'SBS',
  'SMV',
  'BCRP',
  'INDECOPI',
  'SUNAT',
  'OSINERGMIN',
  'OSIPTEL',
  'MTPE',
  'MINAM',
  'MEF',
];

export function Step4MonitoringScope({ data, onChange }: Step4Props) {
  const [newKeyword, setNewKeyword] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  const toggleInstrumentType = (type: string) => {
    if (data.instrumentTypes.includes(type)) {
      onChange({ instrumentTypes: data.instrumentTypes.filter(t => t !== type) });
    } else {
      onChange({ instrumentTypes: [...data.instrumentTypes, type] });
    }
  };

  const toggleEntity = (entity: string) => {
    if (data.additionalEntities.includes(entity)) {
      onChange({ additionalEntities: data.additionalEntities.filter(e => e !== entity) });
    } else {
      onChange({ additionalEntities: [...data.additionalEntities, entity] });
    }
  };

  const addKeyword = () => {
    if (newKeyword && !data.keywords.includes(newKeyword)) {
      onChange({ keywords: [...data.keywords, newKeyword] });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange({ keywords: data.keywords.filter(k => k !== keyword) });
  };

  const addExclusion = () => {
    if (newExclusion && !data.exclusions.includes(newExclusion)) {
      onChange({ exclusions: [...data.exclusions, newExclusion] });
      setNewExclusion("");
    }
  };

  const removeExclusion = (exclusion: string) => {
    onChange({ exclusions: data.exclusions.filter(e => e !== exclusion) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Monitoring Scope</h2>
        <p className="text-sm text-muted-foreground">
          Define what legislation to monitor for this client
        </p>
      </div>

      {/* Monitoring Objective */}
      <div className="space-y-2">
        <Label htmlFor="monitoringObjective">Monitoring Objective</Label>
        <Textarea
          id="monitoringObjective"
          value={data.monitoringObjective || ""}
          onChange={(e) => onChange({ monitoringObjective: e.target.value })}
          placeholder="Describe the monitoring objectives for this client..."
          className="bg-background/50 resize-none"
          rows={3}
        />
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label>Keywords</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="gap-1">
              {keyword}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeKeyword(keyword)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add keyword..."
            className="bg-background/50"
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          />
          <Button type="button" variant="outline" onClick={addKeyword} disabled={!newKeyword}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Exclusions */}
      <div className="space-y-2">
        <Label>Exclusions</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.exclusions.map((exclusion) => (
            <Badge key={exclusion} variant="destructive" className="gap-1 bg-destructive/20 text-destructive">
              {exclusion}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeExclusion(exclusion)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newExclusion}
            onChange={(e) => setNewExclusion(e.target.value)}
            placeholder="Add exclusion term..."
            className="bg-background/50"
            onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
          />
          <Button type="button" variant="outline" onClick={addExclusion} disabled={!newExclusion}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Additional Entities/Sources */}
      <div className="space-y-2">
        <Label>Additional Entities/Sources to Monitor</Label>
        <div className="flex flex-wrap gap-2">
          {ENTITIES.map((entity) => (
            <Badge
              key={entity}
              variant={data.additionalEntities.includes(entity) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleEntity(entity)}
            >
              {entity}
            </Badge>
          ))}
        </div>
      </div>

      {/* Instrument Types */}
      <div className="space-y-2">
        <Label>Instrument Types (Tipos de normas legales)</Label>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENT_TYPES.map((type) => (
            <Badge
              key={type}
              variant={data.instrumentTypes.includes(type) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleInstrumentType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
