import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useEmailRecipients,
  useRecipientMutations,
  type RecipientKind,
} from "@/hooks/useEmailRecipients";

interface Props {
  clientId: string;
  clientName: string;
}

export function RecipientsManager({ clientId, clientName }: Props) {
  const { profile } = useAuth();
  const { data: recipients = [], isLoading } = useEmailRecipients(clientId);
  const { create, update, remove } = useRecipientMutations(clientId);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [kind, setKind] = useState<RecipientKind>("to");

  const handleAdd = async () => {
    if (!email.trim() || !profile?.organization_id) return;
    await create.mutateAsync({
      client_id: clientId,
      organization_id: profile.organization_id,
      email: email.trim().toLowerCase(),
      nombre: nombre.trim() || null,
      kind,
      activo: true,
    });
    setEmail("");
    setNombre("");
    setKind("to");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Destinatarios de email · {clientName}</CardTitle>
        <CardDescription>
          Estos correos reciben los reportes generados por el backend (cron semanal y on-demand).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_120px_auto] gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              placeholder="persona@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Nombre (opcional)</Label>
            <Input
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipo</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as RecipientKind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to">TO</SelectItem>
                <SelectItem value="cc">CC</SelectItem>
                <SelectItem value="bcc">BCC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={!email.trim() || create.isPending} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : recipients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Aún no hay destinatarios configurados.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.email}</TableCell>
                  <TableCell className="text-muted-foreground">{r.nombre || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.kind.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={r.activo}
                      onCheckedChange={(checked) =>
                        update.mutate({ id: r.id, patch: { activo: checked } })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove.mutate(r.id)}
                      disabled={remove.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
