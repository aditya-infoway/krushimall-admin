// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";

// Local Imports
import { Button, Input, Textarea } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { BasicInformationSchema, BasicInformationType } from "../schema";

// ----------------------------------------------------------------------

// Options for various select fields
const brandOptions = [
  { label: "John Deere", value: "john_deere" },
  { label: "Mahindra", value: "mahindra" },
  { label: "Massey Ferguson", value: "massey_ferguson" },
  { label: "New Holland", value: "new_holland" },
  { label: "Sonalika", value: "sonalika" },
  { label: "Escorts", value: "escorts" },
  { label: "Kubota", value: "kubota" },
  { label: "Swaraj", value: "swaraj" },
];

const modelOptions = [
  { label: "5050 D", value: "5050_d" },
  { label: "5055 D", value: "5055_d" },
  { label: "6060", value: "6060" },
  { label: "6075", value: "6075" },
  { label: "Arjun 605", value: "arjun_605" },
  { label: "Arjun Novo 605", value: "arjun_novo_605" },
  { label: "Yuvraj 215", value: "yuvraj_215" },
  { label: "Force 60", value: "force_60" },
];

const countryOptions = [
  { label: "India", value: "india" },
  { label: "USA", value: "usa" },
  { label: "Japan", value: "japan" },
  { label: "Germany", value: "germany" },
  { label: "China", value: "china" },
  { label: "Brazil", value: "brazil" },
];

const tractorStatusOptions = [
  { label: "Available", value: "available" },
  { label: "Sold", value: "sold" },
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
];

const colorOptions = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
];

const stockStatusOptions = [
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
  { label: "Limited Stock", value: "limited_stock" },
  { label: "Pre-order", value: "pre_order" },
];

export function BasicInformation({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(BasicInformationSchema) as Resolver<BasicInformationType>,
    defaultValues: kycFormCtx.state.formData.BasicInformation,
  });

  const showCustomColorInput = watch("showCustomColor");

  const onSubmit = (data: BasicInformationType) => {
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { BasicInformation: { ...data } },
    });
    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { BasicInformation: { isDone: true } },
    });
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-6">
        {/* Basic Information Section */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <select
              {...register("brandName")}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select Brand</option>
              {brandOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
           
             {errors?.brandName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.brandName.message}
                </p>
              )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Model Name <span className="text-red-500">*</span>
            </label>
            <select
              {...register("modelName")}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select Model</option>
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
           
             {errors?.modelName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.modelName.message}
                </p>
              )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register("productCode")}
            label="Product Code"
            placeholder="Enter product code"
            error={errors?.productCode?.message}
          />

          <Input
            {...register("skuCode")}
            label="SKU Code"
            placeholder="Enter SKU code"
            error={errors?.skuCode?.message}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Country of Origin
            </label>
            <select
              {...register("countryOfOrigin")}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select Country</option>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
           
             {errors?.countryOfOrigin && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.countryOfOrigin.message}
                </p>
              )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Tractor Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("tractorStatus")}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select Status</option>
              {tractorStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
         
             {errors?.tractorStatus && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.tractorStatus.message}
                </p>
              )}
          </div>
        </div>

        {/* Short Description */}
        <Textarea
          {...register("shortDescription")}
          label="Short Description"
          placeholder="Write short description about this tractor (Max 200 characters)"
          maxLength={200}
          rows={3}
          error={errors?.shortDescription?.message}
          // helperText="Max 200 characters"
        />

        {/* Key Highlights Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Key Highlights</h3>
          <p className="mb-4 text-sm text-gray-500">
            Add key highlights about this tractor
          </p>

          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="mb-3">
              <Input
                // {...register(`highlights.highlight${index}`)}
                label={`Highlight ${index}`}
                placeholder="Enter highlight"
                // error={errors?.highlights?.[`highlight${index}`]?.message}
              />
            </div>
          ))}

          <Button type="button"  className="mt-2">
            + Add Another Highlight
          </Button>
        </div>

        {/* Available Colors Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Available Colors</h3>
          <p className="mb-4 text-sm text-gray-500">
            Select available colors for this tractor
          </p>

          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <label key={color.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  // {...register(`colors.${color.value}`)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span
                  className="flex h-6 w-6 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.label}</span>
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("colors.custom")}
                onChange={(e) => {
                  setValue("showCustomColor", e.target.checked);
                  register("colors.custom").onChange(e);
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Custom</span>
            </label>
          </div>

          {showCustomColorInput && (
            <div className="mt-3">
              <Input
                {...register("customColorName")}
                label="Custom Color Name"
                placeholder="Enter custom color name (if any)"
                error={errors?.customColorName?.message}
              />
            </div>
          )}
        </div>

        {/* Dealer Availability Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">Dealer Availability</h3>
          <p className="mb-4 text-sm text-gray-500">
            Select where this tractor is available
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Available States <span className="text-red-500">*</span>
              </label>
              <select
                {...register("availableStates")}
                multiple
                className="w-full rounded-lg border border-gray-300 p-2.5"
                size={4}
              >
                <option value="california">California</option>
                <option value="texas">Texas</option>
                <option value="new_york">New York</option>
                <option value="florida">Florida</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple
              </p>
            
               {errors?.availableStates && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.availableStates.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Available Districts <span className="text-red-500">*</span>
              </label>
              <select
                {...register("availableDistricts")}
                multiple
                className="w-full rounded-lg border border-gray-300 p-2.5"
                size={4}
              >
                <option value="district1">District 1</option>
                <option value="district2">District 2</option>
                <option value="district3">District 3</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple
              </p>
             
               {errors?.availableDistricts && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.availableDistricts.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Available Dealers <span className="text-red-500">*</span>
              </label>
              <select
                {...register("availableDealers")}
                multiple
                className="w-full rounded-lg border border-gray-300 p-2.5"
                size={4}
              >
                <option value="dealer1">Dealer 1</option>
                <option value="dealer2">Dealer 2</option>
                <option value="dealer3">Dealer 3</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple
              </p>
            
               {errors?.availableDealers && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.availableDealers.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Stock Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("stockStatus")}
                className="w-full rounded-lg border border-gray-300 p-2.5"
              >
                <option value="">Select Stock Status</option>
                {stockStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {errors?.stockStatus && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stockStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SEO Details Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 text-lg font-semibold">SEO Details</h3>

          <div className="space-y-4">
            <Input
              {...register("seoTitle")}
              label="SEO Title"
              placeholder="Enter SEO title"
              error={errors?.seoTitle?.message}
            />

            <div>
              <Input
                {...register("seoUrl")}
                label="SEO URL"
                placeholder="Enter SEO URL"
                error={errors?.seoUrl?.message}
              />
              <p className="mt-1 text-xs text-gray-400">
                This will be used in the website URL
              </p>
            </div>

            <div>
              <TextArea
                {...register("metaDescription")}
                label="Meta Description"
                placeholder="Enter meta description"
                maxLength={160}
                rows={2}
                error={errors?.metaDescription?.message}
              />
              <p className="mt-1 text-xs text-gray-400">Max 160 characters</p>
            </div>

            <div>
              <Input
                {...register("keywords")}
                label="Keywords"
                placeholder="Enter keywords"
                error={errors?.keywords?.message}
              />
              <p className="mt-1 text-xs text-gray-400">
                Comma separated keywords
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <Button type="button"  className="min-w-[7rem]">
          Cancel
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Save & Next
        </Button>
      </div>
    </form>
  );
}