// src/app/pages/purchase/tractor/add.tsx
import React, { useState, useMemo } from "react";
import type { PurchaseRegisterRow } from "./register";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "@/components/ui";
import { Listbox } from "@/components/shared/form/StyledListbox";
import { DatePicker } from "@/components/shared/form/Datepicker";
import emptyStateImage from "@/assets/notfound.png";

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
  state: string;
  stateCode: string;
  district: string;
  city: string;
  address: string;
  panCard: string;
  aadharCard: string;
}

type TermsType = "Credit" | "Cash" | "Bank";

// ---------- Mock data ----------
const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: "v1", itemName: "C12", model: "C12", itemCode: "001", variant: "EX", colour: "RED" },
  { id: "v2", itemName: "C14", model: "C14", itemCode: "002", variant: "DX", colour: "BLUE" },
  { id: "v3", itemName: "T20", model: "T20", itemCode: "003", variant: "EX", colour: "GREEN" },
  { id: "v4", itemName: "T20", model: "T20", itemCode: "004", variant: "Base", colour: "WHITE" },
];

const PARTY_OPTIONS: PartyOption[] = [
  { id: "p1", name: "Sharma Traders" },
  { id: "p2", name: "Bharat Motors" },
  { id: "p3", name: "Kisan Agro Supplies" },
];

const CASH_ACCOUNTS = ["Cash in Hand", "Petty Cash"];
const BANK_ACCOUNTS = ["HDFC Bank - 4521", "SBI Current - 7788", "ICICI Bank - 1190"];

const termsOptions = [
  { label: "Credit", value: "Credit" },
  { label: "Cash", value: "Cash" },
  { label: "Bank", value: "Bank" },
];

const countries = [
  { label: "India", value: "India" },
  { label: "Nepal", value: "Nepal" },
  { label: "Bangladesh", value: "Bangladesh" },
];

const states = [
  { label: "Gujarat", value: "Gujarat" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Rajasthan", value: "Rajasthan" },
];

const districts = [
  { label: "Junagadh", value: "Junagadh" },
  { label: "Rajkot", value: "Rajkot" },
  { label: "Surat", value: "Surat" },
];

const cities = [
  { label: "Junagadh", value: "Junagadh" },
  { label: "Veraval", value: "Veraval" },
  { label: "Mangrol", value: "Mangrol" },
];

let rowIdSeq = 1;
const nextRowId = () => `row-${rowIdSeq++}`;

// ---------- Main component ----------
const DEFAULT_QTY = 2;

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
  state: "",
  stateCode: "",
  district: "",
  city: "",
  address: "",
  panCard: "",
  aadharCard: "",
};

const TractorPurchaseBill: React.FC<TractorPurchaseBillProps> = ({ onBack, onSaved }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const [terms, setTerms] = useState<TermsType>("Credit");
  const [cashAccount, setCashAccount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [partyId, setPartyId] = useState("");
  const [parties, setParties] = useState<PartyOption[]>(PARTY_OPTIONS);
  const [billNo] = useState("p/V/25-26/001");
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
  const [billVerify, setBillVerify] = useState<"not_verify" | "verify">("not_verify");
  const [vehicleSearch, setVehicleSearch] = useState("");

  // Account form state
  const [accountForm, setAccountForm] = useState<NewAccountData>(emptyAccount);
  const [accountTouched, setAccountTouched] = useState(false);

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

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const updateDraft = (key: keyof ItemRow, value: string | number) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch.trim()) return VEHICLE_OPTIONS;
    const q = vehicleSearch.toLowerCase();
    return VEHICLE_OPTIONS.filter((v) =>
      `${v.itemName} ${v.model} ${v.itemCode} ${v.variant} ${v.colour}`
        .toLowerCase()
        .includes(q)
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
    if (!draft.item.trim()) return;
    setRows((r) => [...r, { ...draft, saved: true }]);
    setDraft(emptyDraft());
  };

  const removeRow = (id: string) => setRows((r) => r.filter((row) => row.id !== id));

  const handleCreateAccount = () => {
    const required: (keyof NewAccountData)[] = [
      "accountName", "mobile", "country", "state", "district", "city", "address", "panCard", "aadharCard"
    ];
    const missing = required.filter((k) => !accountForm[k].trim());
    setAccountTouched(true);
    if (missing.length > 0) return;
    
    const newParty: PartyOption = {
      id: `p-${Date.now()}`,
      name: accountForm.accountName.trim(),
    };
    setParties((p) => [...p, newParty]);
    setPartyId(newParty.id);
    setAccountModalOpen(false);
    setAccountForm(emptyAccount);
    setAccountTouched(false);
  };

  const updateAccountForm = (key: keyof NewAccountData, value: string) => {
    setAccountForm((f) => ({ ...f, [key]: value }));
  };

  const handleSave = () => {
    const selectedParty = parties.find((p) => p.id === partyId);
    const row: PurchaseRegisterRow = {
      id: `pr-${Date.now()}`,
      purchaseDate: purchaseDate || date,
      terms,
      supplierName: selectedParty?.name ?? "",
      billNo,
      purchaseBillNo,
      location: purchaseLocation,
      totalQuantity,
      totalAmount,
      freightInsuranceOther,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      grandTotal,
      transportName: "",
      mobileNo: "",
      vehicalNo: "",
      status: billVerify === "verify" ? "Verified" : "Pending",
    };
    onSaved?.(row);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/purchase/tractor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl rounded-xl bg-white shadow-sm dark:bg-gray-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
          <h1 className="text-lg sm:text-xl font-bold text-blue-600 underline dark:text-blue-400">
           Tractor Purchase Bill
          </h1>
          <button
            onClick={handleBack}
            className="w-full sm:w-auto rounded-lg bg-red-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

        {/* Top fields - Responsive with fixed spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <DatePicker 
              value={date}
              onChange={(val: string | Date) => setDate(typeof val === 'string' ? val : val?.toISOString?.()?.split?.('T')?.[0] || '')}
              placeholder="Select date..."
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Terms</label>
            <Listbox
              data={termsOptions}
              value={termsOptions.find((t) => t.value === terms) || termsOptions[0]}
              onChange={(val: any) => setTerms(val.value)}
              displayField="label"
            />
          </div>

          {terms === "Cash" && (
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Cash Account</label>
              <Listbox
                data={CASH_ACCOUNTS.map((a) => ({ label: a, value: a }))}
                value={CASH_ACCOUNTS.find((a) => a === cashAccount) ? { label: cashAccount, value: cashAccount } : null}
                onChange={(val: any) => setCashAccount(val.value)}
                displayField="label"
                placeholder="Select cash account"
              />
            </div>
          )}

          {terms === "Bank" && (
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Account</label>
              <Listbox
                data={BANK_ACCOUNTS.map((a) => ({ label: a, value: a }))}
                value={BANK_ACCOUNTS.find((a) => a === bankAccount) ? { label: bankAccount, value: bankAccount } : null}
                onChange={(val: any) => setBankAccount(val.value)}
                displayField="label"
                placeholder="Select bank account"
              />
            </div>
          )}

          {/* Party Name with fixed width for + button */}
          <div className="col-span-2 sm:col-span-1 ">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Party Name</label>
            <div className="flex gap-2 min-w-[180px]">
              <div className="flex-1 min-w-0">
                <Listbox
                  data={parties.map((p) => ({ label: p.name, value: p.id }))}
                  value={parties.find((p) => p.id === partyId) ? { label: parties.find((p) => p.id === partyId)?.name || "", value: partyId } : null}
                  onChange={(val: any) => setPartyId(val.value)}
                  displayField="label"
                  placeholder="Select party"
                />
              </div>
              <button
                onClick={() => setAccountModalOpen(true)}
                className="flex-shrink-0 rounded-lg border border-gray-300 px-3 text-xl text-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700 min-w-[38px]"
              >
                +
              </button>
            </div>
          </div>

          {/* Bill No - with enough space */}
          <div className="col-span-1 pl-10">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bill No.</label>
            <Input value={billNo} readOnly className="w-full bg-gray-50 dark:bg-gray-700" />
          </div>

          {/* Purchase Bill No */}
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Bill No</label>
            <Input
              placeholder="Enter Purchase Bill No"
              value={purchaseBillNo}
              onChange={(e) => setPurchaseBillNo(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4 pb-3 sm:pb-4 md:px-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Date</label>
            <DatePicker 
              value={purchaseDate}
              onChange={(val: string | Date) => setPurchaseDate(typeof val === 'string' ? val : val?.toISOString?.()?.split?.('T')?.[0] || '')}
              placeholder="Select date..."
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Location</label>
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
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
            <DatePicker 
              value={dueDate}
              onChange={(val: string | Date) => setDueDate(typeof val === 'string' ? val : val?.toISOString?.()?.split?.('T')?.[0] || '')}
              placeholder="Select date..."
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Narration</label>
            <Input placeholder="Enter Narration" value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full" />
          </div>
        </div>

        {/* Item table - rest of the component remains the same */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] sm:min-w-[800px] md:min-w-[980px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-gray-700">
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">ITEM</th>
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">ITEM CODE</th>
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">COLOR</th>
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">CHASSIS NO</th>
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">ENGINE NO</th>
                  <th className="w-12 sm:w-16 p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">QTY</th>
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">RATE PER</th>
                  <th className="w-16 sm:w-20 p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">GST %</th>
                  <th className="whitespace-nowrap p-1.5 sm:p-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">AMOUNT</th>
                  <th className="w-12 sm:w-16 p-1.5 sm:p-2 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {/* Draft row */}
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td className="p-1 sm:p-1.5">
                    <button
                      onClick={() => setVehicleModalOpen(true)}
                      className={`w-full rounded border border-blue-600 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold ${
                        draft.item ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {draft.item || "+ Add"}
                    </button>
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="Enter Code"
                      value={draft.itemCode}
                      onChange={(e) => updateDraft("itemCode", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="Color"
                      value={draft.color}
                      onChange={(e) => updateDraft("color", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="Chassis"
                      value={draft.chassisNo}
                      onChange={(e) => updateDraft("chassisNo", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="Engine"
                      value={draft.engineNo}
                      onChange={(e) => updateDraft("engineNo", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      type="number"
                      min={0}
                      value={draft.qty}
                      onChange={(e) => updateDraft("qty", Number(e.target.value))}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="Rate"
                      value={draft.ratePer}
                      onChange={(e) => updateDraft("ratePer", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="GST"
                      value={draft.gstPercent}
                      onChange={(e) => updateDraft("gstPercent", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5">
                    <input
                      placeholder="Amount"
                      value={draft.amount}
                      onChange={(e) => updateDraft("amount", e.target.value)}
                      className="w-full rounded border border-gray-300 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </td>
                  <td className="p-1 sm:p-1.5 text-center">
                    <button
                      onClick={saveDraftRow}
                      disabled={!draft.item.trim()}
                      className={`inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg text-white ${
                        draft.item.trim() ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </td>
                </tr>

                {/* Saved rows */}
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.item}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.itemCode}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.color}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.chassisNo}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.engineNo}</td>
                    <td className="p-1.5 sm:p-2 text-center text-xs sm:text-sm">{r.qty}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.ratePer}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.gstPercent}</td>
                    <td className="p-1.5 sm:p-2 text-xs sm:text-sm">{r.amount}</td>
                    <td className="p-1.5 sm:p-2 text-center">
                      <button
                        onClick={() => removeRow(r.id)}
                        className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                      >
                        <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 sm:py-12 md:py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
                        <img
                          src={emptyStateImage}
                          alt="No items added"
                          className="max-h-24 sm:max-h-32 md:max-h-48 w-auto opacity-60"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const emoji = document.createElement("div");
                              emoji.className = "text-4xl sm:text-5xl md:text-6xl opacity-60";
                              emoji.textContent = "📦";
                              parent.insertBefore(emoji, parent.firstChild);
                            }
                          }}
                        />
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          No items added yet. Click <span className="font-semibold text-blue-600">+ Add</span> to add items.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between gap-2 border-t border-gray-200 pt-3 sm:pt-4 text-xs sm:text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
            <span>Total Quantity: <span className="font-bold">{totalQuantity}</span></span>
            <span>Total Amount: <span className="font-bold">₹{fmt(totalAmount)}</span></span>
          </div>
        </div>

        {/* Charges and summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 pb-3 sm:pb-4 md:px-6">
          <div className="rounded-lg border border-gray-200 p-3 sm:p-4 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Freight Charge</label>
                <Input
                  placeholder="Freight"
                  value={freightCharge}
                  onChange={(e) => setFreightCharge(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Insurance</label>
                <Input placeholder="Insurance" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Other Charge</label>
                <Input placeholder="Other" value={otherCharge} onChange={(e) => setOtherCharge(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Round Amount</label>
                <Input placeholder="Round" value={roundAmount} onChange={(e) => setRoundAmount(e.target.value)} className="w-full" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm">
                <input
                  type="radio"
                  name="billVerify"
                  checked={billVerify === "not_verify"}
                  onChange={() => setBillVerify("not_verify")}
                />
                Bill Not Verify
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm">
                <input
                  type="radio"
                  name="billVerify"
                  checked={billVerify === "verify"}
                  onChange={() => setBillVerify("verify")}
                />
                Bill Verify
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-3 sm:p-4 dark:border-gray-700">
            <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                <span className="font-semibold">₹{fmt(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Freight + Insurance + Other</span>
                <span className="font-semibold">₹{fmt(freightInsuranceOther)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Taxable Value</span>
                <span className="font-semibold">₹{fmt(newTaxableValue)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm sm:text-base font-bold dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Grand Total</span>
                <span className="text-blue-600 dark:text-blue-400">₹{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-center px-3 sm:px-4 pb-4 sm:pb-6">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto rounded-lg bg-red-600 px-8 sm:px-12 py-2.5 sm:py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            Save
          </button>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6 dark:bg-gray-800">
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">🚗 Vehicle Details</h2>
              <button onClick={() => { setVehicleModalOpen(false); setVehicleSearch(""); }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mb-3 sm:mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="w-full rounded-lg border border-red-500 bg-white px-4 py-1.5 sm:py-2 pl-9 sm:pl-10 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left dark:bg-gray-700">
                    <th className="w-10 sm:w-12 p-1.5 sm:p-2">#</th>
                    <th className="p-1.5 sm:p-2">Item Name</th>
                    <th className="p-1.5 sm:p-2">Model</th>
                    <th className="p-1.5 sm:p-2">Item Code</th>
                    <th className="p-1.5 sm:p-2">Variant</th>
                    <th className="p-1.5 sm:p-2">Colour</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-1.5 sm:p-2 text-center">
                        <button
                          onClick={() => handleVehicleSelect(v)}
                          className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded bg-green-600 text-white hover:bg-green-700"
                        >
                          ✓
                        </button>
                      </td>
                      <td className="p-1.5 sm:p-2">{v.itemName}</td>
                      <td className="p-1.5 sm:p-2">{v.model}</td>
                      <td className="p-1.5 sm:p-2">{v.itemCode}</td>
                      <td className="p-1.5 sm:p-2">{v.variant}</td>
                      <td className="p-1.5 sm:p-2">{v.colour}</td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-3 sm:p-4 text-center text-gray-500">
                        No vehicles match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6 dark:bg-gray-800">
            <div className="mb-3 sm:mb-4 flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Create Account</h2>
              <button onClick={() => { setAccountModalOpen(false); setAccountForm(emptyAccount); setAccountTouched(false); }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter Account Name"
                  value={accountForm.accountName}
                  onChange={(e) => updateAccountForm("accountName", e.target.value)}
                  className={`w-full ${accountTouched && !accountForm.accountName.trim() ? "border-red-500" : ""}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Mobile"
                  value={accountForm.mobile}
                  onChange={(e) => updateAccountForm("mobile", e.target.value)}
                  className={`w-full ${accountTouched && !accountForm.mobile.trim() ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country <span className="text-red-500">*</span>
                </label>
                <Listbox
                  data={countries}
                  value={countries.find((c) => c.value === accountForm.country) || null}
                  onChange={(val: any) => updateAccountForm("country", val.value)}
                  displayField="label"
                  placeholder="Search Country"
                  className={`w-full ${accountTouched && !accountForm.country.trim() ? "border-red-500" : ""}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  State <span className="text-red-500">*</span>
                </label>
                <Listbox
                  data={states}
                  value={states.find((s) => s.value === accountForm.state) || null}
                  onChange={(val: any) => updateAccountForm("state", val.value)}
                  displayField="label"
                  placeholder="Search State"
                  className={`w-full ${accountTouched && !accountForm.state.trim() ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">State Code</label>
                <Input
                  placeholder="Auto-filled"
                  value={accountForm.stateCode}
                  readOnly
                  className="w-full bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  District <span className="text-red-500">*</span>
                </label>
                <Listbox
                  data={districts}
                  value={districts.find((d) => d.value === accountForm.district) || null}
                  onChange={(val: any) => updateAccountForm("district", val.value)}
                  displayField="label"
                  placeholder="Search District"
                  className={`w-full ${accountTouched && !accountForm.district.trim() ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  City <span className="text-red-500">*</span>
                </label>
                <Listbox
                  data={cities}
                  value={cities.find((c) => c.value === accountForm.city) || null}
                  onChange={(val: any) => updateAccountForm("city", val.value)}
                  displayField="label"
                  placeholder="Search City"
                  className={`w-full ${accountTouched && !accountForm.city.trim() ? "border-red-500" : ""}`}
                />
              </div>
              <div />

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter Address"
                  value={accountForm.address}
                  onChange={(e) => updateAccountForm("address", e.target.value)}
                  className={`w-full ${accountTouched && !accountForm.address.trim() ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  PAN Card <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="PAN Card Number"
                  value={accountForm.panCard}
                  onChange={(e) => updateAccountForm("panCard", e.target.value)}
                  className={`w-full ${accountTouched && !accountForm.panCard.trim() ? "border-red-500" : ""}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aadhar Card No <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Aadhar Number"
                  value={accountForm.aadharCard}
                  onChange={(e) => updateAccountForm("aadharCard", e.target.value)}
                  className={`w-full ${accountTouched && !accountForm.aadharCard.trim() ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                onClick={() => { setAccountModalOpen(false); setAccountForm(emptyAccount); setAccountTouched(false); }}
                className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                className="w-full sm:w-auto rounded-lg bg-red-600 px-4 sm:px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TractorPurchaseBill;