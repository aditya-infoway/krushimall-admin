import { useState, useRef, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Combobox } from "@/components/shared/form/StyledCombobox";
import { Checkbox } from "@/components/ui/Form/Checkbox";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

// ─── Types ──────────────────────────────────────────────────────────────────
interface AccountForm {
  accountName: string;
  mobile: string;
  country: string;
  state: string;
  stateCode: string;
  district: string;
  city: string;
  address: string;
  panCard: string;
  aadharCard: string;
}

interface FinanceType {
  financeDoneBy: { id: number; name: string } | null;
  bankOfFinance: { id: number; name: string } | null;
  financeAmount: string;
  emi: string;
  tenureMonths: string;
  marginMoney: string;
  loanRoi: string;
  apronCharge: string;
}

interface ExchangeType {
  existingModel: string;
  existingVariant: string;
  existingYear: string;
  customerExpectedPrice: string;
  marketPrice: string;
  valuation: string;
  valueOfOldVehicle: string;
  exchangeBonus: string;
  smplShares: string;
  dealerShares: string;
  valueAddAccessories: string;
  insurance: string;
  totalValue: string;
}

interface OptionType {
  id: number;
  name: string;
}

// ─── Create Account Drawer ──────────────────────────────────────────────────
function CreateAccountModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountForm) => void;
}) {
  const [form, setForm] = useState<AccountForm>({
    accountName: "",
    mobile: "",
    country: "India",
    state: "Maharashtra",
    stateCode: "MH",
    district: "",
    city: "Jalgaon",
    address: "",
    panCard: "",
    aadharCard: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof AccountForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.accountName.trim())
      newErrors.accountName = "Account Name is required";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile is required";
    if (!form.stateCode.trim()) newErrors.stateCode = "State Code is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.panCard.trim()) newErrors.panCard = "PAN Card is required";
    if (!form.aadharCard.trim())
      newErrors.aadharCard = "Aadhar Card is required";
    if (!form.district) newErrors.district = "District is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  const inputClass = (field: keyof AccountForm) =>
    `border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 ${
      errors[field]
        ? "border-orange-500 dark:border-orange-500"
        : "border-gray-300"
    }`;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[60]">
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60"
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <DialogPanel className="dark:bg-dark-700 flex h-full w-screen max-w-xl flex-col bg-white shadow-xl">
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
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Account Name",
                  field: "accountName" as keyof AccountForm,
                  placeholder: "Enter Account Name",
                },
                {
                  label: "Mobile",
                  field: "mobile" as keyof AccountForm,
                  placeholder: "Mobile",
                },
                {
                  label: "State Code",
                  field: "stateCode" as keyof AccountForm,
                  placeholder: "State Code",
                },
                {
                  label: "Address",
                  field: "address" as keyof AccountForm,
                  placeholder: "Enter Address",
                },
                {
                  label: "PAN Card",
                  field: "panCard" as keyof AccountForm,
                  placeholder: "PAN Card Number",
                },
                {
                  label: "Aadhar Card No",
                  field: "aadharCard" as keyof AccountForm,
                  placeholder: "Aadhar Number",
                },
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={inputClass(field)}
                  />
                  {errors[field] && (
                    <span className="text-xs text-orange-500">
                      {errors[field]}
                    </span>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Karnataka</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  District
                </label>
                <select
                  value={form.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className={inputClass("district")}
                >
                  <option value="">Select</option>
                  <option>Jalgaon</option>
                  <option>Pune</option>
                  <option>Nashik</option>
                </select>
                {errors.district && (
                  <span className="text-xs text-orange-500">
                    {errors.district}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Jalgaon</option>
                  <option>Pune</option>
                  <option>Mumbai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="dark:border-dark-500 flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="dark:border-dark-500 dark:text-dark-200 dark:hover:bg-dark-600 rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
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
function LeadInfoStep({
  onPrevious,
  onSubmit,
  onValidationChange,
}: {
  onPrevious: () => void;
  onSubmit: () => void;
  onValidationChange: (fn: () => boolean) => void;
}) {
  const [interestedTestRide, setInterestedTestRide] = useState(true);
  const [wantsFinance, setWantsFinance] = useState(true);
  const [changeVehicle, setChangeVehicle] = useState(false);
  const [eycVerification, setEycVerification] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [finance, setFinance] = useState<FinanceType>({
    financeDoneBy: null,
    bankOfFinance: null,
    financeAmount: "",
    emi: "",
    tenureMonths: "",
    marginMoney: "",
    loanRoi: "",
    apronCharge: "0",
  });

  const [exchange, setExchange] = useState<ExchangeType>({
    existingModel: "",
    existingVariant: "",
    existingYear: "",
    customerExpectedPrice: "",
    marketPrice: "",
    valuation: "",
    valueOfOldVehicle: "",
    exchangeBonus: "",
    smplShares: "",
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

  const handleExchange = (field: keyof ExchangeType, value: any) => {
    setExchange((p) => ({ ...p, [field]: value }));
    const errorKey = `exchange_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const handleChangeVehicleToggle = (checked: boolean) => {
    setChangeVehicle(checked);

    // Clear all exchange errors when checkbox is unchecked
    if (!checked) {
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("exchange_")) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (wantsFinance) {
      if (!finance.financeDoneBy)
        newErrors.finance_financeDoneBy = "Finance Done By is required";
      if (!finance.bankOfFinance)
        newErrors.finance_bankOfFinance = "Bank of Finance is required";
      if (!finance.financeAmount.trim())
        newErrors.finance_financeAmount = "Finance Amount is required";
      if (!finance.emi.trim()) newErrors.finance_emi = "EMI is required";
      if (!finance.tenureMonths.trim())
        newErrors.finance_tenureMonths = "Tenure is required";
      if (!finance.marginMoney.trim())
        newErrors.finance_marginMoney = "Margin Money is required";
      if (!finance.loanRoi.trim())
        newErrors.finance_loanRoi = "Loan ROI is required";
      if (!finance.apronCharge.trim())
        newErrors.finance_apronCharge = "Apron Charge is required";
    }

    if (changeVehicle) {
      if (!exchange.existingModel.trim())
        newErrors.exchange_existingModel = "Existing Model is required";
      if (!exchange.existingVariant.trim())
        newErrors.exchange_existingVariant = "Existing Variant is required";
      if (!exchange.existingYear.trim())
        newErrors.exchange_existingYear = "Existing Vehicle Year is required";
      if (!exchange.customerExpectedPrice.trim())
        newErrors.exchange_customerExpectedPrice =
          "Customer Expected Price is required";
      if (!exchange.marketPrice.trim())
        newErrors.exchange_marketPrice = "Market Price is required";
      if (!exchange.valuation.trim())
        newErrors.exchange_valuation = "Valuation is required";
      if (!exchange.valueOfOldVehicle.trim())
        newErrors.exchange_valueOfOldVehicle =
          "Value of Old Vehicle is required";
      if (!exchange.exchangeBonus.trim())
        newErrors.exchange_exchangeBonus = "Exchange Bonus is required";
      if (!exchange.smplShares.trim())
        newErrors.exchange_smplShares = "SMPL Shares is required";
      if (!exchange.dealerShares.trim())
        newErrors.exchange_dealerShares = "Dealer Shares is required";
      if (!exchange.valueAddAccessories.trim())
        newErrors.exchange_valueAddAccessories =
          "Value Add Accessories is required";
      if (!exchange.insurance.trim())
        newErrors.exchange_insurance = "Insurance is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validate);
    }
  }, [changeVehicle, wantsFinance]);

  const inputClass = (field: string) =>
    `border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 ${
      errors[field]
        ? "border-orange-500 dark:border-orange-500"
        : "border-gray-300"
    }`;

  const financeDoneByOptions: OptionType[] = [
    { id: 1, name: "Self" },
    { id: 2, name: "Bank" },
    { id: 3, name: "NBFC" },
  ];

  const bankOfFinanceOptions: OptionType[] = [
    { id: 1, name: "SBI" },
    { id: 2, name: "HDFC" },
    { id: 3, name: "ICICI" },
    { id: 4, name: "Axis Bank" },
    { id: 5, name: "Kotak Mahindra" },
  ];

  return (
    <div className="space-y-4">
      {/* Checkboxes */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Checkbox
            defaultChecked={interestedTestRide}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInterestedTestRide(e.target.checked)
            }
          />
          <span className="dark:text-dark-200 text-sm text-gray-700">
            Interested in Test Ride
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Checkbox
            defaultChecked={changeVehicle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeVehicleToggle(e.target.checked)
            }
          />
          <span className="dark:text-dark-200 text-sm text-gray-700">
            Change Current Vehicle?
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Checkbox
            defaultChecked={wantsFinance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWantsFinance(e.target.checked)
            }
          />
          <span className="dark:text-dark-200 text-sm text-gray-700">
            Wants Finance for Vehicle?
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Checkbox
            defaultChecked={eycVerification}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEycVerification(e.target.checked)
            }
          />
          <span className="dark:text-dark-200 text-sm text-gray-700">
            EYC Verification
          </span>
        </div>
      </div>

      {/* "E" HYPOTHECATION */}
      {wantsFinance && (
        <div className="dark:border-dark-600 dark:bg-dark-800 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="dark:text-dark-50 text-sm font-bold text-gray-800">
            "E" HYPOTHECATION
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Finance Done By
              </label>
              <Combobox
                data={financeDoneByOptions}
                displayField="name"
                value={finance.financeDoneBy}
                onChange={(val: OptionType | null) =>
                  handleFinance("financeDoneBy", val)
                }
                placeholder="Select Finance Done By"
                searchFields={["name"]}
              />
              {errors.finance_financeDoneBy && (
                <span className="text-xs text-orange-500">
                  {errors.finance_financeDoneBy}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Bank of Finance
              </label>
              <Combobox
                data={bankOfFinanceOptions}
                displayField="name"
                value={finance.bankOfFinance}
                onChange={(val: OptionType | null) =>
                  handleFinance("bankOfFinance", val)
                }
                placeholder="Select Bank"
                searchFields={["name"]}
              />
              {errors.finance_bankOfFinance && (
                <span className="text-xs text-orange-500">
                  {errors.finance_bankOfFinance}
                </span>
              )}
            </div>
            {[
              {
                label: "Finance Amount",
                field: "financeAmount" as keyof FinanceType,
                placeholder: "Enter Amount",
              },
              {
                label: "EMI",
                field: "emi" as keyof FinanceType,
                placeholder: "Enter EMI Amount",
              },
              {
                label: "Tenure in Months-24",
                field: "tenureMonths" as keyof FinanceType,
                placeholder: "Enter Tenure months",
              },
              {
                label: "Margin Money",
                field: "marginMoney" as keyof FinanceType,
                placeholder: "Enter MARGINHONEY",
              },
              {
                label: "Loan ROI",
                field: "loanRoi" as keyof FinanceType,
                placeholder: "Enter LOAN ROI",
              },
              {
                label: "Apron Charge",
                field: "apronCharge" as keyof FinanceType,
                placeholder: "0",
              },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={finance[field] as string}
                  onChange={(e) => handleFinance(field, e.target.value)}
                  className={inputClass(`finance_${field}`)}
                />
                {errors[`finance_${field}`] && (
                  <span className="text-xs text-orange-500">
                    {errors[`finance_${field}`]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "H" EXCHANGE DETAILS */}
      {changeVehicle && (
        <div className="dark:border-dark-600 dark:bg-dark-800 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="dark:text-dark-50 text-sm font-bold text-gray-800">
            "H" EXCHANGE DETAILS
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Existing Customer Model",
                field: "existingModel" as keyof ExchangeType,
                placeholder: "Enter Customer Model",
              },
              {
                label: "Existing Customer Variant",
                field: "existingVariant" as keyof ExchangeType,
                placeholder: "Enter Customer Variant",
              },
              {
                label: "Existing Vehicle Year",
                field: "existingYear" as keyof ExchangeType,
                placeholder: "Enter Existing Vehicle Year",
              },
              {
                label: "Customer Expected Price",
                field: "customerExpectedPrice" as keyof ExchangeType,
                placeholder: "Enter Expected Price",
              },
              {
                label: "Market Price",
                field: "marketPrice" as keyof ExchangeType,
                placeholder: "Enter Market Price",
              },
              {
                label: "Valuation",
                field: "valuation" as keyof ExchangeType,
                placeholder: "Enter Valuation",
              },
              {
                label: "Value of Old Vehicle",
                field: "valueOfOldVehicle" as keyof ExchangeType,
                placeholder: "Enter Value",
              },
              {
                label: "Exchange Bonus",
                field: "exchangeBonus" as keyof ExchangeType,
                placeholder: "Enter Exchange Bonus",
              },
              {
                label: "SMPL Shares",
                field: "smplShares" as keyof ExchangeType,
                placeholder: "Enter SMPL Shares",
              },
              {
                label: "Dealer Shares",
                field: "dealerShares" as keyof ExchangeType,
                placeholder: "Enter Dealer Shares",
              },
              {
                label: "Value Add Accessories",
                field: "valueAddAccessories" as keyof ExchangeType,
                placeholder: "Enter Accessories",
              },
              {
                label: "Insurance",
                field: "insurance" as keyof ExchangeType,
                placeholder: "Enter Insurance",
              },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="flex flex-col gap-1">
                <label
                  className="dark:text-dark-200 truncate text-sm font-medium text-gray-700"
                  title={label}
                >
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={exchange[field]}
                  onChange={(e) => handleExchange(field, e.target.value)}
                  className={inputClass(`exchange_${field}`)}
                />
                {errors[`exchange_${field}`] && (
                  <span className="text-xs text-orange-500">
                    {errors[`exchange_${field}`]}
                  </span>
                )}
              </div>
            ))}
            <div className="col-span-2 flex flex-col gap-1">
              <label className="dark:text-dark-200 text-sm font-medium text-gray-700">
                Total Value
              </label>
              <input
                type="text"
                value={exchange.totalValue}
                onChange={(e) => handleExchange("totalValue", e.target.value)}
                className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
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
  const [changeVehicle, setChangeVehicle] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const leadInfoValidateRef = useRef<(() => boolean) | null>(null);
  const totalSteps = 3;

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
    if (validateStep1And2(step)) {
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (leadInfoValidateRef.current) {
      const isValid = leadInfoValidateRef.current();
      if (!isValid) return; // ← Stops here if validation fails
    }
    console.log("Lead submitted!", {
      selectedModel,
      selectedVariant,
      selectedColor,
      selectedCustomer,
      selectedExecutive,
    });
    onClose(); // ← Only runs when validation passes
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

  const drawerMaxWidth = step === 3 && changeVehicle ? "max-w-3xl" : "max-w-lg";

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/60"
          aria-hidden="true"
        />
        <div className="fixed inset-y-0 right-0 flex max-w-full">
          <DialogPanel
            className={`w-screen ${drawerMaxWidth} dark:bg-dark-700 flex h-full flex-col bg-white shadow-xl transition-all duration-300`}
          >
            {/* Header */}
            <div className="dark:bg-dark-600 flex items-center justify-between bg-blue-700 px-4 py-3">
              <DialogTitle className="dark:text-dark-50 font-semibold text-white">
                Lead Details
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
                  onPrevious={handlePrevious}
                  onSubmit={handleSubmit}
                  onValidationChange={(validateFn: () => boolean) => {
                    leadInfoValidateRef.current = validateFn;
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
