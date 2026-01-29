import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User, Mail, Phone, Briefcase } from "lucide-react";
import { ClientProfile, ClientUser } from "../types";

interface Step4Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step4Users({ data, onChange }: Step4Props) {
  const [newUser, setNewUser] = useState<ClientUser>({
    name: '',
    email: '',
    title: '',
    phone: '',
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
      setNewUser({ name: '', email: '', title: '', phone: '' });
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
    setNewUser({ name: '', email: '', title: '', phone: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Client Users</h2>
        <p className="text-sm text-muted-foreground">
          Add users who will receive alerts and reports
        </p>
      </div>

      {/* Stats */}
      <div className="p-3 rounded-lg bg-background/30 border border-border/30 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Users</span>
        <Badge variant="secondary">{data.clientUsers.length}</Badge>
      </div>

      {/* User Form */}
      <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border/30">
        <div className="flex items-center justify-between">
          <Label className="font-medium">
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
          {data.clientUsers.map((user, index) => (
            <div 
              key={user.id || index} 
              className="p-3 rounded-lg bg-background/30 border border-border/30 hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {user.title && (
                    <Badge variant="outline" className="text-xs mr-2">
                      {user.title}
                    </Badge>
                  )}
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
      )}
    </div>
  );
}
