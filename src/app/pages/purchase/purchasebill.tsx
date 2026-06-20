// src/app/pages/purchase/tractor/add.tsx
import React, { useState, useMemo, useEffect } from "react";
import type { PurchaseRegisterRow } from "./register";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui";
import { Listbox } from "@/components/shared/form/StyledListbox";
import { DatePicker } from "@/components/shared/form/Datepicker";
// import { Combobox } from "@/components/shared/form/StyledCombobox";
import emptyStateImage from "@/assets/notfound.png";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { Radio } from "@/components/ui";
import apiHelper from "@/utils/apiHelper";
// ---------- Types ----------

interface TractorPurchaseBillProps {
  onBack?: () => void;
  onSaved?: (row: PurchaseRegisterRow) => void;
}

interface VehicleOption {
  id: string;
  itemName: string;
  model: string;
  itemCode: string;
  variant: string;
  colour: string;
}

interface ItemRow {
  id: string;
  item: string;
  itemCode: string;
  color: string;
  chassisNo: string;
  engineNo: string;
  qty: number;
  ratePer: string;
  gstPercent: string;
  amount: string;
  saved: boolean;
}

interface PartyOption {
  id: string;
  name: string;
}

interface NewAccountData {
  accountName: string;
  mobile: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  district: string;
  city: string;
  address: string;
  panCard: string;
  aadharCard: string;
}

type TermsType = "Credit" | "Cash" | "Bank";

type PaymentMode = "UPI" | "NEFT" | "RTGS" | "IMPS" | "CHEQUE" | "CARD";

interface BankDetailsData {
  paymentMode: PaymentMode | "";
  chequeNo: string;
  chequeDate: string;
  clearDate: string;
  narration: string;
}

const emptyBankDetails: BankDetailsData = {
  paymentMode: "",
  chequeNo: "",
  chequeDate: "",
  clearDate: "",
  narration: "",
};

const paymentModeOptions: { label: string; value: PaymentMode }[] = [
  { label: "UPI", value: "UPI" },
  { label: "NEFT", value: "NEFT" },
  { label: "RTGS", value: "RTGS" },
  { label: "IMPS", value: "IMPS" },
  { label: "CHEQUE", value: "CHEQUE" },
  { label: "CARD", value: "CARD" },
];

// ---------- Mock data ----------
const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: "v1",
    itemName: "C12",
    model: "C12",
    itemCode: "001",
    variant: "EX",
    colour: "RED",
  },
  {
    id: "v2",
    itemName: "C14",
    model: "C14",
    itemCode: "002",
    variant: "DX",
    colour: "BLUE",
  },
  {
    id: "v3",
    itemName: "T20",
    model: "T20",
    itemCode: "003",
    variant: "EX",
    colour: "GREEN",
  },
  {
    id: "v4",
    itemName: "T20",
    model: "T20",
    itemCode: "004",
    variant: "Base",
    colour: "WHITE",
  },
];

const PARTY_OPTIONS: PartyOption[] = [
  { id: "p1", name: "Sharma Traders" },
  { id: "p2", name: "Bharat Motors" },
  { id: "p3", name: "Kisan Agro Supplies" },
];

const CASH_ACCOUNTS = ["Cash in Hand", "Petty Cash"];
const BANK_ACCOUNTS = [
  "HDFC Bank - 4521",
  "SBI Current - 7788",
  "ICICI Bank - 1190",
];

const termsOptions = [
  { label: "Credit", value: "Credit" },
  { label: "Cash", value: "Cash" },
  { label: "Bank", value: "Bank" },
];

let rowIdSeq = 1;
const nextRowId = () => `row-${rowIdSeq++}`;

// ---------- Main component ----------
const DEFAULT_QTY = 1;

const emptyDraft = (): ItemRow => ({
  id: nextRowId(),
  item: "",
  itemCode: "",
  color: "",
  chassisNo: "",
  engineNo: "",
  qty: DEFAULT_QTY,
  ratePer: "",
  gstPercent: "",
  amount: "",
  saved: false,
});

const emptyAccount: NewAccountData = {
  accountName: "",
  mobile: "",
  country: "",
  countryCode: "",
  state: "",
  stateCode: "",
  district: "",
  city: "",
  address: "",
  panCard: "",
  aadharCard: "",
};

// ─── react-select custom styles ──────────────────────────────────────────
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: state.isFocused
      ? "var(--color-primary-600)"
      : "var(--color-gray-300)",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary-600)" : "none",
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

const TractorPurchaseBill: React.FC<TractorPurchaseBillProps> = ({
  onBack,
  onSaved,
}) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [billNo, setBillNo] = useState("");
  const [terms, setTerms] = useState<TermsType>("Credit");
  const [cashAccount, setCashAccount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [partyId, setPartyId] = useState("");
 const [parties, setParties] =
  useState<PartyOption[]>([]);
  // const [billNo] = useState("p/V/25-26/001");
  const [purchaseBillNo, setPurchaseBillNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("Main Branch");
  const [dueDate, setDueDate] = useState("");
  const [narration, setNarration] = useState("");
  const [rows, setRows] = useState<ItemRow[]>([]);
  const [draft, setDraft] = useState<ItemRow>(emptyDraft());
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [freightCharge, setFreightCharge] = useState("");
  const [insurance, setInsurance] = useState("");
  const [otherCharge, setOtherCharge] = useState("");
  const [roundAmount, setRoundAmount] = useState("");
  const [billVerify, setBillVerify] = useState<"not_verify" | "verify">(
    "not_verify",
  );
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});
  // Account form state
  const [accountForm, setAccountForm] = useState<NewAccountData>(emptyAccount);
  const [accountTouched, setAccountTouched] = useState(false);
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [bankDetailsModalOpen, setBankDetailsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] =
    useState<BankDetailsData>(emptyBankDetails);
  const [bankDetailsTouched, setBankDetailsTouched] = useState(false);

  const updateBankDetails = (key: keyof BankDetailsData, value: string) =>
    setBankDetails((b) => ({ ...b, [key]: value }));

  const handleSaveBankDetails = () => {
    setBankDetailsTouched(true);
    if (!bankDetails.paymentMode) return;
    if (
      bankDetails.paymentMode === "CHEQUE" &&
      (!bankDetails.chequeNo.trim() || !bankDetails.chequeDate.trim())
    ) {
      return;
    }
    setBankDetailsModalOpen(false);
    setBankDetailsTouched(false);
  };

  const handleCancelBankDetails = () => {
    setBankDetailsModalOpen(false);
    setBankDetails(emptyBankDetails);
    setBankDetailsTouched(false);
    setBankAccount("");
  };

  // ─── Dynamic Location Data ──────────────────────────────────────────────────
  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
  }, []);

  const stateOptions = useMemo(() => {
    if (!accountForm.countryCode) return [];
    return State.getStatesOfCountry(accountForm.countryCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [accountForm.countryCode]);

  const cityOptions = useMemo(() => {
    if (!accountForm.countryCode || !accountForm.stateCode) return [];
    return City.getCitiesOfState(
      accountForm.countryCode,
      accountForm.stateCode,
    ).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [accountForm.countryCode, accountForm.stateCode]);

  // Use cityOptions for district as well
  const districtOptions = cityOptions;

  // ----- derived totals -----
  const totalQuantity = rows.reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
  const totalAmount = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const freightNum = Number(freightCharge) || 0;
  const insuranceNum = Number(insurance) || 0;
  const otherNum = Number(otherCharge) || 0;
  const roundNum = Number(roundAmount) || 0;
  const freightInsuranceOther = freightNum + insuranceNum + otherNum;
  const newTaxableValue = totalAmount + freightInsuranceOther;
  const grandTotal = newTaxableValue + roundNum;
 const getAccounts = async () => {
  try {
    const res = await apiHelper.get("/accounts");

    const accounts = res.data || [];

    setCashAccounts(
      accounts.filter(
        (acc: any) =>
          acc.group === "Cash-in-Hand" ||
          acc.group === "Cash Account"
      )
    );

    setBankAccounts(
      accounts.filter(
        (acc: any) =>
          acc.group === "Bank Accounts" ||
          acc.group === "Bank Account"
      )
    );
    
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  getAccounts();
}, []);


  const fmt = (n: number) =>
    n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const updateDraft = (key: keyof ItemRow, value: string | number) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch.trim()) return VEHICLE_OPTIONS;
    const q = vehicleSearch.toLowerCase();
    return VEHICLE_OPTIONS.filter((v) =>
      `${v.itemName} ${v.model} ${v.itemCode} ${v.variant} ${v.colour}`
        .toLowerCase()
        .includes(q),
    );
  }, [vehicleSearch]);

  const handleVehicleSelect = (v: VehicleOption) => {
    setDraft((d) => ({
      ...d,
      item: v.itemName,
      itemCode: v.itemCode,
      color: v.colour,
    }));
    setVehicleModalOpen(false);
    setVehicleSearch("");
  };

  const saveDraftRow = () => {
    // Validate all required fields
    if (!draft.item.trim()) {
      alert("Please select or enter an Item Name");
      return;
    }
    if (!draft.itemCode.trim()) {
      alert("Please enter Item Code");
      return;
    }
    if (!draft.color.trim()) {
      alert("Please enter Color");
      return;
    }
    if (!draft.chassisNo.trim()) {
      alert("Please enter Chassis No");
      return;
    }
    if (!draft.engineNo.trim()) {
      alert("Please enter Engine No");
      return;
    }
    if (!draft.qty || draft.qty < 1) {
      alert("Please enter a valid Quantity (minimum 1)");
      return;
    }
    if (!draft.ratePer.trim()) {
      alert("Please enter Rate Per");
      return;
    }
    if (!draft.gstPercent.trim()) {
      alert("Please enter GST %");
      return;
    }
    if (!draft.amount.trim()) {
      alert("Please enter Amount");
      return;
    }

    // All validations passed, save the row
    setRows((r) => [...r, { ...draft, saved: true }]);
    setDraft(emptyDraft());
  };

  const removeRow = (id: string) =>
    setRows((r) => r.filter((row) => row.id !== id));

const handleCreateAccount = async () => {
  try {
    const required: (keyof NewAccountData)[] = [
      "accountName",
      "mobile",
      "countryCode",
      "stateCode",
      "district",
      "city",
      "address",
      "panCard",
      "aadharCard",
    ];

    const missing = required.filter(
      (k) => !accountForm[k]?.trim()
    );

    setAccountTouched(true);

    if (missing.length > 0) return;

    const res = await apiHelper.post("/accounts", {
      accountName: accountForm.accountName,
      printName: accountForm.accountName,

      mobile: accountForm.mobile,

      country: accountForm.country,
      countryCode: accountForm.countryCode,

      state: accountForm.state,
      stateCode: accountForm.stateCode,

      district: accountForm.district,
      city: accountForm.city,

      address1: accountForm.address,

      panCard: accountForm.panCard,
      aadharNo: accountForm.aadharCard,

      // drCr: "DR",
      // openingBalance: 0,
    });

const account = res.data;

console.log("API Response:", account);

if (!account?.id) {
  console.log("Invalid Response:", account);
  return;
}

const newParty = {
  id: account.id,
  name: account.accountName,
};

    setParties((prev) => [...prev, newParty]);

    setPartyId(account.id);

    setAccountModalOpen(false);
    setAccountForm(emptyAccount);
    setAccountTouched(false);

  } catch (error) {
    console.error(error);
  }
};
const getParties = async () => {
  try {
    const res = await apiHelper.get("/accounts");

  const accounts = Array.isArray(res.data?.data)
  ? res.data.data
  : Array.isArray(res.data)
  ? res.data
  : [];

setParties(
  accounts.map((acc: any) => ({
    id: acc.id,
    name: acc.accountName,
  }))
);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
    getBillNo();
  getParties();
}, []);
  const updateAccountForm = (key: keyof NewAccountData, value: string) => {
    setAccountForm((f) => ({ ...f, [key]: value }));
  };

const handleSave = async () => {
  try {
    const payload = {
      accountId: partyId,
      purchaseDate: purchaseDate || date,
      purchaseBillNo,
      terms,
      narration,

      freightCharge,
      insurance,
      otherCharge,
      roundAmount,

      totalQty: totalQuantity,
      totalAmount,
      grandTotal,

      items: rows,
    };

    const res = await apiHelper.post(
      "/purchases",
      payload
    );

    console.log(res);

    alert("Purchase Saved Successfully");

    // Generate next bill no
    await getBillNo();

    // Reset form
    setRows([]);
    setPurchaseBillNo("");
    setNarration("");
    setFreightCharge("");
    setInsurance("");
    setOtherCharge("");
    setRoundAmount("");

  } catch (error) {
    console.error(error);
    alert("Failed to save purchase");
  }
};

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/purchase/tractor");
    }
  };
const getBillNo = async () => {
  try {
    const res = await apiHelper.get(
      "/purchases/generate-bill-no"
    );

   

    setBillNo(res.billNo || "");
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm dark:bg-gray-800">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:border-gray-700">
          <h1 className="text-lg font-bold text-blue-600 underline sm:text-xl dark:text-blue-400">
            Tractor Purchase Bill
          </h1>
          <button
            onClick={handleBack}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto sm:px-5"
          >
            ← Back
          </button>
        </div>

        {/* Top fields */}
        <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-4 md:p-6 lg:grid-cols-4 xl:grid-cols-6">
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <DatePicker
              value={date}
              onChange={(selectedDates: Date[]) => {
                const val = selectedDates[0];
                setDate(
                  typeof val === "string"
                    ? val
                    : val?.toISOString?.()?.split?.("T")?.[0] || "",
                );
              }}
              placeholder="Select date..."
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Terms
            </label>
            <Listbox
              data={termsOptions}
              value={
                termsOptions.find((t) => t.value === terms) || termsOptions[0]
              }
              onChange={(val: any) => setTerms(val.value)}
              displayField="label"
            />
          </div>

          {terms === "Cash" && (
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cash Account
              </label>

              <Listbox
                data={cashAccounts.map((acc) => ({
                  label: acc.accountName,
                  value: acc.id,
                }))}
                value={
                  cashAccounts.find((acc) => acc.id === cashAccount)
                    ? {
                        label:
                          cashAccounts.find((acc) => acc.id === cashAccount)
                            ?.accountName || "",
                        value: cashAccount,
                      }
                    : null
                }
                onChange={(val: any) => setCashAccount(val.value)}
                displayField="label"
                placeholder="Select Cash Account"
              />
            </div>
          )}
          {terms === "Bank" && (
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Account
              </label>

              <Listbox
                data={bankAccounts.map((acc) => ({
                  label: acc.accountName,
                  value: acc.id,
                }))}
                value={
                  bankAccounts.find((acc) => acc.id === bankAccount)
                    ? {
                        label:
                          bankAccounts.find((acc) => acc.id === bankAccount)
                            ?.accountName || "",
                        value: bankAccount,
                      }
                    : null
                }
                onChange={(val: any) => {
                  setBankAccount(val.value);
                  setBankDetailsModalOpen(true);
                }}
                displayField="label"
                placeholder="Select Bank Account"
              />
            </div>
          )}

          <div className={terms === "Credit" ? "col-span-2" : "col-span-1"}>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Party Name
            </label>
            <div className="flex w-full gap-2">
              <div className="min-w-0 flex-1">
                <Listbox
                  data={parties.map((p) => ({ label: p.name, value: p.id }))}
                  value={
                    parties.find((p) => p.id === partyId)
                      ? {
                          label:
                            parties.find((p) => p.id === partyId)?.name || "",
                          value: partyId,
                        }
                      : null
                  }
                  onChange={(val: any) => setPartyId(val.value)}
                  displayField="label"
                  placeholder="Select party"
                />
              </div>
              <button
                onClick={() => setAccountModalOpen(true)}
                className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-xl text-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bill No.
            </label>
            <Input
              value={billNo}
              readOnly
              className="w-full bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purchase Bill No
            </label>
            <Input
              placeholder="Enter Purchase Bill No"
              value={purchaseBillNo}
              onChange={(e) => setPurchaseBillNo(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 gap-3 px-3 pb-3 sm:grid-cols-2 sm:gap-4 sm:px-4 sm:pb-4 md:px-6 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purchase Date
            </label>
            <DatePicker
              value={purchaseDate}
              onChange={(selectedDates: Date[]) => {
                const val = selectedDates[0];
                setPurchaseDate(
                  typeof val === "string"
                    ? val
                    : val?.toISOString?.()?.split?.("T")?.[0] || "",
                );
              }}
              placeholder="Select date..."
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purchase Location
            </label>
            <Listbox
              data={[
                { label: "Main Branch", value: "Main Branch" },
                { label: "North Branch", value: "North Branch" },
                { label: "South Branch", value: "South Branch" },
              ]}
              value={{ label: purchaseLocation, value: purchaseLocation }}
              onChange={(val: any) => setPurchaseLocation(val.value)}
              displayField="label"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <DatePicker
              value={dueDate}
              onChange={(selectedDates: Date[]) => {
                const val = selectedDates[0];
                setDueDate(
                  typeof val === "string"
                    ? val
                    : val?.toISOString?.()?.split?.("T")?.[0] || "",
                );
              }}
              placeholder="Select date..."
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Narration
            </label>
            <Input
              placeholder="Enter Narration"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* ========== ITEM TABLE ========== */}
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ITEM
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ITEM NAME
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ITEM CODE
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    COLOR
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    CHASSIS NO
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ENGINE NO
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    QTY
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    RATE PER
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    GST %
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    AMOUNT
                  </th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Draft row */}

                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={() => setVehicleModalOpen(true)}
                      className="rounded border border-blue-600 px-3 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      Add
                    </button>
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Enter Item Name"
                      value={draft.item}
                      onChange={(e) => updateDraft("item", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Enter Code"
                      value={draft.itemCode}
                      onChange={(e) => updateDraft("itemCode", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Color"
                      value={draft.color}
                      onChange={(e) => updateDraft("color", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Chassis"
                      value={draft.chassisNo}
                      onChange={(e) => updateDraft("chassisNo", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Engine"
                      value={draft.engineNo}
                      onChange={(e) => updateDraft("engineNo", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      min={1}
                      value={draft.qty}
                      onChange={(e) =>
                        updateDraft("qty", Number(e.target.value))
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Rate"
                      value={draft.ratePer}
                      onChange={(e) => updateDraft("ratePer", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="GST"
                      value={draft.gstPercent}
                      onChange={(e) =>
                        updateDraft("gstPercent", e.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      placeholder="Amount"
                      value={draft.amount}
                      onChange={(e) => updateDraft("amount", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button
                      onClick={saveDraftRow}
                      disabled={!draft.item.trim()}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-white ${
                        draft.item.trim()
                          ? "bg-green-600 hover:bg-green-700"
                          : "cursor-not-allowed bg-gray-300"
                      }`}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {/* Saved rows */}
                {rows.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`border-t border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800/50"
                        : "bg-gray-50 dark:bg-gray-700/30"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-200">
                      {r.item}
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {r.itemCode}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-block h-3 w-3 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: r.color || "#cccccc" }}
                        />
                        {r.color}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-700 dark:text-gray-300">
                      {r.chassisNo}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-700 dark:text-gray-300">
                      {r.engineNo}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-gray-900 dark:text-gray-200">
                      {r.qty}
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {r.ratePer}
                    </td>
                    <td className="px-3 py-2.5 text-center text-gray-700 dark:text-gray-300">
                      {r.gstPercent}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-gray-900 dark:text-gray-200">
                      ₹{r.amount}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => removeRow(r.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <img
                          src={emptyStateImage}
                          alt="No items added"
                          className="max-h-32 w-auto opacity-60 sm:max-h-40"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const emoji = document.createElement("div");
                              emoji.className = "text-5xl opacity-60";
                              emoji.textContent = "📦";
                              parent.insertBefore(emoji, parent.firstChild);
                            }
                          }}
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No items added yet. Click{" "}
                          <span className="font-semibold text-blue-600">
                            {" "}
                            Add
                          </span>{" "}
                          to add items.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex flex-col justify-between gap-2 border-t border-gray-200 pt-4 text-sm font-semibold text-gray-700 sm:flex-row dark:border-gray-700 dark:text-gray-300">
            <span>
              Total Quantity:{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {totalQuantity}
              </span>
            </span>
            <span>
              Total Amount:{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                ₹{fmt(totalAmount)}
              </span>
            </span>
          </div>
        </div>

        {/* Charges and summary */}
        {/* Charges and summary */}
        <div className="grid grid-cols-1 gap-4 px-3 pb-4 sm:px-4 sm:pb-6 md:px-6 lg:grid-cols-5">
          {/* Charges Section - takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Additional Charges
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Freight Charge
                  </label>
                  <Input
                    placeholder="Enter freight"
                    value={freightCharge}
                    onChange={(e) => setFreightCharge(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Insurance
                  </label>
                  <Input
                    placeholder="Enter insurance"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Other Charge
                  </label>
                  <Input
                    placeholder="Enter other charge"
                    value={otherCharge}
                    onChange={(e) => setOtherCharge(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Round Amount
                  </label>
                  <Input
                    placeholder="Enter round amount"
                    value={roundAmount}
                    onChange={(e) => setRoundAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Bill Verify Radio Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bill Status:
                </span>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Radio
                    checked={billVerify === "not_verify"}
                    onChange={() => setBillVerify("not_verify")}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Not Verify
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Radio
                    checked={billVerify === "verify"}
                    onChange={() => setBillVerify("verify")}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Verify
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Section - takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bill Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Value
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    ₹{fmt(totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Freight + Insurance + Other
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    ₹{fmt(freightInsuranceOther)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    New Taxable Value
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    ₹{fmt(newTaxableValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-600/10 p-2 dark:bg-blue-500/20">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹{fmt(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-center px-3 pb-4 sm:px-4 sm:pb-6">
          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-red-600 px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 sm:w-auto sm:px-12 sm:py-3"
          >
            Save
          </button>
        </div>
      </div>

      {/* ========== RIGHT SIDE DRAWER MODALS ========== */}

      {/* Vehicle Details - Right Drawer */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setVehicleModalOpen(false);
              setVehicleSearch("");
            }}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-2xl transition-transform sm:w-3/4 lg:w-1/2 dark:bg-gray-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {" "}
                  Vehicle Details
                </h2>
                <button
                  onClick={() => {
                    setVehicleModalOpen(false);
                    setVehicleSearch("");
                  }}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search vehicles..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full rounded-lg border border-red-500 bg-white px-4 py-2 pl-10 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left dark:bg-gray-700">
                        <th className="w-12 p-2">#</th>
                        <th className="p-2">Item Name</th>
                        <th className="p-2">Model</th>
                        <th className="p-2">Item Code</th>
                        <th className="p-2">Variant</th>
                        <th className="p-2">Colour</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map((v) => (
                        <tr
                          key={v.id}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleVehicleSelect(v)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded bg-green-600 text-white hover:bg-green-700"
                            >
                              ✓
                            </button>
                          </td>
                          <td className="p-2">{v.itemName}</td>
                          <td className="p-2">{v.model}</td>
                          <td className="p-2">{v.itemCode}</td>
                          <td className="p-2">{v.variant}</td>
                          <td className="p-2">{v.colour}</td>
                        </tr>
                      ))}
                      {filteredVehicles.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-gray-500"
                          >
                            No vehicles match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details - Right Drawer */}
      {bankDetailsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelBankDetails}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-lg transform bg-white shadow-2xl transition-transform sm:w-3/4 lg:w-2/5 dark:bg-gray-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {" "}
                  Bank Details
                </h2>
                <button
                  onClick={handleCancelBankDetails}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {paymentModeOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
                      >
                        <input
                          type="radio"
                          name="paymentMode"
                          checked={bankDetails.paymentMode === opt.value}
                          onChange={() =>
                            updateBankDetails("paymentMode", opt.value)
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {bankDetailsTouched && !bankDetails.paymentMode && (
                    <p className="mt-1 text-xs text-red-500">
                      Please select a payment mode.
                    </p>
                  )}
                </div>

                {bankDetails.paymentMode === "CHEQUE" && (
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cheque No <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Enter Cheque No"
                        value={bankDetails.chequeNo}
                        onChange={(e) =>
                          updateBankDetails("chequeNo", e.target.value)
                        }
                        className={`w-full ${bankDetailsTouched && !bankDetails.chequeNo.trim() ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cheque Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        value={bankDetails.chequeDate}
                        onChange={(selectedDates: Date[]) => {
                          const val = selectedDates[0];
                          updateBankDetails(
                            "chequeDate",
                            typeof val === "string"
                              ? val
                              : val?.toISOString?.()?.split?.("T")?.[0] || "",
                          );
                        }}
                        placeholder="Select date..."
                        className={`w-full ${bankDetailsTouched && !bankDetails.chequeDate.trim() ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Clear Date
                      </label>
                      <DatePicker
                        value={bankDetails.clearDate}
                        onChange={(selectedDates: Date[]) => {
                          const val = selectedDates[0];
                          updateBankDetails(
                            "clearDate",
                            typeof val === "string"
                              ? val
                              : val?.toISOString?.()?.split?.("T")?.[0] || "",
                          );
                        }}
                        placeholder="Select date..."
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Narration
                  </label>
                  <textarea
                    placeholder="Enter Narration"
                    value={bankDetails.narration}
                    onChange={(e) =>
                      updateBankDetails("narration", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 sm:p-6 dark:border-gray-700">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    onClick={handleCancelBankDetails}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBankDetails}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:w-auto sm:px-6"
                  >
                    Add Bank Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Account - Right Drawer WITH DYNAMIC LOCATION */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setAccountModalOpen(false);
              setAccountForm(emptyAccount);
              setAccountTouched(false);
            }}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-2xl transition-transform sm:w-3/4 lg:w-1/2 dark:bg-gray-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Create Account
                </h2>
                <button
                  onClick={() => {
                    setAccountModalOpen(false);
                    setAccountForm(emptyAccount);
                    setAccountTouched(false);
                  }}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {/* Account Name */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter Account Name"
                      value={accountForm.accountName}
                      onChange={(e) =>
                        updateAccountForm("accountName", e.target.value)
                      }
                      className={`w-full ${accountTouched && !accountForm.accountName.trim() ? "border-red-500" : ""}`}
                    />
                  </div>
                  {/* Mobile */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Mobile"
                      value={accountForm.mobile}
                      onChange={(e) =>
                        updateAccountForm("mobile", e.target.value)
                      }
                      className={`w-full ${accountTouched && !accountForm.mobile.trim() ? "border-red-500" : ""}`}
                    />
                  </div>

                  {/* Country - Dynamic with react-select */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={countryOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search Country"
                      value={
                        countryOptions.find(
                          (option) => option.value === accountForm.countryCode,
                        ) || null
                      }
                      onChange={(selected) => {
                        updateAccountForm("countryCode", selected?.value || "");
                        updateAccountForm("country", selected?.label || "");
                        updateAccountForm("stateCode", "");
                        updateAccountForm("state", "");
                        updateAccountForm("district", "");
                        updateAccountForm("city", "");
                      }}
                    />
                    {accountTouched && !accountForm.countryCode && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select a country.
                      </p>
                    )}
                  </div>

                  {/* State - Dynamic with react-select */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={stateOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search State"
                      isDisabled={!accountForm.countryCode}
                      value={
                        stateOptions.find(
                          (option) => option.value === accountForm.stateCode,
                        ) || null
                      }
                      onChange={(selected) => {
                        updateAccountForm("stateCode", selected?.value || "");
                        updateAccountForm("state", selected?.label || "");
                        updateAccountForm("district", "");
                        updateAccountForm("city", "");
                      }}
                    />
                    {accountTouched && !accountForm.stateCode && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select a state.
                      </p>
                    )}
                  </div>

                  {/* District - Dynamic with react-select */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      District <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={districtOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search District"
                      isDisabled={!accountForm.stateCode}
                      value={
                        districtOptions.find(
                          (option) => option.value === accountForm.district,
                        ) || null
                      }
                      onChange={(selected) => {
                        updateAccountForm("district", selected?.value || "");
                      }}
                    />
                    {accountTouched && !accountForm.district && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select a district.
                      </p>
                    )}
                  </div>

                  {/* City - Dynamic with react-select */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={cityOptions}
                      styles={customSelectStyles}
                      classNamePrefix="react-select"
                      placeholder="Search City"
                      isDisabled={!accountForm.stateCode}
                      value={
                        cityOptions.find(
                          (option) => option.value === accountForm.city,
                        ) || null
                      }
                      onChange={(selected) => {
                        updateAccountForm("city", selected?.value || "");
                      }}
                    />
                    {accountTouched && !accountForm.city && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select a city.
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter Address"
                      value={accountForm.address}
                      onChange={(e) =>
                        updateAccountForm("address", e.target.value)
                      }
                      className={`w-full ${accountTouched && !accountForm.address.trim() ? "border-red-500" : ""}`}
                    />
                  </div>

                  {/* PAN Card */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      PAN Card <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="PAN Card Number"
                      value={accountForm.panCard}
                      onChange={(e) =>
                        updateAccountForm("panCard", e.target.value)
                      }
                      className={`w-full ${accountTouched && !accountForm.panCard.trim() ? "border-red-500" : ""}`}
                    />
                  </div>
                  {/* Aadhar Card */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Aadhar Card No <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Aadhar Number"
                      value={accountForm.aadharCard}
                      onChange={(e) =>
                        updateAccountForm("aadharCard", e.target.value)
                      }
                      className={`w-full ${accountTouched && !accountForm.aadharCard.trim() ? "border-red-500" : ""}`}
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 sm:p-6 dark:border-gray-700">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    onClick={() => {
                      setAccountModalOpen(false);
                      setAccountForm(emptyAccount);
                      setAccountTouched(false);
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:w-auto sm:px-6"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TractorPurchaseBill;
