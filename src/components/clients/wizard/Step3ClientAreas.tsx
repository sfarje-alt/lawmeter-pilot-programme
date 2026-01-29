import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, History } from "lucide-react";
import { ClientProfile, ClientArea } from "../types";

interface Step3Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
  previouslyUsedAreas?: string[]; // Areas from other client profiles
}

// Default suggestions - these would normally come from existing client profiles
const SUGGESTED_AREAS = [
  'Finanzas',
  'Operaciones',
  'Recursos Humanos',
  'Legal',
  'Compliance',
  'IT',
  'Marketing',
  'Ventas',
  'Producción',
  'Logística',
  'Atención al Cliente',
];

export function Step3ClientAreas({ data, onChange, previouslyUsedAreas = [] }: Step3Props) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [responsibilityNote, setResponsibilityNote] = useState("");
  const [newAreaName, setNewAreaName] = useState("");

  // Combine suggested areas with previously used areas, removing duplicates
  const allSuggestedAreas = [...new Set([...previouslyUsedAreas, ...SUGGESTED_AREAS])];
  
  // Filter out areas that are already added
  const availableSuggestions = allSuggestedAreas.filter(
    area => !data.affectedAreas.find(a => a.area === area)
  );

  const addArea = (areaName: string) => {
    if (areaName.trim() && !data.affectedAreas.find(a => a.area === areaName.trim())) {
      const newArea = { area: areaName.trim(), responsibilityNote: "" };
      onChange({
        affectedAreas: [...data.affectedAreas, newArea]
      });
      // Auto-select the newly added area so user can add a note immediately
      setSelectedArea(areaName.trim());
      setResponsibilityNote("");
    }
  };

  const addCustomArea = () => {
    if (newAreaName.trim()) {
      addArea(newAreaName.trim());
      setNewAreaName("");
    }
  };

  const removeArea = (areaName: string) => {
    onChange({
      affectedAreas: data.affectedAreas.filter(a => a.area !== areaName)
    });
    if (selectedArea === areaName) {
      setSelectedArea(null);
      setResponsibilityNote("");
    }
  };

  const updateAreaNote = (areaName: string, note: string) => {
    onChange({
      affectedAreas: data.affectedAreas.map(a => 
        a.area === areaName ? { ...a, responsibilityNote: note } : a
      )
    });
  };

  const selectArea = (areaName: string) => {
    setSelectedArea(areaName);
    const area = data.affectedAreas.find(a => a.area === areaName);
    setResponsibilityNote(area?.responsibilityNote || "");
  };

  const saveNote = () => {
    if (selectedArea) {
      updateAreaNote(selectedArea, responsibilityNote);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Client Areas</h2>
        <p className="text-sm text-muted-foreground">
          Which departments within the client's company should be monitored for relevant legislation? Add responsibility notes to clarify monitoring scope.
        </p>
      </div>

      {/* Add Custom Area */}
      <div className="space-y-2">
        <Label>Add New Area</Label>
        <div className="flex gap-2">
          <Input
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Enter a new area name..."
            className="bg-background/50"
            onKeyPress={(e) => e.key === 'Enter' && addCustomArea()}
          />
          <Button 
            type="button" 
            onClick={addCustomArea} 
            disabled={!newAreaName.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Previously Used / Suggested Areas */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Quick Add (Previously Used & Common Areas)
          </Label>
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background/30 border border-border/30">
            {availableSuggestions.map((area) => {
              const isPreviouslyUsed = previouslyUsedAreas.includes(area);
              return (
                <Badge
                  key={area}
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/20 transition-colors ${
                    isPreviouslyUsed ? 'border-primary/50' : ''
                  }`}
                  onClick={() => addArea(area)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {area}
                  {isPreviouslyUsed && (
                    <span className="ml-1 text-[10px] text-primary">•</span>
                  )}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Click to add. Areas with <span className="text-primary">•</span> were used in other client profiles.
          </p>
        </div>
      )}

      {/* Added Areas List */}
      {data.affectedAreas.length > 0 && (
        <div className="space-y-2">
          <Label>Added Areas ({data.affectedAreas.length})</Label>
          <div className="flex flex-wrap gap-2">
            {data.affectedAreas.map((area) => (
              <Badge
                key={area.area}
                variant="secondary"
                className="gap-1 pl-3"
              >
                {area.area}
                {area.responsibilityNote && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500" title="Has note" />
                )}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                  onClick={() => removeArea(area.area)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Area Responsibility Notes Editor */}
      {data.affectedAreas.length > 0 && (
        <div className="space-y-4">
          <Label>Area Responsibility Notes</Label>
          <div className="grid grid-cols-2 gap-4">
            {/* Area List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {data.affectedAreas.map((area) => (
                <div
                  key={area.area}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedArea === area.area
                      ? "border-primary bg-primary/10"
                      : "border-border/30 bg-background/30 hover:border-border"
                  }`}
                  onClick={() => selectArea(area.area)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{area.area}</span>
                    {area.responsibilityNote && (
                      <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400">
                        Has note
                      </Badge>
                    )}
                  </div>
                  {area.responsibilityNote && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {area.responsibilityNote}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Note Editor */}
            <div className="space-y-2">
              {selectedArea ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Note for "{selectedArea}"</Label>
                    <Button size="sm" variant="outline" onClick={saveNote}>
                      Save Note
                    </Button>
                  </div>
                  <Textarea
                    value={responsibilityNote}
                    onChange={(e) => setResponsibilityNote(e.target.value)}
                    placeholder={`Describe the responsibilities and scope for ${selectedArea}...`}
                    className="bg-background/50 resize-none h-[250px]"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm border border-dashed border-border/30 rounded-lg p-8">
                  <div className="text-center">
                    <p>Select an area from the list</p>
                    <p className="text-xs mt-1">to add a responsibility note</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {data.affectedAreas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border/30 rounded-lg">
          <p>No areas added yet.</p>
          <p className="text-sm mt-1">Add custom areas or select from the suggestions above.</p>
        </div>
      )}
    </div>
  );
}
