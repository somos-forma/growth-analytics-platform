import { Client, CreateClientInput } from "../types/client.type";

export const getClients = async (): Promise<Client[]> => {
  const response = await fetch('https://auton8n.moovmediagroup.com/webhook/growth/clients');
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  const clients: Client[] = await response.json();
  return clients;
};

export const createClient = async (data: CreateClientInput): Promise<Client> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    website_url: data.website_url,
    source: data.source,
    gcp_id: data.gcp_id,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

export const deleteClient = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return;
};

export const updateClient = async (data: Partial<Client> & { id: string }): Promise<Client> => {
  const { id, ...updateData } = data;
  const response = await fetch(`https://auton8n.moovmediagroup.com/webhook/31e5ab5d-d54b-40ed-a59c-7d107521920d/clients/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Failed to update client');
  }
  const updatedClient: Client = await response.json();
  return updatedClient;
};
