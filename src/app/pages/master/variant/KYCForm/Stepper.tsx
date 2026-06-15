// Import Dependencies
import clsx from "clsx";
import { HiCheck } from "react-icons/hi";

// Local Imports
// import { useBreakpointsContext } from "@/app/contexts/breakpoint/context";
// import { createScopedKeydownHandler } from "@/utils/dom/createScopedKeydownHandler";
import {
  StepKey,
  useKYCFormContext,
} from "./KYCFormContext";
import { Step } from ".";

// ----------------------------------------------------------------------

interface StepperProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export function Stepper({ steps, currentStep, setCurrentStep }: StepperProps) {
  // const { smAndUp } = useBreakpointsContext();
  const kycFormCtx = useKYCFormContext();
  const stepStatus = kycFormCtx.state.stepStatus;
  const stepKeys = Object.keys(kycFormCtx.state.formData) as StepKey[];
  
 return (
  <div className="w-full px-4 py-2">
    <div className="relative flex items-start justify-between">

      {/* Background Line */}
      {/* <div className="absolute top-5 left-[8%] right-[8%] h-[2px] bg-gray-200 dark:bg-dark-500" /> */}

      {steps.map((step, i) => {
        const currentStepActualStatus = stepStatus[step.key];
        const leftSiblingStepKey = getLeftSiblingStep(step.key, stepKeys);

        const isClickable =
          currentStepActualStatus.isDone ||
          (leftSiblingStepKey !== undefined &&
            stepStatus[leftSiblingStepKey]?.isDone);

        return (
         <div
  key={step.key}
  className="relative z-10 flex flex-col items-center flex-1"
>
  {i < steps.length - 1 && (
    <div
      className={clsx(
        "absolute top-5 left-1/2 w-full h-[2px]",
        currentStep > i
          ? "bg-primary-500"
          : "bg-gray-300 dark:bg-dark-500"
      )}
    />
  )}
            <button
              onClick={
                isClickable
                  ? () => currentStep !== i && setCurrentStep(i)
                  : undefined
              }
              disabled={!isClickable}
           className={clsx(
  "relative z-20 w-10 h-10 rounded-full border flex items-center justify-center font-medium transition-all",
                currentStep === i
                  ? "bg-primary-500 border-primary-500 text-white"
                  : stepStatus[step.key].isDone
                  ? "bg-primary-500 border-primary-500 text-white"
                  : "bg-gray-100 dark:bg-dark-600 border-gray-300 text-gray-700"
              )}
            >
              {stepStatus[step.key].isDone ? (
                <HiCheck className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </button>

            <span
              className={clsx(
                "mt-3 text-center text-xs font-medium",
                currentStep === i
                  ? "text-primary-500"
                  : "text-gray-500"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

function getLeftSiblingStep(stepKey: StepKey, keys: StepKey[]): StepKey | undefined {
  const index = keys.indexOf(stepKey);
  return index < 1 ? undefined : keys[index - 1];
}
}