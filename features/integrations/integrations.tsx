"use client";

import { IntegrationsList } from "./components/integrations-list";

export const Integrations = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">Integraciones</h1>
        <p className="text-muted-foreground">
          Conecta tus plataformas de marketing para importar datos
          automáticamente
        </p>
      </div>
      <IntegrationsList />
    </div>
  );
};
