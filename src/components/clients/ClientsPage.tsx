import { useState } from "react";
import { ClientsList } from "./ClientsList";
import { ClientWizard } from "./ClientWizard";
import { ClientProfileDrawer } from "./ClientProfileDrawer";
import { ClientProfile } from "./types";
import { MOCK_CLIENT_PROFILES } from "@/data/mockClientProfiles";
import { toast } from "sonner";

export function ClientsPage() {
  const [clients, setClients] = useState<ClientProfile[]>(MOCK_CLIENT_PROFILES);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | undefined>();

  const handleCreateClient = () => {
    setSelectedClient(undefined);
    setWizardOpen(true);
  };

  const handleSelectClient = (client: ClientProfile) => {
    setSelectedClient(client);
    setDrawerOpen(true);
  };

  const handleEditClient = () => {
    setDrawerOpen(false);
    setWizardOpen(true);
  };

  const handleSaveClient = (client: ClientProfile) => {
    if (selectedClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
    } else {
      setClients([...clients, client]);
    }
  };

  const handleUpdateClient = (updatedClient: ClientProfile) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    setSelectedClient(updatedClient);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setSelectedClient(undefined);
    toast.success("Perfil eliminado");
  };

  return (
    <>
      <ClientsList
        clients={clients}
        onCreateClient={handleCreateClient}
        onSelectClient={handleSelectClient}
      />
      <ClientProfileDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        client={selectedClient || null}
        onEdit={handleEditClient}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
      />
      <ClientWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        initialData={selectedClient}
        onSave={handleSaveClient}
      />
    </>
  );
}
