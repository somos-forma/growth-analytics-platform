import type { Client, CreateClientInput } from "../types/client.type";

export const getClients = async (): Promise<Client[]> => {
  const response = await fetch("https://auton8n.moovmediagroup.com/webhook/growth/clients");
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  const clients: Client[] = await response.json();
  return clients;
};

export const createClient = async (data: CreateClientInput): Promise<Client> => {
  console.log(data);
  try {
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create client");
    }
    const createdClient: Client = await response.json();
    return createdClient;
  } catch (error) {
    console.error("Error creating client", error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  const response = await fetch(
    `https://auton8n.moovmediagroup.com/webhook/31e5ab5d-d54b-40ed-a59c-7d107521920d/clients/${id}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
};

export const updateClient = async (data: Partial<Client> & { id: string }): Promise<Client> => {
  const { id, ...updateData } = data;

  const response = await fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update client");
  }
  const updatedClient: Client = await response.json();
  return updatedClient;
};
