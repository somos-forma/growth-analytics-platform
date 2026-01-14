import { useMutation, useQueryClient } from "@tanstack/react-query";
import { performIntegrationAction } from "../services/integration";

type IntegrationActionVariables = {
  integrationId: string;
  action: string;
};

export const useIntegrationAction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (variables: IntegrationActionVariables) =>
      performIntegrationAction(variables.integrationId, variables.action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
    onError: (error) => {
      console.error("Error performing integration action:", error);
    },
  });

  return mutation;
};
