import { Integration } from "../types/integration.type";
import { IntegrationCard } from "./integration-card";

interface IntegrationsGridProps {
  integrations: Integration[];
}
export const IntegrationsGrid = ({ integrations }: IntegrationsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
};
