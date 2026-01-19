import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { ClientProfile, ClientArea, AREAS } from "../types";

interface Step3Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step3ClientAreas({ data, onChange }: Step3Props) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [responsibilityNote, setResponsibilityNote] = useState("");

  const addArea = (areaName: string) => {
    if (!data.affectedAreas.find(a => a.area === areaName)) {
      onChange({
        affectedAreas: [...data.affectedAreas, { area: areaName, responsibilityNote: "" }]
      });
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
          Select the areas affected by legislative changes and add responsibility notes
        </p>
      </div>

      {/* Available Areas */}
      <div className="space-y-2">
        <Label>Select Affected Areas</Label>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((area) => {
            const isSelected = data.affectedAreas.some(a => a.area === area);
            return (
              <Badge
                key={area}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => isSelected ? removeArea(area) : addArea(area)}
              >
                {area}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Selected Areas with Notes */}
      {data.affectedAreas.length > 0 && (
        <div className="space-y-4">
          <Label>Area Responsibility Notes</Label>
          <div className="grid grid-cols-2 gap-4">
            {/* Area List */}
            <div className="space-y-2">
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
                      <Badge variant="secondary" className="text-xs">Has note</Badge>
                    )}
                  </div>
                  {area.responsibilityNote && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
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
                    <Label>Note for {selectedArea}</Label>
                    <Button size="sm" variant="outline" onClick={saveNote}>
                      Save Note
                    </Button>
                  </div>
                  <Textarea
                    value={responsibilityNote}
                    onChange={(e) => setResponsibilityNote(e.target.value)}
                    placeholder={`Add responsibility note for ${selectedArea}...`}
                    className="bg-background/50 resize-none h-[200px]"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm border border-dashed border-border/30 rounded-lg">
                  Select an area to add a responsibility note
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {data.affectedAreas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border/30 rounded-lg">
          <p>No areas selected yet.</p>
          <p className="text-sm mt-1">Click on the areas above to add them.</p>
        </div>
      )}
    </div>
  );
}
