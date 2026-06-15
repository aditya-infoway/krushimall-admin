// Import Dependencies
import React, { useState } from "react";
import clsx from "clsx";

// Local Imports
import { Page } from "@/components/shared/Page";
import { Card } from "@/components/ui";
import { KYCFormProvider } from "./KYCFormProvider.tsx";
import { Stepper } from "./Stepper.tsx";
import { UnderReview } from "./UnderReview";
import { Enginedetails } from "./steps/Enginedetails.tsx";
import { HydraulicTyres } from "./steps/HydraulicTyres.tsx";
import { Transmission } from "./steps/Transmission.tsx";
import { BasicInformation } from "./steps/BasicInformation.tsx";
import { FormState } from "./KYCFormContext.ts";
import { PriceLocation} from "./steps/priceLocation.tsx"
import { MediaDocumnet } from "./steps/MediaDocumnet.tsx"
import {PreviewSubmit } from "./steps/PreviewSubmit.tsx"
// ----------------------------------------------------------------------

export interface Step {
  key: keyof FormState["formData"];
  component: React.ComponentType<any>;
  label: string;
  description: string;
}

const steps: Step[] = [
  {
    key: "BasicInformation",
    component: BasicInformation,
    label: "Basic Information",
    description:
      "Please provide your personal information in order to complete your KYC",
  },
  {
    key: "Enginedetails",
    component: Enginedetails,
    label: "Engine Details",
    description: "Enter name, DOB, gender, email, phone and occupation",
  },
  {
    key: "Transmission",
    component: Transmission,
    label: "Transmission",
    description:
      "Upload a scanned copy of ID proof (passport, driver's license or ID Card).",
  },
  {
    key: "HydraulicTyres",
    component: HydraulicTyres,
    label: "Hydraulic & Tyres",
    description:
      "Read and agree to the terms and conditions of the form. Check the box to confirm information and consent.",
  },
  
   {
    key: "PriceLocation",
    component: PriceLocation,
    label: "Price & Location",
    description:
      "Read and agree to the terms and conditions of the form. Check the box to confirm information and consent.",
  },
  {
    key: "MediaDocumnet",
    component: MediaDocumnet,
    label: "Media & Documnet",
    description:
      "Read and agree to the terms and conditions of the form. Check the box to confirm information and consent.",
  },
   {
    key: "PreviewSubmit",
    component: PreviewSubmit,
    label: "Preview & Submit",
    description:
      "Read and agree to the terms and conditions of the form. Check the box to confirm information and consent.",
  },
];

const KYCForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const ActiveForm = steps[currentStep].component;

  const stepsNode = (
  <div className="col-span-12">

    {/* Stepper Card */}
    <Card className="p-5 mb-5">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </Card>

    {/* Form Card */}
    <Card className="p-5">
      <h5 className="dark:text-dark-100 text-lg font-medium text-gray-800">
        {steps[currentStep].label}
      </h5>

      <p className="dark:text-dark-200 text-sm text-gray-500 mb-6">
        {steps[currentStep].description}
      </p>

      {!finished && (
        <ActiveForm
          setCurrentStep={setCurrentStep}
          setFinished={setFinished}
        />
      )}
    </Card>

  </div>
);

  return (
    <Page title="eKYC Form">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-(--margin-x) pb-8">
        <h2 className="dark:text-dark-50 py-5 text-xl font-medium tracking-wide text-gray-800 lg:py-6 lg:text-2xl">
          Variant
        </h2>

        <KYCFormProvider>
          <div
            className={clsx(
              "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6",
              !finished && "grid-rows-[auto_1fr] sm:grid-rows-none",
            )}
          >
            {finished ? (
              <div className="col-span-12 place-self-center">
                <UnderReview />
              </div>
            ) : (
              stepsNode
            )}
          </div>
        </KYCFormProvider>
      </div>
    </Page>
  );
};

export default KYCForm;
