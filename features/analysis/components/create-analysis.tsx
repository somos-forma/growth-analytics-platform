"use client";

import { Wizard } from "./wizard/Wizard";

export const CreateAnalysis = () => {
  return (
    <div className="space-y-5 ">
      <div>
        <h1 className="text-4xl font-bold">Crear análisis</h1>
        <p className="text-muted-foreground">
          Por favor, complete el formulario a continuación para crear un nuevo análisis.
        </p>
      </div>
      <Wizard />
    </div>
  );
};
