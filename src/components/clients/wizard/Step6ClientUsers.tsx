import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, User, Mail, Phone, Briefcase } from "lucide-react";
import { ClientProfile, ClientUser, AREAS } from "../types";

interface Step6Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step6ClientUsers({ data, onChange }: Step6Props) {
  const [newUser, setNewUser] = useState<ClientUser>({
    name: '',
    email: '',
    title: '',
    area: '',
    phone: '',
    whatsappEnabled: false,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addUser = () => {
    if (newUser.name && newUser.email) {
      if (editingIndex !== null) {
        const updatedUsers = [...data.clientUsers];
        updatedUsers[editingIndex] = newUser;
        onChange({ clientUsers: updatedUsers });
        setEditingIndex(null);
      } else {
        onChange({ clientUsers: [...data.clientUsers, { ...newUser, id: crypto.randomUUID() }] });
      }
      setNewUser({
        name: '',
        email: '',
        title: '',
        area: '',
        phone: '',
        whatsappEnabled: false,
      });
    }
  };

  const editUser = (index: number) => {
    setNewUser(data.clientUsers[index]);
    setEditingIndex(index);
  };

  const removeUser = (index: number) => {
    onChange({ clientUsers: data.clientUsers.filter((_, i) => i !== index) });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewUser({
      name: '',
      email: '',
      title: '',
      area: '',
      phone: '',
      whatsappEnabled: false,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Client Users</h2>
        <p className="text-sm text-muted-foreground">
          Add users who will receive alerts and reports for this client
        </p>
      </div>

      {/* Stats */}
      <div className="p-4 rounded-lg bg-background/30 border border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Users</span>
          <Badge variant="secondary">{data.clientUsers.length}</Badge>
        </div>
      </div>

      {/* User Form */}
      <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border/30">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            {editingIndex !== null ? 'Edit User' : 'Add New User'}
          </Label>
          {editingIndex !== null && (
            <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Name *</Label>
            <Input
              id="userName"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Full name"
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email *</Label>
            <Input
              id="userEmail"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="email@example.com"
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userTitle">Title</Label>
            <Input
              id="userTitle"
              value={newUser.title || ''}
              onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
              placeholder="e.g., Legal Director"
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userArea">Area</Label>
            <Select
              value={newUser.area || ''}
              onValueChange={(value) => setNewUser({ ...newUser, area: value })}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userPhone">Phone</Label>
            <Input
              id="userPhone"
              type="tel"
              value={newUser.phone || ''}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="+51 999 999 999"
              className="bg-background/50"
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
            <div>
              <Label htmlFor="whatsappEnabled">WhatsApp Enabled</Label>
              <p className="text-xs text-muted-foreground">Receive alerts via WhatsApp</p>
            </div>
            <Switch
              id="whatsappEnabled"
              checked={newUser.whatsappEnabled}
              onCheckedChange={(checked) => setNewUser({ ...newUser, whatsappEnabled: checked })}
            />
          </div>
        </div>

        <Button 
          onClick={addUser} 
          disabled={!newUser.name || !newUser.email}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {editingIndex !== null ? 'Update User' : 'Add User'}
        </Button>
      </div>

      {/* User List */}
      {data.clientUsers.length > 0 && (
        <div className="space-y-2">
          <Label>Added Users</Label>
          <div className="space-y-2">
            {data.clientUsers.map((user, index) => (
              <div 
                key={user.id || index} 
                className="p-4 rounded-lg bg-background/30 border border-border/30 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {user.title && (
                          <Badge variant="outline" className="text-xs">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {user.title}
                          </Badge>
                        )}
                        {user.area && (
                          <Badge variant="secondary" className="text-xs">{user.area}</Badge>
                        )}
                        {user.whatsappEnabled && (
                          <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            WhatsApp
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => editUser(index)}>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeUser(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note about roles */}
      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
        <strong>Note:</strong> User roles are read-only and managed by system administrators.
      </div>
    </div>
  );
}
