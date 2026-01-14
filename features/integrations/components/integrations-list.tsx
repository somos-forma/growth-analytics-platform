import { useIntegrations } from "../hooks/useIntegrations";
import { IntegrationsGrid } from "./integrations-grid";

export const IntegrationsList = () => {
  const { data: integrations = [], isLoading, isError } = useIntegrations();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading integrations</div>;
  }
  console.log(integrations);
  return <IntegrationsGrid integrations={integrations} />;
};
