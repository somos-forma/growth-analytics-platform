import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/user";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
  });
};
