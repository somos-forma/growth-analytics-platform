import { Client } from "../types/client.type";

export const getClients = async (): Promise<Client[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      name: "Empresa ABC",
      description: "Descripción de Empresa ABC",
      updatedAt: "2024-06-01T12:00:00Z",
      createdAt: "2024-01-15T09:30:00Z",
    },
    {
      id: "2",
      name: "Cliente XYZ",
      description: "Descripción de Cliente XYZ",
      updatedAt: "2024-06-01T12:00:00Z",
      createdAt: "2024-01-15T09:30:00Z",
    },
  ];
};

export const createClient = async (data: {
  name: string;
  description: string;
}): Promise<Client> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    description: data.description,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

export const deleteClient = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return;
};

export const updateClient = async (data: {
  id: string;
  name: string;
  description: string;
}): Promise<Client> => {
  console.log("update", data);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};
