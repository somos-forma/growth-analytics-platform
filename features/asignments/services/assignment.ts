import { success } from "zod";

export const getAssignments = async (): Promise<any[]> => {
  const response = await fetch('https://auton8n.moovmediagroup.com/webhook/growth/clients');
  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }
  const data = await response.json();
  return data;
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
