// src/app/pages/purchase/implement/implementpurchasebill.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui";
import { Listbox } from "@/components/shared/form/StyledListbox";
import { DatePicker } from "@/components/shared/form/Datepicker";
import { Radio } from "@/components/ui";
import { Country, State, City } from "country-state-city";
import apiHelper from "@/utils/apiHelper";
import { toast } from "sonner";
import { Combobox } from "@/components/shared/form/Combobox";
import emptyStateImage from "@/assets/notfound.png";
import { createPortal } from "react-dom";
// ── Helpers ────────────────────────────────────────────────────────────
// operationType DB me "Self Operated" / "Tractor Operated" (ya SELF/TRACTOR) kuch bhi ho, ye handle karega
const isTractorOperated = (t?: string) => /tractor/i.test(t || "");
const isSelfOperated = (t?: string) => /self/i.test(t || "");

const parseGst = (slab: any) => {
  const n = parseFloat(String(slab ?? "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
};

interface ItemRow {
  id: string;
  implementId?: number;
  operationType?: string; // Self Operated | Tractor Operated
  item: string;
  itemCode: string;
  hsn: string;
  unit: string;
  categoryName?: string;
  brandName?: string;
  modelName?: string;
  variantName?: string;
  colourName?: string;
  chassisNo: string;
  engineNo: string;
  serialNo: string;
  qty: number;
  pPrice: string;
  gstPercent: string;
  gstAmount?: number;
  netAmount: string;
  status?: string;
}

interface PartyOption {
  id: string;
  name: string;
  mobile: number;
  stateCode: string;
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
  group: string;
  openingBalance: string;
  drCr: string;
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
  paymentMode: "UPI",
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

const termsOptions = [
  { label: "Credit", value: "Credit" },
  { label: "Cash", value: "Cash" },
  { label: "Bank", value: "Bank" },
];

const operationFilterOptions = [
  { label: "All Types", value: "All" },
  { label: "Self Operated", value: "Self" },
  { label: "Tractor Operated", value: "Tractor" },
];

let rowIdSeq = 1;
const nextRowId = () => `row-${rowIdSeq++}`;

const emptyDraft = (): ItemRow => ({
  id: nextRowId(),
  item: "",
  itemCode: "",
  hsn: "",
  unit: "",
  chassisNo: "",
  engineNo: "",
  serialNo: "",
  qty: 1,
  pPrice: "",
  gstPercent: "",
  netAmount: "",
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
  group: "",
  openingBalance: "",
  drCr: "",
};

const thClass =
  "border border-gray-500 px-3 py-2.5 text-center text-xs font-semibold whitespace-nowrap text-gray-700 dark:border-gray-500 dark:text-gray-300";
const tdClass =
  "border border-gray-500 px-3 py-2.5 text-gray-700 dark:border-gray-500 dark:text-gray-300";
const draftTd = "border border-gray-500 px-2 py-1.5 dark:border-gray-500";
const draftInput =
  "w-full rounded border border-gray-300 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-800";
const draftDisabled =
  "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500";

const ImplementPurchaseBill: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // ── Main Bill State ────────────────────────────────────────────────────
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [terms, setTerms] = useState<TermsType>("Credit");
  const [cashAccount, setCashAccount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [partyId, setPartyId] = useState("");
  const [parties, setParties] = useState<PartyOption[]>([]);
  const [billNo, setBillNo] = useState("");
  const [purchaseBillNo, setPurchaseBillNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("Main Branch");
  const [dueDate, setDueDate] = useState("");
  const [narration, setNarration] = useState("");

  const [rows, setRows] = useState<ItemRow[]>([]);
  const [draft, setDraft] = useState<ItemRow>(emptyDraft());

  const [implementDrawerOpen, setImplementDrawerOpen] = useState(false);
  const [implementSearch, setImplementSearch] = useState("");
  const [implementTypeFilter, setImplementTypeFilter] = useState("All");

  const [freightCharge, setFreightCharge] = useState("");
  const [insurance, setInsurance] = useState("");
  const [otherCharge, setOtherCharge] = useState("");
  const [roundAmount, setRoundAmount] = useState("");
  const [billVerify, setBillVerify] = useState<"not_verify" | "verify">(
    "not_verify",
  );

  // ── Accounts State (Dynamic from API) ────────────────────────────────
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  // ── Bank Details drawer state ────────────────────────────────────────
  const [bankDetailsModalOpen, setBankDetailsModalOpen] = useState(false);
  const [bankDetails, setBankDetails] =
    useState<BankDetailsData>(emptyBankDetails);

  // ── Create Account drawer state ──────────────────────────────────────
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState<NewAccountData>(emptyAccount);
  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map(({ isoCode, name }) => ({
        label: name,
        value: isoCode,
      })),
    [],
  );
  const stateOptions = useMemo(
    () =>
      accountForm.countryCode
        ? State.getStatesOfCountry(accountForm.countryCode).map(
            ({ isoCode, name }) => ({ label: name, value: isoCode }),
          )
        : [],
    [accountForm.countryCode],
  );
  const cityOptions = useMemo(
    () =>
      accountForm.countryCode && accountForm.stateCode
        ? City.getCitiesOfState(
            accountForm.countryCode,
            accountForm.stateCode,
          ).map(({ name }) => ({ label: name, value: name }))
        : [],
    [accountForm.countryCode, accountForm.stateCode],
  );
  const districtOptions = cityOptions;

  const [implementsList, setImplementsList] = useState<any[]>([]);
  const companyId = localStorage.getItem("companyId");
  const financialYearId = localStorage.getItem("financialYearId");

  // ── API Fetchers ─────────────────────────────────────────────────────
  const getPurchase = useCallback(async () => {
    try {
      const res = await apiHelper.get(`/implement-purchase/${id}`);
      const purchase = res.data;

      setPartyId(String(purchase.accountId));
      setBillNo(purchase.billNo);
      setPurchaseBillNo(purchase.purchaseBillNo || "");
      setPurchaseLocation(purchase.purchaseLocation || "");
      setTerms(purchase.terms);
      setPurchaseDate(purchase.purchaseDate?.split("T")[0]);
      setDueDate(purchase.dueDate ? purchase.dueDate.split("T")[0] : "");
      setNarration(purchase.narration || "");
      setCashAccount(
        purchase.cashAccountId ? String(purchase.cashAccountId) : "",
      );
      setBankAccount(
        purchase.bankAccountId ? String(purchase.bankAccountId) : "",
      );

      setBankDetails({
        paymentMode: purchase.paymentMode || "UPI",
        chequeNo: purchase.chequeNo || "",
        chequeDate: purchase.chequeDate
          ? purchase.chequeDate.split("T")[0]
          : "",
        clearDate: purchase.clearDate ? purchase.clearDate.split("T")[0] : "",
        narration: purchase.bankNarration || "",
      });

      setFreightCharge(String(purchase.freightCharge || 0));
      setInsurance(String(purchase.insurance || 0));
      setOtherCharge(String(purchase.otherCharge || 0));
      setRoundAmount(String(purchase.roundAmount || 0));
      setBillVerify(
        purchase.verifyStatus === "verify" ? "verify" : "not_verify",
      );

      setRows(
        purchase.items.map((item: any) => ({
          id: String(item.id),
          implementId: item.implementId,
          operationType: item.operationType,
          item: item.itemName,
          itemCode: item.itemCode,
          hsn: item.hsnCode,
          unit: item.unit,
          categoryName: item.categoryName,
          brandName: item.brandName,
          modelName: item.modelName,
          variantName: item.variantName,
          colourName: item.colourName,
          chassisNo: item.chassisNo || "",
          engineNo: item.engineNo || "",
          serialNo: item.serialNo || "",
          qty: item.qty,
          pPrice: String(item.purchaseRate),
          gstPercent: String(item.gstPercent),
          gstAmount: item.gstAmount,
          netAmount: String(item.netAmount),
          status: item.status,
        })),
      );
    } catch (err) {
      console.log(err);
    }
  }, [id]);

const fetchImplements = async () => {
  try {
    const res = await apiHelper.get("/implement");
    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];

    // Sirf ACTIVE implements purchase me dikhao
    setImplementsList(
      list.filter(
        (item: any) => String(item.status).toUpperCase() === "ACTIVE",
      ),
    );
  } catch (err) {
    console.log(err);
    setImplementsList([]);
  }
};

  const getBillNo = useCallback(async () => {
    try {
      const res = await apiHelper.get(
        `/implement-purchase/bill-no?companyId=${companyId}&financialYearId=${financialYearId}`,
      );
      setBillNo(res.billNo);
    } catch (error) {
      console.error(error);
    }
  }, [companyId, financialYearId]);

  const getParties = async () => {
    try {
      const res = await apiHelper.get("/accounts");
      const accounts = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      const mapped = accounts
        .filter((acc: any) =>
          [
            "Supplier",
            "Sundry Creditors",
            "Sundry Creditor (internal)",
          ].includes(acc.group),
        )
        .map((acc: any) => ({
          id: String(acc.id),
          name: acc.accountName,
          mobile: acc.mobile,
          stateCode: acc.stateCode,
        }));
      setParties(mapped);
      return mapped;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const getAccounts = async () => {
    try {
      const res = await apiHelper.get("/accounts");
      const accounts = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      setCashAccounts(
        accounts.filter((acc: any) =>
          ["Cash-in-Hand", "Cash Account", "Cash"].includes(acc.group),
        ),
      );
      setBankAccounts(
        accounts.filter((acc: any) =>
          ["Bank Accounts", "Bank Account", "Bank"].includes(acc.group),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const [company, setCompany] = useState<any>(null);
  const getCompany = async () => {
    try {
      const res = await apiHelper.get("/company");
      setCompany(Array.isArray(res.data) ? res.data[0] : res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPurchase = useCallback(async () => {
    if (isEdit) {
      await getPurchase();
    } else {
      await getBillNo();
    }
  }, [getBillNo, getPurchase, isEdit]);

  useEffect(() => {
    const loadData = async () => {
      await getParties();
      await getAccounts();
      await getCompany();
      await fetchImplements();
      await loadPurchase();
    };
    loadData();
  }, [id, loadPurchase]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const selectedParty = parties.find((p) => p.id === partyId);
  const isPartySelected = !!partyId;
  const isSameState = company?.stateCode === selectedParty?.stateCode;

  const groupOptions = [
    { label: "Supplier", value: "Supplier" },
    { label: "Sundry Creditors", value: "Sundry Creditors" },
    {
      label: "Sundry Creditor (internal)",
      value: "Sundry Creditor (internal)",
    },
  ];

  // ── Draft Row Handlers ───────────────────────────────────────────────
  const calculateNetAmount = (qty: number, price: number, gst: number) => {
    const basicAmount = qty * price;
    const gstAmount = (basicAmount * gst) / 100;
    const netAmount = basicAmount + gstAmount;
    return netAmount.toFixed(2);
  };

  const updateDraft = (key: keyof ItemRow, value: string | number) => {
    setDraft((prev) => {
      const updated = { ...prev, [key]: value };
      updated.netAmount = calculateNetAmount(
        Number(updated.qty || 0),
        Number(updated.pPrice || 0),
        Number(updated.gstPercent || 0),
      );
      return updated;
    });
  };

  // Draft ki item type se field enable/disable decide hoti hai
  const draftHasItem = !!draft.implementId;
  const draftIsTractor = isTractorOperated(draft.operationType);
  const draftIsSelf = isSelfOperated(draft.operationType);
  const chassisEngineDisabled = !draftHasItem || draftIsTractor;
  const serialDisabled = !draftHasItem;

  const filteredImplements = useMemo(() => {
    const q = implementSearch.toLowerCase();
    return (implementsList || []).filter((a: any) => {
      const text =
        `${a.itemName} ${a.itemCode} ${a.hsnCode} ${a.brand?.brandName || ""} ${a.model?.modelName || ""} ${a.variant?.variantName || ""}`.toLowerCase();
      if (!text.includes(q)) return false;
      if (implementTypeFilter === "Self") return isSelfOperated(a.operationType);
      if (implementTypeFilter === "Tractor")
        return isTractorOperated(a.operationType);
      return true;
    });
  }, [implementSearch, implementsList, implementTypeFilter]);

  const handleImplementSelect = (a: any) => {
    const price = Number(a.purchasePrice || 0);
    const gst = parseGst(a.taxSlab);
    const tractorOp = isTractorOperated(a.operationType);

    setDraft((prev) => ({
      ...prev,
      implementId: a.id,
      operationType: a.operationType,
      item: a.itemName,
      itemCode: a.itemCode,
      hsn: a.hsnCode || "",
      unit: a.unit || "",
      categoryName: a.category?.categoryName || "",
      brandName: a.brand?.brandName || "",
      modelName: a.model?.modelName || "",
      variantName: a.variant?.variantName || "",
      colourName: a.colour?.colourName || "",
      // Tractor Operated => chassis & engine disabled, isliye clear
      chassisNo: tractorOp ? "" : prev.chassisNo,
      engineNo: tractorOp ? "" : prev.engineNo,
      qty: 1,
      pPrice: String(price),
      gstPercent: String(gst),
      netAmount: calculateNetAmount(1, price, gst),
    }));

    setImplementDrawerOpen(false);
    setImplementSearch("");
    setImplementTypeFilter("All");
  };

  const saveDraftRow = () => {
    if (!draft.implementId) return toast.warning("Please select an Implement item");
    if (!draft.itemCode.trim()) return toast.warning("Item Code is missing");
    if (!draft.hsn.trim()) return toast.warning("HSN is missing for this item");
    if (!draft.unit.trim()) return toast.warning("Unit is missing for this item");
    if (!draft.pPrice.trim())
      return toast.warning("Please enter Purchase Price");
    if (!draft.gstPercent.trim()) return toast.warning("Please enter GST %");

    const chassis = draft.chassisNo.trim();
    const engine = draft.engineNo.trim();
    const serial = draft.serialNo.trim();

    if (isSelfOperated(draft.operationType)) {
      if (!chassis) return toast.warning("Please enter Chassis No");
      if (!engine) return toast.warning("Please enter Engine No");
      if (!serial) return toast.warning("Please enter Serial No");
    } else if (isTractorOperated(draft.operationType)) {
      if (!serial) return toast.warning("Please enter Serial No");
    }

    // Duplicate check (same bill ke andar)
    const dup = rows.find(
      (r) =>
        (serial && r.serialNo === serial) ||
        (chassis && r.chassisNo === chassis) ||
        (engine && r.engineNo === engine),
    );
    if (dup)
      return toast.error(
        "Chassis No / Engine No / Serial No already added in this bill",
      );

    setRows((prev) => [
      ...prev,
      {
        ...draft,
        chassisNo: chassis,
        engineNo: engine,
        serialNo: serial,
        qty: 1,
      },
    ]);

    setDraft(emptyDraft());
    toast.success("Item added successfully!");
  };

  const removeRow = (rowId: string) =>
    setRows((r) => r.filter((row) => row.id !== rowId));

  // ── Derived totals ──────────────────────────────────────────────────
  const totalQuantity = rows.reduce(
    (sum, row) => sum + Number(row.qty || 0),
    0,
  );
  const freightNum = Number(freightCharge) || 0;
  const insuranceNum = Number(insurance) || 0;
  const otherNum = Number(otherCharge) || 0;
  const roundNum = Number(roundAmount) || 0;
  const freightInsuranceOther = freightNum + insuranceNum + otherNum;

  const totalValue = rows.reduce((sum, row) => {
    const qty = Number(row.qty) || 0;
    const purchasePrice = Number(row.pPrice) || 0;
    return sum + qty * purchasePrice;
  }, 0);

  let totalGST = 0;
  let totalOtherCharges = 0;

  rows.forEach((row) => {
    const qty = Number(row.qty) || 0;
    const purchasePrice = Number(row.pPrice) || 0;
    const gstPercent = Number(row.gstPercent) || 0;
    const itemBasicAmount = purchasePrice * qty;
    const itemOtherCharge =
      totalValue > 0
        ? (itemBasicAmount / totalValue) * freightInsuranceOther
        : 0;
    const taxableAmount = itemBasicAmount + itemOtherCharge;
    const gstAmount = isPartySelected ? (taxableAmount * gstPercent) / 100 : 0;

    totalOtherCharges += itemOtherCharge;
    totalGST += gstAmount;
  });

  const totalAmount = Number(totalValue.toFixed(2));
  const newTaxableValue = Number((totalValue + totalOtherCharges).toFixed(2));
  const totalCgst =
    isPartySelected && isSameState ? Number((totalGST / 2).toFixed(2)) : 0;
  const totalSgst =
    isPartySelected && isSameState ? Number((totalGST / 2).toFixed(2)) : 0;
  const totalIgst =
    isPartySelected && !isSameState ? Number(totalGST.toFixed(2)) : 0;
  const grandTotal = Number((newTaxableValue + totalGST + roundNum).toFixed(2));

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleBack = () => navigate("/purchase/Implement-purchase");

  // ── Save Bill ───────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      if (!companyId || !financialYearId)
        return toast.error("Company or financial year is not selected");
      if (!purchaseBillNo.trim())
        return toast.error("Purchase Bill No is required");
      if (!partyId) return toast.error("Please select Supplier Name");
      if (rows.length === 0) return toast.error("Please add at least one item");
      if (terms === "Cash" && !cashAccount)
        return toast.error("Please select Cash Account");
      if (terms === "Bank" && !bankAccount)
        return toast.error("Please select Bank Account");

      const payload = {
        companyId: Number(companyId),
        financialYearId: Number(financialYearId),
        accountId: partyId,
        purchaseDate: purchaseDate || date,
        purchaseBillNo,
        purchaseLocation,
        dueDate,
        terms,
        narration,
        cashAccountId: terms === "Cash" ? cashAccount : null,
        bankAccountId: terms === "Bank" ? bankAccount : null,
        paymentMode: bankDetails.paymentMode,
        chequeNo: bankDetails.chequeNo,
        chequeDate: bankDetails.chequeDate,
        clearDate: bankDetails.clearDate,
        bankNarration: bankDetails.narration,
        freightCharge: freightNum,
        insurance: insuranceNum,
        otherCharge: otherNum,
        roundAmount: roundNum,
        taxableValue: newTaxableValue,
        totalQty: totalQuantity,
        totalAmount,
        cgst: totalCgst,
        sgst: totalSgst,
        igst: totalIgst,
        grandTotal,
        verifyStatus: billVerify,
        items: rows.map((row) => ({
          implementId: row.implementId || null,
          operationType: row.operationType,
          item: row.item,
          itemCode: row.itemCode,
          hsn: row.hsn,
          unit: row.unit,
          categoryName: row.categoryName,
          brandName: row.brandName,
          modelName: row.modelName,
          variantName: row.variantName,
          colourName: row.colourName,
          // Tractor Operated me chassis/engine hamesha null jayega
          chassisNo: isTractorOperated(row.operationType)
            ? null
            : row.chassisNo || null,
          engineNo: isTractorOperated(row.operationType)
            ? null
            : row.engineNo || null,
          serialNo: row.serialNo || null,
          qty: Number(row.qty),
          stock: Number(row.qty),
          pPrice: Number(row.pPrice),
          gstPercent: Number(row.gstPercent),
          gstAmount:
            (Number(row.pPrice) * Number(row.qty) * Number(row.gstPercent)) /
            100,
          netAmount: Number(row.netAmount),
        })),
      };

      if (isEdit) {
        await apiHelper.put(`/implement-purchase/${id}`, payload);
        toast.success("Purchase updated successfully!");
      } else {
        await apiHelper.post("/implement-purchase", payload);
        toast.success("Purchase created successfully!");
      }

      navigate("/purchase/Implement-purchase");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save purchase");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white shadow-sm dark:bg-gray-800">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:border-gray-700">
          <h1 className="text-lg font-bold text-blue-600 underline sm:text-xl dark:text-blue-400">
            Implement Purchase Bill
          </h1>
          <button
            onClick={handleBack}
            className="bg-primary-500 hover:bg-primary-600 inline-flex w-full cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors sm:w-auto sm:px-5"
          >
            <ArrowLeftIcon className="mr-1.5 size-4" />
            Back
          </button>
        </div>

        {/* Top fields */}
        <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-4 md:p-6 lg:grid-cols-4 xl:grid-cols-6">
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <DatePicker
              placeholder="Select Date"
              options={{ disableMobile: true }}
              value={date ? [new Date(date)] : []}
              onChange={(selectedDates: Date[]) => {
                if (selectedDates && selectedDates[0]) {
                  const selectedDate = selectedDates[0];
                  setDate(
                    `${selectedDate.getFullYear()}-${String(
                      selectedDate.getMonth() + 1,
                    ).padStart(2, "0")}-${String(
                      selectedDate.getDate(),
                    ).padStart(2, "0")}`,
                  );
                }
              }}
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
              onChange={(val: any) => {
                const selectedTerm = val.value as TermsType;
                setTerms(selectedTerm);
                if (selectedTerm !== "Credit") {
                  setDueDate("");
                }
              }}
              displayField="label"
            />
          </div>

          {terms === "Cash" && (
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cash Account
              </label>
              <Combobox
                data={cashAccounts.map((acc) => ({
                  label: acc.accountName,
                  value: acc.id,
                  mobile: acc.mobile,
                  openingBalance: acc.openingBalance,
                }))}
                value={
                  cashAccounts.find((acc) => acc.id === cashAccount)
                    ? {
                        label:
                          cashAccounts.find((acc) => acc.id === cashAccount)
                            ?.accountName || "",
                        value: cashAccount,
                        mobile:
                          cashAccounts.find((acc) => acc.id === cashAccount)
                            ?.mobile || "",
                        openingBalance:
                          cashAccounts.find((acc) => acc.id === cashAccount)
                            ?.openingBalance || 0,
                      }
                    : null
                }
                onChange={(val: any) => setCashAccount(val.value)}
                displayField="label"
                placeholder="Search Cash Account"
                searchFields={["label", "mobile"]}
                columns={[
                  { header: "Account", field: "label", width: "2fr" },
                  { header: "Opening", field: "openingBalance", width: "1fr" },
                ]}
              />
            </div>
          )}

          {terms === "Bank" && (
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Account
              </label>
              <div className="flex w-full items-end gap-2">
                <div className="min-w-0 flex-1">
                  <Combobox
                    data={bankAccounts.map((acc) => ({
                      label: acc.accountName,
                      value: acc.id,
                      mobile: acc.mobile,
                      openingBalance: acc.openingBalance,
                    }))}
                    value={(() => {
                      const selected = bankAccounts.find(
                        (acc) => Number(acc.id) === Number(bankAccount),
                      );
                      return selected
                        ? {
                            label: selected.accountName,
                            value: selected.id,
                            mobile: selected.mobile,
                            openingBalance: selected.openingBalance,
                          }
                        : null;
                    })()}
                    onChange={(val: any) => {
                      setBankAccount(val.value);
                    }}
                    displayField="label"
                    placeholder="Search Bank Account"
                    searchFields={["label", "mobile"]}
                    columns={[
                      { header: "Account", field: "label", width: "2fr" },
                      {
                        header: "Opening",
                        field: "openingBalance",
                        width: "1fr",
                      },
                    ]}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setBankDetailsModalOpen(true)}
                  className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
                  title="Add Bank Details"
                >
                  <BuildingOffice2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Supplier Name
            </label>
            <div className="flex w-full gap-2">
              <div className="min-w-0 flex-1">
                <Combobox
                  data={parties.map((p) => ({
                    label: p.name,
                    mobile: p.mobile,
                    displayName: `${p.name} (${p.mobile})`,
                    value: p.id,
                  }))}
                  value={
                    parties.find((x) => x.id === partyId)
                      ? {
                          label:
                            parties.find((x) => x.id === partyId)?.name || "",
                          displayName: `${parties.find((x) => x.id === partyId)?.name} (${parties.find((x) => x.id === partyId)?.mobile})`,
                          value: partyId,
                        }
                      : null
                  }
                  onChange={(val: any) => setPartyId(val.value)}
                  displayField="displayName"
                  searchFields={["displayName", "mobile"]}
                  placeholder="Search Party"
                />
              </div>
              <button
                onClick={() => setAccountModalOpen(true)}
                className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-xl text-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
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
              value={purchaseDate ? new Date(purchaseDate) : undefined}
              options={{ disableMobile: true }}
              onChange={(selectedDates: Date[]) => {
                const val = selectedDates[0];
                if (val instanceof Date && !isNaN(val.getTime())) {
                  setPurchaseDate(val.toISOString().split("T")[0]);
                }
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
          {terms === "Credit" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <DatePicker
                value={dueDate ? new Date(dueDate) : undefined}
                options={{ disableMobile: true }}
                onChange={(selectedDates: Date[]) => {
                  const val = selectedDates[0];
                  if (val instanceof Date && !isNaN(val.getTime())) {
                    setDueDate(val.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select date..."
                className="w-full"
              />
            </div>
          )}
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
          <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
            <div className="h-96 overflow-y-auto">
              <table className="w-full min-w-[1300px] border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className={thClass}>ITEM</th>
                    <th className={thClass}>ITEM NAME</th>
                    <th className={thClass}>ITEM CODE</th>
                    {/* <th className={thClass}>TYPE</th> */}
                    <th className={thClass}>COLOR</th>
                    <th className={thClass}>CHASSIS NO</th>
                    <th className={thClass}>ENGINE NO</th>
                    <th className={thClass}>SERIAL NO</th>
                    <th className={thClass}>QTY</th>
                    <th className={thClass}>RATE PER</th>
                    <th className={thClass}>GST %</th>
                    <th className={thClass}>AMOUNT</th>
                    <th className={thClass}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Draft row */}
                  <tr className="sticky top-9 z-10 bg-white dark:bg-gray-800">
                    <td className={`${draftTd} text-center`}>
                      <button
                        onClick={() => setImplementDrawerOpen(true)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 text-white transition hover:bg-blue-700"
                        title="Add Item"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Select Item"
                        value={draft.item}
                        readOnly
                        onClick={() => setImplementDrawerOpen(true)}
                        className={`${draftInput} cursor-pointer`}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Item Code"
                        value={draft.itemCode}
                        readOnly
                        className={`${draftInput} bg-gray-50 dark:bg-gray-700`}
                      />
                    </td>
                    {/* <td className={draftTd}>
                      <input
                        placeholder="Type"
                        value={draft.operationType || ""}
                        readOnly
                        className={`${draftInput} bg-gray-50 dark:bg-gray-700`}
                      />
                    </td> */}
                    <td className={draftTd}>
                      <input
                        placeholder="Color"
                        value={draft.colourName || ""}
                        readOnly
                        className={`${draftInput} bg-gray-50 dark:bg-gray-700`}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Chassis"
                        value={draft.chassisNo}
                        disabled={chassisEngineDisabled}
                        onChange={(e) =>
                          updateDraft("chassisNo", e.target.value)
                        }
                        className={`${draftInput} ${draftDisabled}`}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Engine"
                        value={draft.engineNo}
                        disabled={chassisEngineDisabled}
                        onChange={(e) => updateDraft("engineNo", e.target.value)}
                        className={`${draftInput} ${draftDisabled}`}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Serial No"
                        value={draft.serialNo}
                        disabled={serialDisabled}
                        onChange={(e) => updateDraft("serialNo", e.target.value)}
                        className={`${draftInput} ${draftDisabled}`}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        type="number"
                        min={1}
                        value={draft.qty}
                        readOnly
                        title="Har chassis/engine/serial ke liye qty 1"
                        className={`w-20 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-sm outline-none dark:border-gray-600 dark:bg-gray-700`}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Rate"
                        value={draft.pPrice}
                        onChange={(e) => updateDraft("pPrice", e.target.value)}
                        className={draftInput}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="GST"
                        value={draft.gstPercent}
                        onChange={(e) =>
                          updateDraft("gstPercent", e.target.value)
                        }
                        className={draftInput}
                      />
                    </td>
                    <td className={draftTd}>
                      <input
                        placeholder="Amount"
                        value={draft.netAmount}
                        readOnly
                        className={`${draftInput} bg-gray-50 dark:bg-gray-700`}
                      />
                    </td>
                    <td className={`${draftTd} text-center`}>
                      <button
                        onClick={saveDraftRow}
                        disabled={!draft.implementId}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-white ${
                          draft.implementId
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
                      <td
                        className={`${tdClass} text-center font-medium text-gray-500 dark:text-gray-400`}
                      >
                        {index + 1}
                      </td>
                      <td
                        className={`${tdClass} font-medium text-gray-900 dark:text-gray-200`}
                      >
                        {r.item}
                      </td>
                      <td className={tdClass}>{r.itemCode}</td>
                      {/* <td className={tdClass}>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
                            isTractorOperated(r.operationType)
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {r.operationType || "-"}
                        </span>
                      </td> */}
                      <td className={tdClass}>{r.colourName || "-"}</td>
                      <td className={tdClass}>{r.chassisNo || "-"}</td>
                      <td className={tdClass}>{r.engineNo || "-"}</td>
                      <td className={tdClass}>{r.serialNo || "-"}</td>
                      <td
                        className={`${tdClass} text-center font-semibold text-gray-900 dark:text-gray-200`}
                      >
                        {r.qty}
                      </td>
                      <td className={`${tdClass} text-right`}>₹{r.pPrice}</td>
                      <td className={`${tdClass} text-center`}>
                        {r.gstPercent}%
                      </td>
                      <td
                        className={`${tdClass} text-right font-semibold text-gray-900 dark:text-gray-200`}
                      >
                        ₹{r.netAmount}
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <button
                          disabled={r.status === "Inward"}
                          onClick={() => removeRow(r.id)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                            r.status === "Inward"
                              ? "cursor-not-allowed bg-gray-400 text-white"
                              : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Empty state */}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={13} className="py-12 text-center">
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
                ₹{fmt(totalValue)}
              </span>
            </span>
          </div>
        </div>

        {/* Charges and summary */}
        <div className="grid grid-cols-1 gap-4 px-3 pb-4 sm:px-4 sm:pb-6 md:px-6 lg:grid-cols-5">
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

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bill Status:
                </span>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Radio
                    checked={billVerify === "not_verify"}
                    disabled={billVerify === "verify"}
                    onChange={() => setBillVerify("not_verify")}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Not Verify
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Radio
                    checked={billVerify === "verify"}
                    disabled={billVerify === "verify"}
                    onChange={() => setBillVerify("verify")}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Verify
                  </span>
                </label>
              </div>
            </div>
          </div>

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
                    ₹{fmt(totalValue)}
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
                {isPartySelected &&
                  (isSameState ? (
                    <>
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          CGST
                        </span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          ₹{fmt(totalCgst)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          SGST
                        </span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          ₹{fmt(totalSgst)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        IGST
                      </span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        ₹{fmt(totalIgst)}
                      </span>
                    </div>
                  ))}
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
            className="bg-primary-500 hover:bg-primary-500 w-full rounded-lg px-8 py-2.5 text-sm font-bold text-white transition-colors sm:w-auto sm:px-12 sm:py-3"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* ========== RIGHT SIDE DRAWER MODALS ========== */}

      {/* Implement Selection Drawer */}
      {implementDrawerOpen && createPortal(
        <div className="fixed inset-0 z-100 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setImplementDrawerOpen(false);
              setImplementSearch("");
            }}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-5xl transform bg-white shadow-2xl transition-transform sm:w-3/4 lg:w-2/3 dark:bg-gray-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  Select Implement
                </h2>
                <button
                  onClick={() => {
                    setImplementDrawerOpen(false);
                    setImplementSearch("");
                  }}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      placeholder="Search implement, code, brand, model..."
                      value={implementSearch}
                      onChange={(e) => setImplementSearch(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                  <div className="sm:w-48">
                    <Listbox
                      data={operationFilterOptions}
                      value={
                        operationFilterOptions.find(
                          (o) => o.value === implementTypeFilter,
                        ) || operationFilterOptions[0]
                      }
                      onChange={(opt: any) => setImplementTypeFilter(opt.value)}
                      displayField="label"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left whitespace-nowrap dark:bg-gray-700">
                        <th className="w-12 p-2">#</th>
                        <th className="p-2">Item Name</th>
                        <th className="p-2">Item Code</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Brand</th>
                        <th className="p-2">Model</th>
                        <th className="p-2">Variant</th>
                        <th className="p-2">Colour</th>
                        <th className="p-2">HSN</th>
                        <th className="p-2">GST</th>
                        <th className="p-2">Purchase Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredImplements.map((v) => (
                        <tr
                          key={v.id}
                          className="border-t border-gray-200 whitespace-nowrap dark:border-gray-700"
                        >
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleImplementSelect(v)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded bg-green-600 text-white hover:bg-green-700"
                            >
                              ✓
                            </button>
                          </td>
                          <td className="p-2">{v.itemName}</td>
                          <td className="p-2">{v.itemCode}</td>
                          <td className="p-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                isTractorOperated(v.operationType)
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {v.operationType}
                            </span>
                          </td>
                          <td className="p-2">{v.brand?.brandName || "-"}</td>
                          <td className="p-2">{v.model?.modelName || "-"}</td>
                          <td className="p-2">
                            {v.variant?.variantName || "-"}
                          </td>
                          <td className="p-2">{v.colour?.colourName || "-"}</td>
                          <td className="p-2">{v.hsnCode || "-"}</td>
                          <td className="p-2">{v.taxSlab || "-"}</td>
                          <td className="p-2">₹{v.purchasePrice}</td>
                        </tr>
                      ))}
                      {filteredImplements.length === 0 && (
                        <tr>
                          <td
                            colSpan={11}
                            className="p-4 text-center text-gray-500"
                          >
                            No implements match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>,
      document.body,
  )}

      {/* Bank Details - Right Drawer */}
      {bankDetailsModalOpen && createPortal(
        <div className="fixed inset-0 z-100 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setBankDetailsModalOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-lg transform bg-white shadow-2xl transition-transform sm:w-3/4 lg:w-2/5 dark:bg-gray-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Bank Details
                </h2>
                <button
                  onClick={() => setBankDetailsModalOpen(false)}
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
                            setBankDetails((b) => ({
                              ...b,
                              paymentMode: opt.value,
                            }))
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
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
                          setBankDetails((b) => ({
                            ...b,
                            chequeNo: e.target.value,
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cheque Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        value={
                          bankDetails.chequeDate
                            ? new Date(bankDetails.chequeDate)
                            : undefined
                        }
                        options={{ disableMobile: true }}
                        onChange={(selectedDates: Date[]) => {
                          const val = selectedDates[0];
                          if (val instanceof Date) {
                            setBankDetails((b) => ({
                              ...b,
                              chequeDate: val.toISOString().split("T")[0],
                            }));
                          }
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
                      setBankDetails((b) => ({
                        ...b,
                        narration: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 sm:p-6 dark:border-gray-700">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    onClick={() => setBankDetailsModalOpen(false)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setBankDetailsModalOpen(false)}
                    className="bg-primary-500 hover:bg-primary-500 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white sm:w-auto sm:px-6"
                  >
                    Save Bank Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
       document.body,
  )}

      {/* Create Account - Right Drawer */}
      {accountModalOpen && createPortal(
        <div className="fixed inset-0 z-100 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setAccountModalOpen(false);
              setAccountForm(emptyAccount);
            }}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-3xl transform bg-white shadow-2xl transition-transform sm:w-3/4 lg:w-1/2 dark:bg-gray-800">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Create Account
                </h2>
                <button
                  onClick={() => {
                    setAccountModalOpen(false);
                    setAccountForm(emptyAccount);
                  }}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter Account Name"
                      value={accountForm.accountName}
                      onChange={(e) =>
                        setAccountForm((f) => ({
                          ...f,
                          accountName: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Group
                    </label>
                    <Listbox
                      data={groupOptions}
                      value={
                        groupOptions.find(
                          (x) => x.value === accountForm.group,
                        ) || null
                      }
                      onChange={(val: any) =>
                        setAccountForm((f) => ({
                          ...f,
                          group: val?.value || "",
                        }))
                      }
                      placeholder="Select Group"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Mobile"
                      value={accountForm.mobile}
                      onChange={(e) =>
                        setAccountForm((f) => ({
                          ...f,
                          mobile: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={countryOptions}
                      displayField="label"
                      searchFields={["label"]}
                      placeholder="Search Country"
                      value={
                        countryOptions.find(
                          (o) => o.value === accountForm.countryCode,
                        ) || null
                      }
                      onChange={(selected: any) =>
                        setAccountForm((f) => ({
                          ...f,
                          countryCode: selected?.value || "",
                          country: selected?.label || "",
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={stateOptions}
                      displayField="label"
                      searchFields={["label"]}
                      placeholder="Search State"
                      value={
                        stateOptions.find(
                          (o) => o.value === accountForm.stateCode,
                        ) || null
                      }
                      onChange={(selected: any) =>
                        setAccountForm((f) => ({
                          ...f,
                          stateCode: selected?.value || "",
                          state: selected?.label || "",
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      District <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={districtOptions}
                      displayField="label"
                      searchFields={["label"]}
                      placeholder="Search District"
                      value={
                        districtOptions.find(
                          (o) => o.value === accountForm.district,
                        ) || null
                      }
                      onChange={(selected: any) =>
                        setAccountForm((f) => ({
                          ...f,
                          district: selected?.value || "",
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={cityOptions}
                      displayField="label"
                      searchFields={["label"]}
                      placeholder="Search City"
                      value={
                        cityOptions.find((o) => o.value === accountForm.city) ||
                        null
                      }
                      onChange={(selected: any) =>
                        setAccountForm((f) => ({
                          ...f,
                          city: selected?.value || "",
                        }))
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter Address"
                      value={accountForm.address}
                      onChange={(e) =>
                        setAccountForm((f) => ({
                          ...f,
                          address: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      PAN Card <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="PAN Card Number"
                      value={accountForm.panCard}
                      onChange={(e) =>
                        setAccountForm((f) => ({
                          ...f,
                          panCard: e.target.value.toUpperCase(),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                      Aadhar Card No <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Aadhar Number"
                      value={accountForm.aadharCard}
                      onChange={(e) =>
                        setAccountForm((f) => ({
                          ...f,
                          aadharCard: e.target.value,
                        }))
                      }
                      className="w-full"
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
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAccountModalOpen(false)}
                    className="bg-primary-500 hover:bg-primary-500 w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white sm:w-auto sm:px-6"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
       document.body,
  )}
    </div>
  );
};

export default ImplementPurchaseBill;