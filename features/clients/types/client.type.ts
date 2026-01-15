export type SourceItem = {
  sources: {
    ga4: { check: boolean; value: string; };
    google_ads: { check: boolean; value: string; };
    meta_ads: { check: boolean; value: string; };
  };
};

export type Client = {
  id: string;
  name: string;
  website_url: string;
  source: SourceItem[];
  gcp_id: string;
  updatedAt: string;
  createdAt: string;
};

export type CreateClientInput = {
  name: string;
  website_url: string;
  source: SourceItem[];
  gcp_id: string;
};

export type UpdateClientInput = {
  name: string;
  description?: string;
  website_url: string;
  source: SourceItem[];
  gcp_id: string;
};
