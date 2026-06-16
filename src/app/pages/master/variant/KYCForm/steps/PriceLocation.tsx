// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";

// Local Imports
import { Button, Input } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { PriceLocationSchema, PriceLocationType } from "../schema";

// ----------------------------------------------------------------------

// Options for select fields
const stateOptions = [
  { label: "Maharashtra", value: "maharashtra" },
  { label: "Gujarat", value: "gujarat" },
  { label: "Punjab", value: "punjab" },
  { label: "Haryana", value: "haryana" },
  { label: "Uttar Pradesh", value: "uttar_pradesh" },
  { label: "Rajasthan", value: "rajasthan" },
  { label: "Madhya Pradesh", value: "madhya_pradesh" },
  { label: "Bihar", value: "bihar" },
  { label: "West Bengal", value: "west_bengal" },
  { label: "Tamil Nadu", value: "tamil_nadu" },
];

const districtOptions = [
  { label: "Ahmedabad", value: "ahmedabad" },
  { label: "Surat", value: "surat" },
  { label: "Vadodara", value: "vadodara" },
  { label: "Rajkot", value: "rajkot" },
  { label: "Bhavnagar", value: "bhavnagar" },
];

const talukaOptions = [
  { label: "Taluka 1", value: "taluka1" },
  { label: "Taluka 2", value: "taluka2" },
  { label: "Taluka 3", value: "taluka3" },
];

export function PriceLocation({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<PriceLocationType>({
    resolver: yupResolver(PriceLocationSchema) as Resolver<PriceLocationType>,
    defaultValues: kycFormCtx.state.formData.PriceLocation,
  });

  const showTcs = watch("tcsApplicable");
  const showOfferPrice = watch("negotiable");

  const onSubmit = (data: PriceLocationType) => {
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { PriceLocation: { ...data } },
    });
    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { PriceLocation: { isDone: true } },
    });
    setCurrentStep(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-8">
        {/* Pricing Details Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Pricing Details</h3>
          <p className="mb-4 text-sm text-gray-500">
            Please enter pricing and finance information
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Ex-Showroom Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  {...register("exShowroomPrice")}
                  type="number"
                  placeholder="Enter price"
                  className="pl-8"
                  error={errors?.exShowroomPrice?.message}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                On-Road Price{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  {...register("onRoadPrice")}
                  type="number"
                  placeholder="Enter on-road price"
                  className="pl-8"
                  error={errors?.onRoadPrice?.message}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                {...register("currency")}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
              {errors?.currency && (
                <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">GST (%)</label>
              <Input
                {...register("gst")}
                type="number"
                placeholder="GST %"
                defaultValue="18"
                error={errors?.gst?.message}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                TCS Applicable
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("tcsApplicable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("tcsApplicable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {showTcs === "yes" && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  TCS (%) <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("tcsPercentage")}
                  type="number"
                  placeholder="Enter TCS %"
                  error={errors?.tcsPercentage?.message}
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Finance Available <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("financeAvailable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("financeAvailable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors?.financeAvailable && (
                <p className="mt-1 text-sm text-red-500">{errors.financeAvailable.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                EMI Available <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("emiAvailable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("emiAvailable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors?.emiAvailable && (
                <p className="mt-1 text-sm text-red-500">{errors.emiAvailable.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Down Payment{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  {...register("downPayment")}
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8"
                  error={errors?.downPayment?.message}
                />
              </div>
            </div>

            {showOfferPrice === "yes" && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Offer Price{" "}
                  <span className="text-xs text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    {...register("offerPrice")}
                    type="number"
                    placeholder="Enter offer price"
                    className="pl-8"
                    error={errors?.offerPrice?.message}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Negotiable
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("negotiable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("negotiable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Location Details</h3>
          <p className="mb-4 text-sm text-gray-500">
            Help buyers find your tractor easily
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                State <span className="text-red-500">*</span>
              </label>
              <select
                {...register("state")}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select State</option>
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                District <span className="text-red-500">*</span>
              </label>
              <select
                {...register("district")}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select District</option>
                {districtOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.district && (
                <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Taluka / Tehsil
              </label>
              <select
                {...register("taluka")}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select Taluka</option>
                {talukaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.taluka && (
                <p className="mt-1 text-sm text-red-500">{errors.taluka.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Village / City <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("city")}
                placeholder="Enter village / city"
                error={errors?.city?.message}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Pincode <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("pincode")}
                type="number"
                placeholder="Enter pincode"
                error={errors?.pincode?.message}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Landmark{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <Input
                {...register("landmark")}
                placeholder="Enter landmark"
                error={errors?.landmark?.message}
              />
            </div>
          </div>
        </div>

        {/* Full Address Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Full Address</h3>
          <p className="mb-4 text-sm text-gray-500">
            Enter full address of your location
          </p>
          <textarea
            {...register("fullAddress")}
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter complete address..."
          />
          {errors?.fullAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.fullAddress.message}</p>
          )}
        </div>

        {/* Map Location Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Map Location</h3>
          <p className="mb-4 text-sm text-gray-500">
            Drag the pin to exact location of your tractor
          </p>
          
          {/* Map placeholder - you can integrate Google Maps or any other mapping library here */}
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
            <p className="text-gray-500">Map integration will appear here</p>
          </div>
          
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">
              Search your location
            </label>
            <Input
              {...register("searchLocation")}
              placeholder="Search location..."
              error={errors?.searchLocation?.message}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outlined"
          className="min-w-[7rem]"
          onClick={() => setCurrentStep(3)}
        >
          Previous
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Save & Next
        </Button>
      </div>
    </form>
  );
}