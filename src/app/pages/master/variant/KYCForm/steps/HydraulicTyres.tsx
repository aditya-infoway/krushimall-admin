// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

// Local Imports
import { Button, Input } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { HydraulicTyresSchema, HydraulicTyresType } from "../schema";

// ----------------------------------------------------------------------

// Options for select fields
const hydraulicTypeOptions = [
  { label: "Standard Hydraulics", value: "standard" },
  { label: "Advanced Hydraulics", value: "advanced" },
  { label: "Premium Hydraulics", value: "premium" },
];

const controlTypeOptions = [
  { 
    label: "Automatic Control", 
    value: "automatic",
    description: "Automatic response and easy operation"
  },
  { 
    label: "Manual Control", 
    value: "manual",
    description: "Manual operation and full control"
  },
];

const remoteValveOptions = [
  { 
    label: "Single Acting", 
    value: "single_acting",
    description: "For single direction operation"
  },
  { 
    label: "Double Acting", 
    value: "double_acting",
    description: "For both direction operation"
  },
];

const remoteValveCountOptions = [
  { label: "1 Remote Valve", value: "1" },
  { label: "2 Remote Valves", value: "2" },
  { label: "3 Remote Valves", value: "3" },
  { label: "4 Remote Valves", value: "4" },
  { label: "5+ Remote Valves", value: "5_plus" },
];

export function HydraulicTyres({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<HydraulicTyresType>({
    resolver: yupResolver(HydraulicTyresSchema) as Resolver<HydraulicTyresType>,
    defaultValues: kycFormCtx.state.formData.HydraulicTyres,
  });

  const onSubmit = (data: HydraulicTyresType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      kycFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: { HydraulicTyres: { ...data } },
      });
      kycFormCtx.dispatch({
        type: "SET_STEP_STATUS",
        payload: { HydraulicTyres: { isDone: true } },
      });
      setCurrentStep(3);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-8">
        {/* Hydraulic System Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Hydraulic System</h3>
          <p className="mb-4 text-sm text-gray-500">
            Add hydraulic system details of this tractor
          </p>

          {/* Lifting Capacity */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">
              Maximum Lifting Capacity (kg) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Input
                {...register("liftingCapacity")}
                type="number"
                placeholder="Enter lifting capacity"
                error={errors?.liftingCapacity?.message}
                className="flex-1"
              />
              <span className="text-gray-500">kg</span>
            </div>
          </div>

          {/* Hydraulic Type */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">
              Hydraulic Type
            </label>
            <select
              {...register("hydraulicType")}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select hydraulic system type</option>
              {hydraulicTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors?.hydraulicType && (
              <p className="mt-1 text-sm text-red-500">{errors.hydraulicType.message}</p>
            )}
          </div>

          {/* ADDC, Position Control, Draft Control - Checkboxes */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("addc")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <span className="font-medium">ADDC</span>
                <p className="text-xs text-gray-500">
                  Automatic Depth & Draft Control
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("positionControl")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <span className="font-medium">Position Control</span>
                <p className="text-xs text-gray-500">
                  Maintain implement position
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("draftControl")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <span className="font-medium">Draft Control</span>
                <p className="text-xs text-gray-500">
                  Manual operation and full control
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Control Type Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Control Type</h3>
          <div className="flex flex-wrap gap-6">
            {controlTypeOptions.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  value={option.value}
                  {...register("controlType")}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <span className="font-medium">{option.label}</span>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors?.controlType && (
            <p className="mt-2 text-sm text-red-500">{errors.controlType.message}</p>
          )}
        </div>

        {/* Remote Valve (Spool) Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Remote Valve (Spool)</h3>
          <div className="flex flex-wrap gap-6">
            {remoteValveOptions.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  value={option.value}
                  {...register("remoteValveType")}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <span className="font-medium">{option.label}</span>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors?.remoteValveType && (
            <p className="mt-2 text-sm text-red-500">{errors.remoteValveType.message}</p>
          )}
        </div>

        {/* Number of Remote Valves */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Number of Remote Valves</h3>
          <select
            {...register("numberOfRemoteValves")}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select number of remote valves</option>
            {remoteValveCountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors?.numberOfRemoteValves && (
            <p className="mt-2 text-sm text-red-500">{errors.numberOfRemoteValves.message}</p>
          )}
        </div>

        {/* Additional Hydraulic Features */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Additional Hydraulic Features</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.externalHydraulicCylinder")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>External Hydraulic Cylinder</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.selfLevelling")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Self Levelling</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.quickHitch")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Quick Hitch</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.downPositionControl")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Down Position Control</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.loadSensing")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Load Sensing</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.flowControl")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Flow Control</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.returnToDepth")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Return to Depth</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register("features.transportLock")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Transport Lock</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          // variant="outline"
          className="min-w-[7rem]"
          onClick={() => setCurrentStep(2)}
        >
          Previous
        </Button>
        <Button
          type="submit"
          className="min-w-[7rem]"
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Next"}
        </Button>
      </div>
    </form>
  );
}