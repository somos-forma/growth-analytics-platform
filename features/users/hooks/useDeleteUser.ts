import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../services/user";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};
