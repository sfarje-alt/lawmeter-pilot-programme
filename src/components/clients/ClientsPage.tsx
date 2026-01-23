import { useState } from "react";
import { ClientsList } from "./ClientsList";
import { ClientWizard } from "./ClientWizard";
import { ClientProfile } from "./types";
import { MOCK_CLIENT_PROFILES } from "@/data/mockClientProfiles";

export function ClientsPage() {
  const [clients, setClients] = useState<ClientProfile[]>(MOCK_CLIENT_PROFILES);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | undefined>();

  const handleCreateClient = () => {
    setSelectedClient(undefined);
    setWizardOpen(true);
  };

  const handleSelectClient = (client: ClientProfile) => {
    setSelectedClient(client);
    setWizardOpen(true);
  };

  const handleSaveClient = (client: ClientProfile) => {
    if (selectedClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
    } else {
      setClients([...clients, client]);
    }
  };

  return (
    <>
      <ClientsList
        clients={clients}
        onCreateClient={handleCreateClient}
        onSelectClient={handleSelectClient}
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
