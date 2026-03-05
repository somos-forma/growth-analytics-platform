export type SourceItem = {
  sources: {
    ga4: { check: boolean; value: string };
    google_ads: { check: boolean; value: string };
    meta_ads: { check: boolean; value: string };
  };
};

export type Client = {
  id: string;
  name: string;
  website_url: string;
  source: SourceItem[];
  gcp_id: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  type?: {
    leads: { check: boolean };
    ecommerce: { check: boolean };
  };
};

export type CreateClientInput = {
  name: string;
  description?: string;
  website_url: string;
  source: SourceItem[];
  gcp_id: string;
  type?: {
    leads: { check: boolean };
    ecommerce: { check: boolean };
  };
};

export type UpdateClientInput = {
  name: string;
  description?: string;
  website_url: string;
  source: SourceItem[];
  gcp_id: string;
  type?: {
    leads: { check: boolean };
    ecommerce: { check: boolean };
  };
};
