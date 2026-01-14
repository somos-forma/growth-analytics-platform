import { integrationsAdapter } from "../adapters/integrationAdapter";

export const getIntegrations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const integrations = [
    {
      id: "1",
      name: "Google Analytics 4",
      key: "google_analytics",
      description: "Integrate with Google Analytics to track website traffic.",
      status: "connected",
      iconUrl: "/ga4.svg",
      lastSyncedAt: "2024-06-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Meta Ads",
      key: "meta_ads",
      description: "Integrate with Meta Ads to track advertising performance.",
      status: "paused",
      iconUrl: "/meta.svg",
      lastSyncedAt: "2024-06-14T15:30:00Z",
    },
    {
      id: "3",
      name: "Google Ads",
      key: "google_ads",
      description: "Integrate with Google Ads to track advertising campaigns.",
      status: "disconnected",
      iconUrl: "/ga2.svg",
      lastSyncedAt: "2024-06-13T12:45:00Z",
    },
  ];
  return integrationsAdapter(integrations);
};

export const performIntegrationAction = async (
  integrationId: string,
  action: string
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {};
};
