import { useMutation } from "@tanstack/react-query";
import { deleteAssignment } from "../services/assignment";

export const useDeleteAssignment = () => {
  return useMutation({
    mutationFn: deleteAssignment,
  });
};
