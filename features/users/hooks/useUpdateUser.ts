import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/user";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser as (data: {
      id: string;
      email: string;
      name: string;
      password: string;
      rol: string;
      type?: string;
      client_id: string[];
    }) => Promise<any>,
  });
};
