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

export const createAssignment = async (data: {
  id: string;
  clientsId: string[];
}): Promise<any> => {
  try {
    const response = await fetch(`/api/users/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: data.clientsId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user assignments');
    }
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user assignments", error);
    throw error;
  }
};

export const deleteAssignment = async (id: string): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
  };
};
