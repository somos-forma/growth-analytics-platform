import { User } from "../types/user.type";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch('https://auton8n.moovmediagroup.com/webhook/growth/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const users: User[] = await response.json();
  return users;
};

export const createUser = async (data: {
  email: string;
  name: string;
  password: string;
  rol: string;
  client_id: string[];
}): Promise<User> => {
  try {
    const response = await fetch("https://auton8n.moovmediagroup.com/webhook/growth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    const createdUser: User = await response.json();
    return createdUser;
  } catch (error) {
    console.error("Error creating user", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return;
};

export const updateUser = async (data: {
  id: string;
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  console.log("update", data);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
  };
};
