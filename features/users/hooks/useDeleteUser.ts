import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../services/user";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar el usuario");
    },
  });
};
