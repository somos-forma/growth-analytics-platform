import { success } from "zod";

export const getAssignments = async (): Promise<any[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      name: "Client ABC",
      description: "First assignment",
      updatedAt: "2025-10-01",
      createdAt: "2025-10-01",
    },
    {
      id: "2",
      name: "Client XYZ",
      description: "Second assignment",
      updatedAt: "2025-10-02",
      createdAt: "2025-10-02",
    },
    {
      id: "3",
      name: "Client 123",
      description: "Third assignment",
      updatedAt: "2025-10-03",
      createdAt: "2025-10-03",
    },
  ];
};

export const createAssignment = async (clientsId: {
  clientsId: string[];
}): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
  };
};

export const deleteAssignment = async (id: string): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
  };
};
