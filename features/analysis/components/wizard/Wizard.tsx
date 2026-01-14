"use client";
import { useWizardStore } from "./wizard-store";
import { BasicInfoStep } from "./steps/basic-info-step";
import { ModelStep } from "./steps/model-step";
import { ConnectionTypeStep } from "./steps/data-sources-step";
import { ConnectionsStep } from "./steps/connections-step";
import { DataSourcesPreviewStep } from "./steps/data-sources-preview";
import { DataClassificationStep } from "./steps/data-classification-step";
import { DataPreviewStep } from "./steps/data-preview-step";
import { DataDivisionMethodStep } from "./steps/data-division-method-step";

export const Wizard = () => {
  const { step } = useWizardStore();

  return (
    <div className="space-y-5 max-w-[800px]">
      <p>Paso {step} de 8</p>
      {step === 1 && <BasicInfoStep />}
      {step === 2 && <ModelStep />}
      {step === 3 && <ConnectionTypeStep />}
      {step === 4 && <ConnectionsStep />}
      {step === 5 && <DataDivisionMethodStep />}
      {step === 6 && <DataSourcesPreviewStep />}
      {step === 7 && <DataClassificationStep />}
      {step === 8 && <DataPreviewStep />}
    </div>
  );
};
