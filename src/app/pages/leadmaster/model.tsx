import { useState, useRef, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Combobox } from "@/components/shared/form/StyledCombobox";
import { Checkbox } from "@/components/ui/Form/Checkbox";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui";
import { DatePicker } from "@/components/shared/form/Datepicker";
import { Timepicker } from "@/components/shared/form/Timepicker";
import { Country, State, City } from "country-state-city";
import { useMemo } from "react";
import { Textarea } from "@/components/ui";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";

// ─── Types ──────────────────────────────────────────────────────────────────
interface AccountForm {
  accountName: string;
  mobile: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  district: string;
  city: string;
  address: string;
  panCard: string;
  aadharCard: string;
}

interface FinanceType {
  existingCustomerModel: string;
  existingCustomerVariant: string;
  existingVehicleYear: string;
  customerExpectedPrice: string;
  marketPrice: string;
  exchangeBonus: string;
  smiplShares: string;
  dealerShares: string;
  valueAddAccessories?: string;
  insurance?: string;
  totalValue?: string;
}

interface ReviewSummaryType {
  expectedPurchaseDate: string;
  expectedDeliveryDate: string;
  expectedDeliveryTime: string;
  purchaseType: string;
  profession: string;
  enquiryType: string;
  enquirySource: string;
  bookingDate: string;
  customerRating: string;
  followUpDate: string;
  enquiryStatus: string;
  dmsEnquiryNo: string;
  dmsEnquiryDate: string;
  otherModel: string;
  competitorTestRide: string;
  salesManagerRemarks: string;
  dealerRemarks: string;
  exWarranty23: boolean;
  exWarranty28: boolean;
  advancePayment: boolean;
  listOfBooking: string;
  paymentMode: "CASH" | "BANK" | "";
  bankMode: "NEFT" | "RTGS" | "IMPS" | "CHEQUE" | "UPI" | "";
  selectAccount: string;
  narration: string;
  chequeNo: string;
  chequeDate: string;
  chequeClearDate: string;
}

interface OptionType {
  id: number;
  name: string;
}

// Helper function to format date as dd-mm-yyyy
const formatDateToDDMMYYYY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to get today's date in dd-mm-yyyy format
const getTodayDate = () => {
  return formatDateToDDMMYYYY(new Date());
};

// ─── Create Account Modal ──────────────────────────────────────────────────
function CreateAccountModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountForm) => void;
}) {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  // ─── React Hook Form ─────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountForm>({
    defaultValues: {
      accountName: "",
      mobile: "",
      countryCode: "",
      countryName: "",
      stateCode: "",
      stateName: "",
      district: "",
      city: "",
      address: "",
      panCard: "",
      aadharCard: "",
    },
    // ✅ Add validation rules here
    resolver: (values) => {
      const errors: Record<string, { type: string; message: string }> = {};

      if (!values.accountName?.trim())
        errors.accountName = {
          type: "required",
          message: "Account Name is required",
        };
      if (!values.mobile?.trim())
        errors.mobile = { type: "required", message: "Mobile is required" };
      if (!values.countryCode)
        errors.countryCode = {
          type: "required",
          message: "Country is required",
        };
      if (!values.stateCode)
        errors.stateCode = { type: "required", message: "State is required" };
      if (!values.district)
        errors.district = { type: "required", message: "District is required" };
      if (!values.city)
        errors.city = { type: "required", message: "City is required" };
      if (!values.address?.trim())
        errors.address = { type: "required", message: "Address is required" };
      if (!values.panCard?.trim())
        errors.panCard = { type: "required", message: "PAN Card is required" };
      if (!values.aadharCard?.trim())
        errors.aadharCard = {
          type: "required",
          message: "Aadhar Card is required",
        };

      return {
        values: Object.keys(errors).length === 0 ? values : {},
        errors,
      };
    },
  });
  // ─── Watch values ────────────────────────────────────────────────────────
  const countryCode = watch("countryCode");
  const stateCode = watch("stateCode");

  // ─── react-select custom styles ──────────────────────────────────────────
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

  // ─── Country, State, City Data ──────────────────────────────────────────
  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
  }, []);

  const stateOptions = useMemo(() => {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [countryCode]);

  const cityOptions = useMemo(() => {
    if (!countryCode || !stateCode) return [];
    return City.getCitiesOfState(countryCode, stateCode).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [countryCode, stateCode]);

  const handleFormSubmit = (data: AccountForm) => {
    onSubmit(data);
    onClose();
  };

  const inputClass = (field: string, hasError?: boolean) =>
    `border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 ${
      hasError ? "border-orange-500 dark:border-orange-500" : "border-gray-300"
    }`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[60]">
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60"
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <DialogPanel className="dark:bg-dark-700 flex h-full w-screen max-w-3xl flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="dark:bg-dark-600 flex items-center justify-between bg-blue-700 px-4 py-3">
            <DialogTitle className="dark:text-dark-50 font-semibold text-white">
              Create Account
            </DialogTitle>
            <button
              onClick={onClose}
              className="dark:text-dark-200 text-white/80 hover:text-white dark:hover:text-white"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-1 overflow-y-auto p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Account Name */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="accountName"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter Account Name"
                      value={field.value}
                      onChange={field.onChange}
                      className={inputClass(
                        "accountName",
                        !!errors.accountName,
                      )}
                    />
                  )}
                />
                {errors.accountName && (
                  <span className="text-xs text-orange-500">
                    {errors.accountName.message}
                  </span>
                )}
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Mobile"
                      value={field.value}
                      onChange={field.onChange}
                      className={inputClass("mobile", !!errors.mobile)}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-xs text-orange-500">
                    {errors.mobile.message}
                  </span>
                )}
              </div>

              {/* Country */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={countryOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search Country"
                      value={
                        countryOptions.find(
                          (option) => option.value === field.value,
                        ) || null
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                        setCountry(selected?.value || "");
                        setValue("stateCode", "");
                        setValue("stateName", "");
                        setValue("district", "");
                        setValue("city", "");
                      }}
                    />
                  )}
                />
                {errors.countryCode && (
                  <span className="text-xs text-orange-500">
                    {errors.countryCode.message}
                  </span>
                )}
              </div>

              {/* State */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="stateCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={stateOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search State"
                      isDisabled={!countryCode}
                      value={
                        stateOptions.find(
                          (option) => option.value === field.value,
                        ) || null
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                        setState(selected?.value || "");
                        setValue("district", "");
                        setValue("city", "");
                      }}
                    />
                  )}
                />
                {errors.stateCode && (
                  <span className="text-xs text-orange-500">
                    {errors.stateCode.message}
                  </span>
                )}
              </div>

              {/* State Code (auto-filled, read-only) */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  State Code
                </label>
                <Controller
                  name="stateCode"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Auto-filled"
                      value={field.value}
                      readOnly
                      className={
                        inputClass("stateCode") +
                        " cursor-not-allowed bg-gray-50"
                      }
                    />
                  )}
                />
              </div>

              {/* District */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  District <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={cityOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search District"
                      isDisabled={!stateCode}
                      value={
                        cityOptions.find(
                          (option) => option.value === field.value,
                        ) || null
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                      }}
                    />
                  )}
                />
                {errors.district && (
                  <span className="text-xs text-orange-500">
                    {errors.district.message}
                  </span>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={cityOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search City"
                      isDisabled={!stateCode}
                      value={
                        cityOptions.find(
                          (option) => option.value === field.value,
                        ) || null
                      }
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                      }}
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-xs text-orange-500">
                    {errors.city.message}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter Address"
                      value={field.value}
                      onChange={field.onChange}
                      className={inputClass("address", !!errors.address)}
                    />
                  )}
                />
                {errors.address && (
                  <span className="text-xs text-orange-500">
                    {errors.address.message}
                  </span>
                )}
              </div>

              {/* PAN Card */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  PAN Card <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="panCard"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="PAN Card Number"
                      value={field.value}
                      onChange={field.onChange}
                      className={inputClass("panCard", !!errors.panCard)}
                    />
                  )}
                />
                {errors.panCard && (
                  <span className="text-xs text-orange-500">
                    {errors.panCard.message}
                  </span>
                )}
              </div>

              {/* Aadhar Card */}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Aadhar Card No <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="aadharCard"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Aadhar Number"
                      value={field.value}
                      onChange={field.onChange}
                      className={inputClass("aadharCard", !!errors.aadharCard)}
                    />
                  )}
                />
                {errors.aadharCard && (
                  <span className="text-xs text-orange-500">
                    {errors.aadharCard.message}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
          </form>
          <div className="dark:border-dark-500 mt-6 flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-600 rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Create Account
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
// ─── Step 3: Lead Info ──────────────────────────────────────────────────────
// ─── Step 3: Lead Info ──────────────────────────────────────────────────────
function LeadInfoStep({
  onValidationChange,
}: {
  onValidationChange: (fn: () => boolean) => void;
}) {
  const [wantsFinance, setWantsFinance] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [finance, setFinance] = useState<FinanceType>({
    existingCustomerModel: "",
    existingCustomerVariant: "",
    existingVehicleYear: "",
    customerExpectedPrice: "",
    marketPrice: "",
    exchangeBonus: "",
    smiplShares: "",
    dealerShares: "",
    valueAddAccessories: "",
    insurance: "",
    totalValue: "0",
  });

  const handleFinance = (field: keyof FinanceType, value: any) => {
    setFinance((p) => ({ ...p, [field]: value }));
    const errorKey = `finance_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (wantsFinance) {
      if (!finance.existingCustomerModel?.trim())
        newErrors.finance_existingCustomerModel =
          "Existing Customer Model is required";
      if (!finance.existingCustomerVariant?.trim())
        newErrors.finance_existingCustomerVariant =
          "Existing Customer Variant is required";
      if (!finance.existingVehicleYear?.trim())
        newErrors.finance_existingVehicleYear =
          "Existing Vehicle Year is required";
      if (!finance.customerExpectedPrice?.trim())
        newErrors.finance_customerExpectedPrice =
          "Customer Expected Price is required";
      if (!finance.marketPrice?.trim())
        newErrors.finance_marketPrice = "Market Price is required";
      if (!finance.exchangeBonus?.trim())
        newErrors.finance_exchangeBonus = "Exchange Bonus is required";
      if (!finance.smiplShares?.trim())
        newErrors.finance_smiplShares = "SMIPL Shares is required";
      if (!finance.dealerShares?.trim())
        newErrors.finance_dealerShares = "Dealer Shares is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    onValidationChange(validate);
  }, [wantsFinance, finance]);

  const inputClass = (field: string) =>
    `border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 ${
      errors[field]
        ? "border-orange-500 dark:border-orange-500"
        : "border-gray-300"
    }`;

  return (
    <div className="space-y-4">
      {/* Single Checkbox */}
      {/* Single Checkbox - Make the entire label clickable */}
      <label className="flex cursor-pointer items-center gap-1.5">
        <Checkbox
          checked={wantsFinance}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWantsFinance(e.target.checked)
          }
        />
        <span className="dark:text-dark-200 text-sm text-gray-700 select-none">
          Change Current Vehicle?
        </span>
      </label>

      {/* Change Current Vehicle? - Only show when checkbox is checked */}
      {wantsFinance && (
        <div className="dark:border-dark-600 dark:bg-dark-800 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Existing Customer Model */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Existing Customer Model
              </label>
              <input
                type="text"
                placeholder="Enter Existing Customer Model"
                value={finance.existingCustomerModel}
                onChange={(e) =>
                  handleFinance("existingCustomerModel", e.target.value)
                }
                className={inputClass(`finance_existingCustomerModel`)}
              />
              {errors.finance_existingCustomerModel && (
                <span className="text-xs text-orange-500">
                  {errors.finance_existingCustomerModel}
                </span>
              )}
            </div>

            {/* Existing Customer Variant */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Existing Customer Variant
              </label>
              <input
                type="text"
                placeholder="Enter Existing Customer Variant"
                value={finance.existingCustomerVariant}
                onChange={(e) =>
                  handleFinance("existingCustomerVariant", e.target.value)
                }
                className={inputClass(`finance_existingCustomerVariant`)}
              />
              {errors.finance_existingCustomerVariant && (
                <span className="text-xs text-orange-500">
                  {errors.finance_existingCustomerVariant}
                </span>
              )}
            </div>
            {/* Existing Vehicle Year */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Existing Vehicle Year
              </label>
              <input
                type="text"
                placeholder="Enter Vehicle Year"
                value={finance.existingVehicleYear}
                onChange={(e) =>
                  handleFinance("existingVehicleYear", e.target.value)
                }
                className={inputClass(`finance_existingVehicleYear`)}
              />
              {errors.finance_existingVehicleYear && (
                <span className="text-xs text-orange-500">
                  {errors.finance_existingVehicleYear}
                </span>
              )}
            </div>

            {/* Customer Expected Price */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Customer Expected Price
              </label>
              <input
                type="text"
                placeholder="Enter Expected Price"
                value={finance.customerExpectedPrice}
                onChange={(e) =>
                  handleFinance("customerExpectedPrice", e.target.value)
                }
                className={inputClass(`finance_customerExpectedPrice`)}
              />
              {errors.finance_customerExpectedPrice && (
                <span className="text-xs text-orange-500">
                  {errors.finance_customerExpectedPrice}
                </span>
              )}
            </div>

            {/* Market Price */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Market Price
              </label>
              <input
                type="text"
                placeholder="Enter Market Price"
                value={finance.marketPrice}
                onChange={(e) => handleFinance("marketPrice", e.target.value)}
                className={inputClass(`finance_marketPrice`)}
              />
              {errors.finance_marketPrice && (
                <span className="text-xs text-orange-500">
                  {errors.finance_marketPrice}
                </span>
              )}
            </div>

            {/* Exchange Bonus */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Exchange Bonus
              </label>
              <input
                type="text"
                placeholder="0"
                value={finance.exchangeBonus}
                onChange={(e) => handleFinance("exchangeBonus", e.target.value)}
                className={inputClass(`finance_exchangeBonus`)}
              />
              {errors.finance_exchangeBonus && (
                <span className="text-xs text-orange-500">
                  {errors.finance_exchangeBonus}
                </span>
              )}
            </div>

            {/* SMIPL Shares */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                SMIPL Shares
              </label>
              <input
                type="text"
                placeholder="0"
                value={finance.smiplShares}
                onChange={(e) => handleFinance("smiplShares", e.target.value)}
                className={inputClass(`finance_smiplShares`)}
              />
              {errors.finance_smiplShares && (
                <span className="text-xs text-orange-500">
                  {errors.finance_smiplShares}
                </span>
              )}
            </div>

            {/* Dealer Shares */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Dealer Shares
              </label>
              <input
                type="text"
                placeholder="0"
                value={finance.dealerShares}
                onChange={(e) => handleFinance("dealerShares", e.target.value)}
                className={inputClass(`finance_dealerShares`)}
              />
              {errors.finance_dealerShares && (
                <span className="text-xs text-orange-500">
                  {errors.finance_dealerShares}
                </span>
              )}
            </div>

            {/* Value Add Accessories */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Value Add Accessories
              </label>
              <input
                type="text"
                placeholder="Enter Value Add Accessories"
                value={finance.valueAddAccessories || ""}
                onChange={(e) =>
                  handleFinance("valueAddAccessories", e.target.value)
                }
                className={inputClass(`finance_valueAddAccessories`)}
              />
            </div>

            {/* Insurance */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Insurance
              </label>
              <input
                type="text"
                placeholder="Enter Insurance"
                value={finance.insurance || ""}
                onChange={(e) => handleFinance("insurance", e.target.value)}
                className={inputClass(`finance_insurance`)}
              />
            </div>

            {/* Total Value - Full width */}
            <div className="col-span-1 flex flex-col gap-1 sm:col-span-2">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Total Value
              </label>
              <input
                type="text"
                placeholder="0"
                value={finance.totalValue || "0"}
                onChange={(e) => handleFinance("totalValue", e.target.value)}
                className={inputClass(`finance_totalValue`) + " max-w-xs"}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Review Lead Summary Step ──────────────────────────────────────────────
function ReviewLeadSummaryStep({
  onValidationChange,
}: {
  onValidationChange: (fn: () => boolean) => void;
}) {
  const [form, setForm] = useState<ReviewSummaryType>({
    expectedPurchaseDate: getTodayDate(), // ✅ Default to today in dd-mm-yyyy
    expectedDeliveryDate: "",
    expectedDeliveryTime: "",
    purchaseType: "",
    profession: "",
    enquiryType: "",
    enquirySource: "",
    bookingDate: "",
    customerRating: "",
    followUpDate: "",
    enquiryStatus: "",
    dmsEnquiryNo: "",
    dmsEnquiryDate: "",
    otherModel: "",
    competitorTestRide: "",
    salesManagerRemarks: "",
    dealerRemarks: "",
    exWarranty23: false,
    exWarranty28: false,
    advancePayment: false,
    listOfBooking: "",
    paymentMode: "",
    bankMode: "",
    selectAccount: "",
    narration: "",
    chequeNo: "",
    chequeDate: "",
    chequeClearDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ReviewSummaryType, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.expectedPurchaseDate)
      newErrors.expectedPurchaseDate = "Expected Purchase Date is required";
    if (!form.expectedDeliveryDate)
      newErrors.expectedDeliveryDate = "Expected Delivery Date is required";
    if (!form.expectedDeliveryTime)
      newErrors.expectedDeliveryTime = "Expected Delivery Time is required";
    if (!form.purchaseType)
      newErrors.purchaseType = "Purchase Type is required";
    if (!form.profession) newErrors.profession = "Profession is required";
    if (!form.enquiryType) newErrors.enquiryType = "Enquiry Type is required";
    if (!form.enquirySource)
      newErrors.enquirySource = "Enquiry Source is required";
    if (!form.bookingDate) newErrors.bookingDate = "Booking Date is required";
    if (!form.customerRating)
      newErrors.customerRating = "Customer Rating is required";
    if (!form.followUpDate)
      newErrors.followUpDate = "Follow Up Date is required";
    if (!form.enquiryStatus)
      newErrors.enquiryStatus = "Enquiry Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    onValidationChange(validate);
  }, [form]);

  const inputClass = (field: string) =>
    `border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 ${
      errors[field]
        ? "border-orange-500 dark:border-orange-500"
        : "border-gray-300"
    }`;

  // Options for dropdowns
  const purchaseTypeOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Finance", value: "Finance" },
    { label: "Exchange", value: "Exchange" },
  ];

  const professionOptions = [
    { label: "Salaried", value: "Salaried" },
    { label: "Self Employed", value: "Self Employed" },
    { label: "Business", value: "Business" },
    { label: "Student", value: "Student" },
  ];

  const enquiryTypeOptions = [
    { label: "General", value: "General" },
    { label: "Sales", value: "Sales" },
    { label: "Support", value: "Support" },
  ];

  const enquirySourceOptions = [
    { label: "Website", value: "Website" },
    { label: "Phone Call", value: "Phone Call" },
    { label: "Walk-in", value: "Walk-in" },
    { label: "Social Media", value: "Social Media" },
  ];

  const enquiryStatusOptions = [
    { label: "New", value: "New" },
    { label: "In Progress", value: "In Progress" },
    { label: "Converted", value: "Converted" },
    { label: "Lost", value: "Lost" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="dark:text-dark-50 text-lg font-bold text-gray-800">
        Review Lead Summary
      </h3>

      {/* Top 3-Column Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Expected Purchase Date - Only ONE instance */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Expected Purchase Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={form.expectedPurchaseDate}
            onChange={(val) => handleChange("expectedPurchaseDate", val)}
            placeholder="DD-MM-YYYY"
            options={{
              dateFormat: "d-m-Y", // ← This is the key fix! Flatpickr format for dd-mm-yyyy
            }}
          />
          {errors.expectedPurchaseDate && (
            <span className="text-xs text-orange-500">
              {errors.expectedPurchaseDate}
            </span>
          )}
        </div>

        {/* Expected Delivery Date */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Expected Delivery Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={form.expectedDeliveryDate}
            onChange={(val) => handleChange("expectedDeliveryDate", val)}
            placeholder="DD-MM-YYYY"
            options={{
              dateFormat: "d-m-Y", // ← Fix here too
            }}
          />
          {errors.expectedDeliveryDate && (
            <span className="text-xs text-orange-500">
              {errors.expectedDeliveryDate}
            </span>
          )}
        </div>

        {/* Expected Delivery Time */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Expected Delivery Time <span className="text-red-500">*</span>
          </label>
          <Timepicker
            value={form.expectedDeliveryTime}
            onChange={(val) => handleChange("expectedDeliveryTime", val)}
            placeholder="Select time"
          />
          {errors.expectedDeliveryTime && (
            <span className="text-xs text-orange-500">
              {errors.expectedDeliveryTime}
            </span>
          )}
        </div>

        {/* Purchase Type */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Purchase Type <span className="text-red-500">*</span>
          </label>
          <Combobox
            data={purchaseTypeOptions}
            displayField="label"
            value={
              form.purchaseType
                ? { label: form.purchaseType, value: form.purchaseType }
                : null
            }
onChange={(val: { label: string; value: string } | null) => 
  handleChange("purchaseType", val?.value || "")
}
            placeholder="Select Purchase Type"
          />
          {errors.purchaseType && (
            <span className="text-xs text-orange-500">
              {errors.purchaseType}
            </span>
          )}
        </div>

        {/* Profession */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Profession <span className="text-red-500">*</span>
          </label>
          <Combobox
            data={professionOptions}
            displayField="label"
            value={
              form.profession
                ? { label: form.profession, value: form.profession }
                : null
            }
            onChange={(val) => handleChange("profession", val?.value || "")}
            placeholder="Select Profession"
          />
          {errors.profession && (
            <span className="text-xs text-orange-500">{errors.profession}</span>
          )}
        </div>

        {/* Enquiry Type */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Enquiry Type <span className="text-red-500">*</span>
          </label>
          <Combobox
            data={enquiryTypeOptions}
            displayField="label"
            value={
              form.enquiryType
                ? { label: form.enquiryType, value: form.enquiryType }
                : null
            }
            onChange={(val) => handleChange("enquiryType", val?.value || "")}
            placeholder="Select Enquiry Type"
          />
          {errors.enquiryType && (
            <span className="text-xs text-orange-500">
              {errors.enquiryType}
            </span>
          )}
        </div>

        {/* Enquiry Source */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Enquiry Source <span className="text-red-500">*</span>
          </label>
          <Combobox
            data={enquirySourceOptions}
            displayField="label"
            value={
              form.enquirySource
                ? { label: form.enquirySource, value: form.enquirySource }
                : null
            }
            onChange={(val) => handleChange("enquirySource", val?.value || "")}
            placeholder="Select Enquiry Source"
          />
          {errors.enquirySource && (
            <span className="text-xs text-orange-500">
              {errors.enquirySource}
            </span>
          )}
        </div>

        {/* Booking Date */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Booking Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={form.bookingDate}
            onChange={(val) => handleChange("bookingDate", val)}
            placeholder="DD-MM-YYYY"
            options={{
              dateFormat: "d-m-Y", // ← Fix here too
            }}
          />
          {errors.bookingDate && (
            <span className="text-xs text-orange-500">
              {errors.bookingDate}
            </span>
          )}
        </div>
      </div>

      {/* Middle 2-Column Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Follow Up Date */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Follow Up Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={form.followUpDate}
            onChange={(val) => handleChange("followUpDate", val)}
            placeholder="DD-MM-YYYY"
            options={{
              dateFormat: "d-m-Y", // ← Fix here too
            }}
          />
          {errors.followUpDate && (
            <span className="text-xs text-orange-500">
              {errors.followUpDate}
            </span>
          )}
        </div>

        {/* Enquiry Status */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Enquiry Status <span className="text-red-500">*</span>
          </label>
          <Combobox
            data={enquiryStatusOptions}
            displayField="label"
            value={
              form.enquiryStatus
                ? { label: form.enquiryStatus, value: form.enquiryStatus }
                : null
            }
            onChange={(val) => handleChange("enquiryStatus", val?.value || "")}
            placeholder="Select Enquiry Status"
          />
          {errors.enquiryStatus && (
            <span className="text-xs text-orange-500">
              {errors.enquiryStatus}
            </span>
          )}
        </div>

        {/* DMS Enquiry No */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            DMS Enquiry No
          </label>
          <input
            type="text"
            placeholder="Enter DMS Enquiry No"
            value={form.dmsEnquiryNo}
            onChange={(e) => handleChange("dmsEnquiryNo", e.target.value)}
            className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* DMS Enquiry Date */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            DMS Enquiry Date
          </label>
          <DatePicker
            value={form.dmsEnquiryDate}
            onChange={(val) => handleChange("dmsEnquiryDate", val)}
            placeholder="DD-MM-YYYY"
            options={{
              dateFormat: "d-m-Y", // ← Fix here too
            }}
          />
        </div>

        {/* Other Model in consideration */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Other Model in consideration
          </label>
          <Textarea
            placeholder="Enter other model"
            value={form.otherModel}
            onChange={(e) => handleChange("otherModel", e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Any Competitor model test ride taken */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Any Competitor model test ride taken
          </label>
          <Textarea
            placeholder="Enter competitor model"
            value={form.competitorTestRide}
            onChange={(e) => handleChange("competitorTestRide", e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Sales Manager Remarks */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Sales Manager Remarks
          </label>
          <Textarea
            placeholder="Enter remarks"
            value={form.salesManagerRemarks}
            onChange={(e) =>
              handleChange("salesManagerRemarks", e.target.value)
            }
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Dealer Remarks */}
        <div className="flex flex-col gap-1">
          <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
            Dealer Remarks
          </label>
          <Textarea
            placeholder="Enter dealer remarks"
            value={form.dealerRemarks}
            onChange={(e) => handleChange("dealerRemarks", e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Advance Payment Box */}
      <div className="space-y-4 rounded-lg border-2 border-blue-200 bg-blue-50/30 p-4">
        {/* Checkbox */}
        <label className="dark:text-dark-100 flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={form.advancePayment}
            onChange={(e) => {
              handleChange("advancePayment", e.target.checked);
              // Reset payment fields when unchecked
              if (!e.target.checked) {
                handleChange("paymentMode", "");
                handleChange("bankMode", "");
                handleChange("listOfBooking", "");
                handleChange("selectAccount", "");
                handleChange("narration", "");
                handleChange("chequeNo", "");
                handleChange("chequeDate", "");
                handleChange("chequeClearDate", "");
              } else {
                // Default to CASH when checked
                handleChange("paymentMode", "CASH");
              }
            }}
          />
          Advance Payment
        </label>

        {form.advancePayment && (
          <div className="grid grid-cols-3 gap-4">
            {/* List of Booking */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                List of Booking ($)
              </label>
              <input
                type="text"
                placeholder="Enter List of Booking"
                value={form.listOfBooking || ""}
                onChange={(e) => handleChange("listOfBooking", e.target.value)}
                className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Payment Mode */}
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Payment Mode:
              </label>
              <div className="mt-1 flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-1.5 text-sm">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="CASH"
                    checked={form.paymentMode === "CASH"}
                    onChange={() => {
                      handleChange("paymentMode", "CASH");
                      handleChange("bankMode", "");
                      handleChange("chequeNo", "");
                      handleChange("chequeDate", "");
                      handleChange("chequeClearDate", "");
                    }}
                    className="accent-blue-600"
                  />
                  CASH
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 text-sm">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="BANK"
                    checked={form.paymentMode === "BANK"}
                    onChange={() => {
                      handleChange("paymentMode", "BANK");
                      handleChange("bankMode", "NEFT");
                    }}
                    className="accent-blue-600"
                  />
                  BANK
                </label>
              </div>
            </div>

            {/* CASH mode: Select Account + Narration */}
            {form.paymentMode === "CASH" && (
              <>
                <div className="flex flex-col gap-1">
                  {/* empty col to maintain 3-col grid */}
                </div>

                {/* Select Account */}
                <div className="flex flex-col gap-1">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    Select Account
                  </label>
                  <select
                    value={form.selectAccount || ""}
                    onChange={(e) =>
                      handleChange("selectAccount", e.target.value)
                    }
                    className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Account</option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                </div>

                {/* Narration */}
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    Narration
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Narration"
                    value={form.narration || ""}
                    onChange={(e) => handleChange("narration", e.target.value)}
                    className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* BANK mode */}
            {form.paymentMode === "BANK" && (
              <>
                {/* Select Account */}
                <div className="flex flex-col gap-1">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    Select Account
                  </label>
                  <select
                    value={form.selectAccount || ""}
                    onChange={(e) =>
                      handleChange("selectAccount", e.target.value)
                    }
                    className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Account</option>
                    <option value="account1">Account 1</option>
                    <option value="account2">Account 2</option>
                  </select>
                </div>

                {/* Bank Mode Radio Group */}
                <div className="flex flex-col gap-1">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    Mode:
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2">
                    {(["NEFT", "RTGS", "IMPS", "CHEQUE", "UPI"] as const).map(
                      (mode) => (
                        <label
                          key={mode}
                          className="flex cursor-pointer items-center gap-1.5 text-sm"
                        >
                          <input
                            type="radio"
                            name="bankMode"
                            value={mode}
                            checked={form.bankMode === mode}
                            onChange={() => {
                              handleChange("bankMode", mode);
                              // Reset cheque fields if switching away from CHEQUE
                              if (mode !== "CHEQUE") {
                                handleChange("chequeNo", "");
                                handleChange("chequeDate", "");
                                handleChange("chequeClearDate", "");
                              }
                            }}
                            className="accent-blue-600"
                          />
                          {mode}
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* CHEQUE selected: show Cheque No. + dates */}
                {form.bankMode === "CHEQUE" ? (
                  <>
                    {/* Cheque No */}
                    <div className="flex flex-col gap-1">
                      <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                        Cheque No.
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Cheque No"
                        value={form.chequeNo || ""}
                        onChange={(e) =>
                          handleChange("chequeNo", e.target.value)
                        }
                        className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Cheque Date */}
                    <div className="flex flex-col gap-1">
                      <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                        Cheque Date
                      </label>
                      <DatePicker
                        value={form.chequeDate || ""}
                        onChange={(val) => handleChange("chequeDate", val)}
                        placeholder="Select Date"
                        options={{ dateFormat: "d-m-Y" }}
                      />
                    </div>

                    {/* Cheque Clear Date */}
                    <div className="flex flex-col gap-1">
                      <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                        Cheque Clear Date
                      </label>
                      <DatePicker
                        value={form.chequeClearDate || ""}
                        onChange={(val) => handleChange("chequeClearDate", val)}
                        placeholder="Select Date"
                        options={{ dateFormat: "d-m-Y" }}
                      />
                    </div>

                    {/* Narration - full width */}
                    <div className="col-span-3 flex flex-col gap-1">
                      <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                        Narration
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Narration"
                        value={form.narration || ""}
                        onChange={(e) =>
                          handleChange("narration", e.target.value)
                        }
                        className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  /* Non-CHEQUE bank mode: just Narration */
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                      Narration
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Narration"
                      value={form.narration || ""}
                      onChange={(e) =>
                        handleChange("narration", e.target.value)
                      }
                      className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Lead Details Drawer ────────────────────────────────────────────────
export function LeadDetailsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<OptionType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<OptionType | null>(
    null,
  );
  const [selectedColor, setSelectedColor] = useState<OptionType | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<OptionType | null>(
    null,
  );
  const [selectedExecutive, setSelectedExecutive] = useState<OptionType | null>(
    null,
  );
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const leadInfoValidateRef = useRef<(() => boolean) | null>(null);
  const reviewSummaryValidateRef = useRef<(() => boolean) | null>(null);
  const totalSteps = 4;

  const models: OptionType[] = [
    { id: 1, name: "Access 125" },
    { id: 2, name: "Burgman Street" },
    { id: 3, name: "Avenis 125" },
    { id: 4, name: "Hayabusa" },
  ];

  const variants: OptionType[] = [
    { id: 1, name: "Ride Connect Edition" },
    { id: 2, name: "Standard Edition" },
    { id: 3, name: "Special Edition" },
    { id: 4, name: "Drum Brake" },
    { id: 5, name: "Disc Brake" },
  ];

  const colors: OptionType[] = [
    { id: 1, name: "Pearl Mirage White" },
    { id: 2, name: "Metallic Sonic Silver" },
    { id: 3, name: "Pearl Blaze Orange" },
    { id: 4, name: "Glass Sparkle Black" },
    { id: 5, name: "Candy Sonoma Red" },
  ];

  const customers: OptionType[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
    { id: 4, name: "Emily Davis" },
  ];

  const executives: OptionType[] = [
    { id: 1, name: "Alex (Sales Mgr)" },
    { id: 2, name: "Sarah (Executive)" },
    { id: 3, name: "Mike (Senior Sales)" },
    { id: 4, name: "Lisa (Sales Rep)" },
  ];

  const validateStep1And2 = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!selectedModel) newErrors.model = "Please select a model";
      if (!selectedVariant) newErrors.variant = "Please select a variant";
      if (!selectedColor) newErrors.color = "Please select a color";
    }
    if (currentStep === 2) {
      if (!selectedCustomer) newErrors.customer = "Please select a customer";
      if (!selectedExecutive)
        newErrors.executive = "Please select a sales executive";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1 || step === 2) {
      if (!validateStep1And2(step)) return;
    }
    if (step === 3 && leadInfoValidateRef.current) {
      const isValid = leadInfoValidateRef.current();
      if (!isValid) return;
    }

    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Validate review summary step
    if (reviewSummaryValidateRef.current) {
      const isValid = reviewSummaryValidateRef.current();
      if (!isValid) return;
    }

    console.log("Lead submitted!", {
      selectedModel,
      selectedVariant,
      selectedColor,
      selectedCustomer,
      selectedExecutive,
    });
    onClose();
  };

  const handleCreateAccount = (formData: AccountForm) => {
    console.log("Account created:", formData);
  };

  const handleModelChange = (val: OptionType | null) => {
    setSelectedModel(val);
    setSelectedVariant(null);
    setSelectedColor(null);
    if (errors.model) {
      const newErrors = { ...errors };
      delete newErrors.model;
      setErrors(newErrors);
    }
  };

  const handleVariantChange = (val: OptionType | null) => {
    setSelectedVariant(val);
    setSelectedColor(null);
    if (errors.variant) {
      const newErrors = { ...errors };
      delete newErrors.variant;
      setErrors(newErrors);
    }
  };

  const handleColorChange = (val: OptionType | null) => {
    setSelectedColor(val);
    if (errors.color) {
      const newErrors = { ...errors };
      delete newErrors.color;
      setErrors(newErrors);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Vehicle Selection";
      case 2:
        return "Customer Detail";
      case 3:
        return "Lead Info";
      case 4:
        return "Review Lead Summary";
      default:
        return "";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/60"
          aria-hidden="true"
        />
        <div className="fixed inset-y-0 right-0 flex max-w-full">
          <DialogPanel
            className={`dark:bg-dark-700 flex h-full w-screen max-w-3xl flex-col bg-white shadow-xl transition-all duration-300`}
          >
            {/* Header */}
            <div className="dark:bg-dark-600 flex items-center justify-between bg-blue-700 px-4 py-3">
              <DialogTitle className="dark:text-dark-50 font-semibold text-white">
                {getStepTitle()} ({step}/{totalSteps})
              </DialogTitle>
              <button
                onClick={onClose}
                className="dark:text-dark-200 text-white/80 hover:text-white dark:hover:text-white"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="dark:text-dark-50 text-lg font-bold text-gray-800">
                    Vehicle Selection
                  </h3>

                  <div className="flex flex-col gap-1">
                    <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                      Select Model
                    </label>
                    <Combobox
                      data={models}
                      displayField="name"
                      value={selectedModel}
                      onChange={handleModelChange}
                      placeholder="Select Model"
                      searchFields={["name"]}
                    />
                    {errors.model && (
                      <span className="text-xs text-orange-500">
                        {errors.model}
                      </span>
                    )}
                  </div>

                  {selectedModel && (
                    <div className="flex flex-col gap-1">
                      <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                        Select Variant
                      </label>
                      <Combobox
                        data={variants}
                        displayField="name"
                        value={selectedVariant}
                        onChange={handleVariantChange}
                        placeholder="Select Variant"
                        searchFields={["name"]}
                      />
                      {errors.variant && (
                        <span className="text-xs text-orange-500">
                          {errors.variant}
                        </span>
                      )}
                    </div>
                  )}

                  {selectedVariant && (
                    <div className="flex flex-col gap-1">
                      <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                        Select Color
                      </label>
                      <Combobox
                        data={colors}
                        displayField="name"
                        value={selectedColor}
                        onChange={handleColorChange}
                        placeholder="Select Color"
                        searchFields={["name"]}
                      />
                      {errors.color && (
                        <span className="text-xs text-orange-500">
                          {errors.color}
                        </span>
                      )}
                    </div>
                  )}

                  {selectedModel && selectedVariant && selectedColor && (
                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        Selected: {selectedModel.name} - {selectedVariant.name}{" "}
                        - {selectedColor.name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="dark:text-dark-50 text-lg font-bold text-gray-800">
                    Customer Detail
                  </h3>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Combobox
                        data={customers}
                        displayField="name"
                        value={selectedCustomer}
                        onChange={(val: OptionType | null) => {
                          setSelectedCustomer(val);
                          if (errors.customer) {
                            const newErrors = { ...errors };
                            delete newErrors.customer;
                            setErrors(newErrors);
                          }
                        }}
                        placeholder="First Name"
                        label="First Name"
                        searchFields={["name"]}
                      />
                      {errors.customer && (
                        <span className="text-xs text-orange-500">
                          {errors.customer}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsCreateAccountOpen(true)}
                      className="dark:border-dark-500 dark:hover:bg-dark-600 mt-6 flex-shrink-0 rounded-md border border-blue-900 p-2 hover:bg-gray-100"
                    >
                      <PlusIcon className="dark:text-dark-200 size-6 text-blue-900" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                      Sales Executive
                    </label>
                    <Combobox
                      data={executives}
                      displayField="name"
                      value={selectedExecutive}
                      onChange={(val: OptionType | null) => {
                        setSelectedExecutive(val);
                        if (errors.executive) {
                          const newErrors = { ...errors };
                          delete newErrors.executive;
                          setErrors(newErrors);
                        }
                      }}
                      placeholder="Select Sales Executive"
                      searchFields={["name"]}
                    />
                    {errors.executive && (
                      <span className="text-xs text-orange-500">
                        {errors.executive}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <LeadInfoStep
                  onValidationChange={(validateFn: () => boolean) => {
                    leadInfoValidateRef.current = validateFn;
                  }}
                />
              )}

              {step === 4 && (
                <ReviewLeadSummaryStep
                  onValidationChange={(validateFn: () => boolean) => {
                    reviewSummaryValidateRef.current = validateFn;
                  }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="dark:border-dark-500 flex justify-between border-t border-gray-200 p-4">
              <button
                onClick={handlePrevious}
                disabled={step === 1}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="rounded-lg bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="rounded-lg bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Submit
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </>
  );
}
