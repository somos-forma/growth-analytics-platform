"use client";
import { BasicInfoStep } from "./steps/basic-info-step";
import { ConnectionsStep } from "./steps/connections-step";
import { DataClassificationStep } from "./steps/data-classification-step";
import { DataDivisionMethodStep } from "./steps/data-division-method-step";
import { DataPreviewStep } from "./steps/data-preview-step";
import { DataSourcesPreviewStep } from "./steps/data-sources-preview";
import { ConnectionTypeStep } from "./steps/data-sources-step";
import { ModelStep } from "./steps/model-step";
import { useWizardStore } from "./wizard-store";

export const Wizard = () => {
  const { step } = useWizardStore();

  return (
    <div className="space-y-5 ">
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
