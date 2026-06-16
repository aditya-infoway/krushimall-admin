// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useState } from "react";
// Local Imports
import { Button, Input, Textarea } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { BasicInformationSchema, BasicInformationType } from "../schema";
import { Listbox } from "@/components/shared/form/StyledListbox";
// ----------------------------------------------------------------------
import { DatePicker } from "@/components/shared/form/Datepicker";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
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
const variantOptions = [
  { label: "Base Variant", value: "base_variant" },
  { label: "Standard Variant", value: "standard_variant" },
  { label: "Premium Variant", value: "premium_variant" },
];

const tractorCategoryOptions = [
  { label: "Mini Tractor", value: "mini_tractor" },
  { label: "Utility Tractor", value: "utility_tractor" },
  { label: "Row Crop Tractor", value: "row_crop_tractor" },
  { label: "Orchard Tractor", value: "orchard_tractor" },
  { label: "Heavy Duty Tractor", value: "heavy_duty_tractor" },
];
const dealerOptions = [
  { label: "Dealer 1", value: "dealer1" },
  { label: "Dealer 2", value: "dealer2" },
  { label: "Dealer 3", value: "dealer3" },
];
const modelYearOptions = Array.from({ length: 20 }, (_, i) => {
  const year = new Date().getFullYear() - i;

  return {
    label: year.toString(),
    value: year.toString(),
  };
});

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
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(
      BasicInformationSchema,
    ) as Resolver<BasicInformationType>,
    defaultValues: kycFormCtx.state.formData.BasicInformation,
  });
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateCode, setStateCode] = useState("");
  const showCustomColorInput = watch("showCustomColor");
  const [highlightCount, setHighlightCount] = useState(5);
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
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));
  const stateOptions = State.getStatesOfCountry(country).map((state) => ({
    value: state.isoCode,
    label: state.name,
    state,
  }));
  const cityOptions = City.getCitiesOfState(country, state).map((city) => ({
    value: city.name,
    label: city.name,
  }));
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: state.isFocused
        ? "var(--color-primary-600)"
        : "var(--color-gray-300)",
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--color-primary-600)"
        : "none",
      minHeight: "42px",

      "&:hover": {
        borderColor: "var(--color-primary-500)",
      },
    }),

    valueContainer: (provided: any) => ({
      ...provided,
      color: "var(--color-dark-100)",
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--color-dark-100)",
    }),

    input: (provided: any) => ({
      ...provided,
      color: "var(--color-dark-100)",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--color-gray-400)",
    }),

    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--color-dark-700)",
      border: "1px solid var(--color-primary-600)",
      borderRadius: "12px",
      overflow: "hidden",
    }),

    menuList: (provided: any) => ({
      ...provided,
      padding: 0,
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--color-primary-600)"
        : state.isFocused
          ? "var(--color-primary-500)"
          : "var(--color-dark-700)",
      color: "#fff",
      cursor: "pointer",
    }),

    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused
        ? "var(--color-primary-600)"
        : "var(--color-gray-400)",
    }),

    clearIndicator: (provided: any) => ({
      ...provided,
      color: "var(--color-gray-400)",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Controller
              name="brandName"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={brandOptions}
                  value={
                    brandOptions.find((item) => item.value === field.value) ||
                    null
                  }
                  onChange={(option: any) => field.onChange(option?.value)}
                  displayField="label"
                  placeholder="Select Brand"
                  label="Brand Name"
                />
              )}
            />

            {errors?.brandName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.brandName.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="modelName"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={modelOptions}
                  value={
                    modelOptions.find((item) => item.value === field.value) ||
                    null
                  }
                  onChange={(option: any) => field.onChange(option?.value)}
                  displayField="label"
                  placeholder="Select Model"
                  label="Model Name"
                />
              )}
            />

            {errors?.modelName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.modelName.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              name="variantName"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={variantOptions}
                  value={
                    variantOptions.find((item) => item.value === field.value) ||
                    null
                  }
                  onChange={(option: any) => field.onChange(option?.value)}
                  displayField="label"
                  placeholder="Select Variant"
                  label="Variant Name"
                />
              )}
            />
            {errors?.variantName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.variantName.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              name="tractorCategory"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={tractorCategoryOptions}
                  value={
                    tractorCategoryOptions.find(
                      (item) => item.value === field.value,
                    ) || null
                  }
                  onChange={(option: any) => field.onChange(option?.value)}
                  displayField="label"
                  placeholder="Select Category"
                  label="Tractor Category"
                />
              )}
            />
            {errors?.tractorCategory && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tractorCategory.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Controller
  name="launchYear"
  control={control}
  render={({ field: { onChange, value, ...rest } }) => (
    <DatePicker
      value={value || ""}
      onChange={(date: any) => {
        if (!date) {
          onChange("");
          return;
        }

        const selectedDate = new Date(date);

        if (isNaN(selectedDate.getTime())) {
          onChange("");
          return;
        }

        onChange(
          selectedDate.toISOString().split("T")[0]
        );
      }}
      label="Launch Year"
      error={errors?.launchYear?.message}
      options={{ disableMobile: true }}
      placeholder="Select launch date..."
      {...rest}
    />
  )}
/>
          <Controller
            name="modelYear"
            control={control}
            render={({ field }) => (
              <Listbox
                data={modelYearOptions}
                value={
                  modelYearOptions.find((item) => item.value === field.value) ||
                  null
                }
                onChange={(option: any) => field.onChange(option?.value)}
                displayField="label"
                placeholder="Select Year"
                label="Model Year"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 inline-block">Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  options={countryOptions}
                    classNamePrefix="react-select"
                  styles={customSelectStyles}
                  placeholder="Search Country"
                  value={
                    countryOptions.find(
                      (option) => option.value === field.value,
                    ) || null
                  }
                  onChange={(selected) => {
                    field.onChange(selected?.value || "");
                    setCountry(selected?.value || "");
                    setState("");
                    setCity("");
                  }}
                />
              )}
            />
            {errors.country && (
              <p className="text-error dark:text-error-lighter mt-1 text-xs">
                {errors.country.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              name="tractorStatus"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={tractorStatusOptions}
                  value={
                    tractorStatusOptions.find(
                      (item) => item.value === field.value,
                    ) || null
                  }
                  onChange={(option: any) => field.onChange(option?.value)}
                  displayField="label"
                  placeholder="Select Status"
                  label="Tractor Status"
                />
              )}
            />

            {errors?.tractorStatus && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tractorStatus.message}
              </p>
            )}
          </div>
          <Controller
            name="stockStatus"
            control={control}
            render={({ field }) => (
              <Listbox
                data={stockStatusOptions}
                value={
                  stockStatusOptions.find(
                    (item) => item.value === field.value,
                  ) || null
                }
                onChange={(option: any) => field.onChange(option?.value)}
                displayField="label"
                placeholder="Select Stock Status"
                label="Stock Status"
              />
            )}
          />
        </div>

        {/* Short Description */}
        <div className="border-y border-gray-500 py-8">
          <Textarea
            {...register("shortDescription")}
            label="Short Description"
            placeholder="Write short description about this tractor (Max 200 characters)"
            maxLength={200}
            rows={3}
            error={errors?.shortDescription?.message}
            helperText="Max 200 characters"
          />
        </div>

        {/* Key Highlights Section */}
        <div className="border-y border-gray-500 py-8">
          <h3 className="mb-2 text-lg font-semibold text-gray-500">
            Key Highlights
          </h3>

          <p className="mb-6 text-sm text-gray-500">
            Add key highlights about this tractor
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: highlightCount }, (_, index) => (
              <Input
                key={index}
                {...register(`highlights.highlight${index + 1}` as const)}
                label={`Highlight ${index + 1}`}
                placeholder="Enter highlight"
              />
            ))}
          </div>

          <Button
            type="button"
            className="mt-4"
            onClick={() => setHighlightCount((prev) => prev + 1)}
          >
            + Add Another Highlight
          </Button>
        </div>

        {/* Available Colors Section */}
        <div className="border-y border-gray-500 py-8">
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
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                {...register("customColorName")}
                label="Custom Color Name"
                placeholder="Enter custom color name"
                error={errors?.customColorName?.message}
              />

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Custom Color
                </label>

                <input
                  type="color"
                  {...register("customColorCode")}
                  className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Dealer Availability Section */}
        <div className="">
          <h3 className="mb-4 text-lg font-semibold">Dealer Availability</h3>
          <p className="mb-4 text-sm text-gray-500">
            Select where this tractor is available
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Available States <span className="text-red-500">*</span>
              </label>
             <Controller
  name="availableStates"
  control={control}
  render={({ field }) => (
    <Select
      options={stateOptions}
      isMulti
      styles={customSelectStyles}
      placeholder="Search State"
      isDisabled={!country}
      value={stateOptions.filter((option) =>
        field.value?.includes(option.value)
      )}
      onChange={(selected: any) => {
        field.onChange(
          selected?.map((item: any) => item.value) || []
        );
      }}
    />
  )}
/>

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
             <Controller
  name="availableDistricts"
  control={control}
  render={({ field }) => (
    <Select
      options={cityOptions}
      isMulti
      styles={customSelectStyles}
      placeholder="Search District"
      isDisabled={!state}
      value={cityOptions.filter((option) =>
        field.value?.includes(option.value)
      )}
      onChange={(selected: any) => {
        field.onChange(
          selected?.map((item: any) => item.value) || []
        );
      }}
    />
  )}
/>
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
                {" "}
                Available Dealers <span className="text-red-500">*</span>{" "}
              </label>
              <Controller
                name="availableDealers"
                control={control}
                render={({ field }) => (
                  <Select
                    options={dealerOptions}
                    
                    isMulti
                    styles={customSelectStyles}
                    placeholder="Search Dealers"
                    value={dealerOptions.filter((option) =>
                      field.value?.includes(option.value),
                    )}
                    onChange={(selected: any) => {
                      field.onChange(
                        selected?.map((item: any) => item.value) || [],
                      );
                    }}
                  />
                )}
              />
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
              <Controller
                name="stockStatus"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={stockStatusOptions}
                    value={
                      stockStatusOptions.find(
                        (item) => item.value === field.value,
                      ) || null
                    }
                    onChange={(option: any) => field.onChange(option?.value)}
                    displayField="label"
                    placeholder="Select Stock Status"
                    label="Stock Status"
                  />
                )}
              />
              {errors?.stockStatus && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stockStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SEO Details Section */}
        <div className="border-y border-gray-500 py-8">
          <h3 className="mb-4 text-lg font-semibold">SEO Details</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
              <Textarea
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
        <Button type="button" className="min-w-[7rem]">
          Cancel
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Save & Next
        </Button>
      </div>
    </form>
  );
}
