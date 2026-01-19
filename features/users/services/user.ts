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
    const response = await fetch("/api/users", {
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
  try {
    const response = await fetch(`https://auton8n.moovmediagroup.com/webhook/45d08efd-1e10-4702-853a-5aefc36c399c/growth/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};

export const updateUser = async (data: {
  id: string;
  email: string;
  name: string;
  password: string;
  rol: string;
  client_id: string[];
}): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        password: data.password,
        rol: data.rol,
        client_id: data.client_id,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    const updatedUser: User = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};
