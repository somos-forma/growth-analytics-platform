export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  rol: string;
  client_id: string[];
  type?: { leads: { check: boolean }; ecommerce: { check: boolean } };
};
