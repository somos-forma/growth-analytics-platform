import { User } from "../types/user.type";

export const getUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "admin",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password456",
      role: "user",
    },
  ];
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: data.name,
    email: data.email,
    password: data.password,
  };
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
