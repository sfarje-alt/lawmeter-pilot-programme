import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users } from "lucide-react";
import { useOwnersRoster } from "@/hooks/useOwnersRoster";

interface OwnersRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OwnersRosterDialog({ open, onOpenChange }: OwnersRosterDialogProps) {
  const { roster, addOwner, removeOwner } = useOwnersRoster();
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    addOwner(draft);
    setDraft("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Responsables (Owners)
          </DialogTitle>
          <DialogDescription>
            Define las áreas o personas responsables. Las nuevas alertas las usarán como opciones por defecto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Input
              placeholder="p. ej. Legal, Compliance, Sergio Pérez"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <Button onClick={submit} className="gap-1.5">
              <Plus className="h-4 w-4" /> Añadir
            </Button>
          </div>

          {roster.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin responsables configurados.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {roster.map((o) => (
                <Badge key={o} variant="outline" className="gap-1.5 py-1.5 px-2 bg-muted/40">
                  {o}
                  <button
                    type="button"
                    onClick={() => removeOwner(o)}
                    className="hover:text-destructive"
                    aria-label={`Quitar ${o}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
