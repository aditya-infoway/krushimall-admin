// src/app/pages/implement/createimplement.tsx
import React, { useState, useEffect, Fragment } from "react";
import {
  Dialog, DialogPanel, Transition, TransitionChild,
  Menu, MenuButton, MenuItems, MenuItem,
} from "@headlessui/react";
import {
  PencilIcon, TrashIcon, EllipsisHorizontalIcon, XMarkIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Search, Filter, Plus } from "lucide-react";
import { RiFileExcel2Fill, RiFilePdfFill } from "react-icons/ri";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { Checkbox, Input, Radio, Button } from "@/components/ui";
import { Combobox } from "@/components/shared/form/Combobox";
import { Listbox } from "@/components/shared/form/StyledListbox";
import apiHelper from "@/utils/apiHelper";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// ─── Types ──────────────────────────────────────────────────────────────────
interface ImplementItem {
  id: number;
  operationType: "SELF_OPERATED" | "TRACTOR_OPERATED";
  categoryId: number;
  brandId: number;
  modelId: number;
  variantId: number;
  colourId: number;
  category?: { id: number; categoryName: string };
  brand?: { id: number; brandName: string };
  model?: { id: number; modelName: string };
  variant?: { id: number; variantName: string };
  colour?: { id: number; colourName: string; colourCode: string };
  itemCode: string;
  itemName: string;
  hsnCode: string;
  taxSlab: string;
  unit: string;
  purchasePrice: number;
  salesPrice: number;
  mrp: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

interface FormValues {
  operationType: "SELF_OPERATED" | "TRACTOR_OPERATED";
  categoryId: string;
  brandId: string;
  modelId: string;
  variantId: string;
  colourId: string;
  itemCode: string;
  itemName: string;
  hsnCode: string;
  taxSlab: string;
  unit: string;
  purchasePrice: string;
  salesPrice: string;
  mrp: string;
  status: "ACTIVE" | "INACTIVE";
}

// ─── Options ──────────────────────────────────────────────────────────────
const entriesOptions = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 30, name: "30" },
  { id: 40, name: "40" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const unitOptions = [
  { label: "PCS", value: "PCS" },
  { label: "SET", value: "SET" },
  { label: "BOX", value: "BOX" },
  { label: "KG", value: "KG" },
];

const taxSlabOptions = [
  { label: "GST 0%", value: "0" },
  { label: "GST 5%", value: "5" },
  { label: "GST 12%", value: "12" },
  { label: "GST 18%", value: "18" },
  { label: "GST 28%", value: "28" },
];

const statusFilterOptions = [
  { id: "All", name: "All Statuses" },
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
];

const operationFilterOptions = [
  { id: "All", name: "All Operations" },
  { id: "SELF_OPERATED", name: "Self Operated" },
  { id: "TRACTOR_OPERATED", name: "Tractor Operated" },
];

// ─── Main Component ──────────────────────────────────────────────────────
const CreateImplement = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [items, setItems] = useState<ImplementItem[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Dropdown data
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [colours, setColours] = useState<any[]>([]);

  const [filteredBrands, setFilteredBrands] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [filteredVariants, setFilteredVariants] = useState<any[]>([]);
  const [filteredColours, setFilteredColours] = useState<any[]>([]);

  // Filters
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOperation, setFilterOperation] = useState("All");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmState, setConfirmState] = useState<"pending" | "success" | "error">("pending");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [formData, setFormData] = useState<FormValues>({
    operationType: "SELF_OPERATED",
    categoryId: "",
    brandId: "",
    modelId: "",
    variantId: "",
    colourId: "",
    itemCode: "",
    itemName: "",
    hsnCode: "",
    taxSlab: "",
    unit: "",
    purchasePrice: "",
    salesPrice: "",
    mrp: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Fetch Data ──────────────────────────────────────────────────────
  const getImplements = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.get("/implement");
      let data = response?.data?.data || response?.data || response;
      if (!Array.isArray(data)) data = [];
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch implements:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [catRes, brandRes, modelRes, variantRes, colourRes] = await Promise.all([
        apiHelper.get("/implement-category"),
        apiHelper.get("/implement-brand"),
        apiHelper.get("/implement-model"),
        apiHelper.get("/implement-variant"),
        apiHelper.get("/implement-colour"),
      ]);
      
      const getArr = (r: any) => r?.data?.data || r?.data || r || [];
      
      setCategories(getArr(catRes).filter((c: any) => c.status === "ACTIVE"));
      setBrands(getArr(brandRes).filter((b: any) => b.status === "ACTIVE"));
      setModels(getArr(modelRes).filter((m: any) => m.status === "ACTIVE"));
      setVariants(getArr(variantRes).filter((v: any) => v.status === "ACTIVE"));
      setColours(getArr(colourRes).filter((c: any) => c.status === "ACTIVE"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) {
        await getImplements();
        await fetchDropdowns();
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  // Cascade for FORM
  useEffect(() => {
    if (formData.categoryId) {
      setFilteredBrands(brands.filter((b) => b.categoryId === Number(formData.categoryId)));
    } else {
      setFilteredBrands([]);
    }
  }, [formData.categoryId, brands]);

  useEffect(() => {
    if (formData.brandId) {
      setFilteredModels(models.filter((m) => m.brandId === Number(formData.brandId)));
    } else {
      setFilteredModels([]);
    }
  }, [formData.brandId, models]);

  useEffect(() => {
    if (formData.modelId) {
      setFilteredVariants(variants.filter((v) => v.modelId === Number(formData.modelId)));
    } else {
      setFilteredVariants([]);
    }
  }, [formData.modelId, variants]);

  useEffect(() => {
    if (formData.variantId) {
      setFilteredColours(colours.filter((c) => c.variantId === Number(formData.variantId)));
    } else {
      setFilteredColours([]);
    }
  }, [formData.variantId, colours]);

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleInputChange = (field: keyof FormValues, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleOpenAddDrawer = () => {
    setEditId(null);
    setFormData({
      operationType: "SELF_OPERATED",
      categoryId: "",
      brandId: "",
      modelId: "",
      variantId: "",
      colourId: "",
      itemCode: "",
      itemName: "",
      hsnCode: "",
      taxSlab: "",
      unit: "",
      purchasePrice: "",
      salesPrice: "",
      mrp: "",
      status: "ACTIVE",
    });
    setErrors({});
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (item: ImplementItem) => {
    setEditId(item.id);
    setFormData({
      operationType: item.operationType,
      categoryId: String(item.categoryId || ""),
      brandId: String(item.brandId || ""),
      modelId: String(item.modelId || ""),
      variantId: String(item.variantId || ""),
      colourId: String(item.colourId || ""),
      itemCode: item.itemCode || "",
      itemName: item.itemName || "",
      hsnCode: item.hsnCode || "",
      taxSlab: item.taxSlab || "",
      unit: item.unit || "",
      purchasePrice: String(item.purchasePrice || ""),
      salesPrice: String(item.salesPrice || ""),
      mrp: String(item.mrp || ""),
      status: item.status,
    });
    setShowDrawer(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setIsBulkDelete(false);
    setConfirmState("pending");
    setShowConfirmModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDelete(true);
    setConfirmState("pending");
    setShowConfirmModal(true);
  };

  const performDelete = async () => {
    setConfirmLoading(true);
    try {
      if (isBulkDelete) {
        await Promise.all(selectedIds.map((id) => apiHelper.delete(`/implement/${id}`)));
        toast.success(`${selectedIds.length} implements deleted successfully!`);
        setSelectedIds([]);
        await getImplements();
        setCurrentPage(1);
        setConfirmState("success");
      } else {
        if (deleteTargetId === null) return;
        await apiHelper.delete(`/implement/${deleteTargetId}`);
        toast.success("Implement deleted successfully!");
        await getImplements();
        setDeleteTargetId(null);
        setConfirmState("success");
      }
      setTimeout(() => setShowConfirmModal(false), 1500);
    } catch (error: any) {
      console.error("Delete failed:", error);
      setConfirmState("error");
      toast.error(error.response?.data?.message || "Failed to delete. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));

    try {
      await apiHelper.put(`/implement/${id}`, { ...item, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update status");
      await getImplements();
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.brandId) newErrors.brandId = "Brand is required";
    if (!formData.modelId) newErrors.modelId = "Model is required";
    if (!formData.variantId) newErrors.variantId = "Variant is required";
    if (!formData.colourId) newErrors.colourId = "Colour is required";
    if (!formData.itemCode.trim()) newErrors.itemCode = "Item Code is required";
    if (!formData.itemName.trim()) newErrors.itemName = "Item Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editId) {
        await apiHelper.put(`/implement/${editId}`, formData);
        toast.success("Implement updated successfully!");
      } else {
        await apiHelper.post("/implement", formData);
        toast.success("Implement created successfully!");
      }
      await getImplements();
      setShowDrawer(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save.");
    }
  };

  // ─── Filtering & Pagination ──────────────────────────────────────────────
  const filteredData = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      (item.category?.categoryName || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.brand?.brandName || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesOperation = filterOperation === "All" || item.operationType === filterOperation;

    return matchesSearch && matchesStatus && matchesOperation;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const isAllPageSelected =
    currentItems.length > 0 && currentItems.every((item) => selectedIds.includes(item.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = currentItems.map((item) => item.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = currentItems.map((item) => item.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative min-h-screen space-y-6 p-4 pb-28 text-gray-900 md:p-6 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl dark:text-white">
            Create Implement
          </h1>
          <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
            Manage implements from here
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 md:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                showFilterBar
                  ? "dark:bg-dark-600 dark:border-dark-500 border-red-200 bg-red-50 text-red-600 dark:text-white"
                  : "dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter className="size-4.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <button className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <RiFileExcel2Fill className="text-lg text-green-500" />
            </button>
            <button className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <RiFilePdfFill className="text-lg text-red-500" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAddDrawer}
            className="bg-primary-600 hover:bg-primary-700 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors"
          >
            <Plus className="size-4.5" />
            Add Implement
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by item name or code..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="dark:border-dark-500 dark:bg-dark-800 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>

      {/* Filter Bar */}
      {showFilterBar && (
        <div className="dark:bg-dark-700 dark:border-dark-500 animate-in fade-in slide-in-from-top-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Status
              </label>
              <Listbox
                data={statusFilterOptions}
                value={statusFilterOptions.find((o) => o.id === filterStatus) || statusFilterOptions[0]}
                onChange={(opt: any) => { setFilterStatus(opt.id); setCurrentPage(1); }}
                displayField="name"
              />
            </div>
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Operation
              </label>
              <Listbox
                data={operationFilterOptions}
                value={operationFilterOptions.find((o) => o.id === filterOperation) || operationFilterOptions[0]}
                onChange={(opt: any) => { setFilterOperation(opt.id); setCurrentPage(1); }}
                displayField="name"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table hoverable className="w-full min-w-[1400px] text-left [&_.table-th]:font-semibold">
            <THead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
              <Tr>
                <Th className="w-12 py-3.5 text-center">
                  <Checkbox
                    className="size-4.5"
                    checked={isAllPageSelected}
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">S.No</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Category</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Brand</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Model</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Variant</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Colour</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Item Code</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Item Name</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Tax</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Unit</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Pur. Price</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Sales Price</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">MRP</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Operation</Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Status</Th>
                <Th className="w-20 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Actions</Th>
              </Tr>
            </THead>
            <TBody className="dark:divide-dark-700 divide-y divide-gray-200">
              {currentItems.map((item, index) => {
                const isRowSelected = selectedIds.includes(item.id);
                return (
                  <Tr key={item.id} className={isRowSelected ? "dark:bg-dark-600/30 bg-gray-50/50" : ""}>
                    <Td className="py-4 text-center">
                      <Checkbox className="size-4.5" checked={isRowSelected} onChange={() => handleSelectRow(item.id)} />
                    </Td>
                    <Td className="py-4 font-medium text-gray-500">{indexOfFirstItem + index + 1}</Td>
                    <Td className="py-4">{item.category?.categoryName || "-"}</Td>
                    <Td className="py-4">{item.brand?.brandName || "-"}</Td>
                    <Td className="py-4">{item.model?.modelName || "-"}</Td>
                    <Td className="py-4">{item.variant?.variantName || "-"}</Td>
                    <Td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-4 w-4 rounded-full border" style={{ backgroundColor: item.colour?.colourCode }} />
                        {item.colour?.colourName || "-"}
                      </div>
                    </Td>
                    <Td className="py-4 font-medium">{item.itemCode}</Td>
                    <Td className="py-4">{item.itemName}</Td>
                    <Td className="py-4">{item.taxSlab ? `${item.taxSlab}%` : "-"}</Td>
                    <Td className="py-4">{item.unit || "-"}</Td>
                    <Td className="py-4">₹{item.purchasePrice}</Td>
                    <Td className="py-4">₹{item.salesPrice}</Td>
                    <Td className="py-4">₹{item.mrp}</Td>
                    <Td className="py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.operationType === "SELF_OPERATED" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {item.operationType === "SELF_OPERATED" ? "Self Operated" : "Tractor Operated"}
                      </span>
                    </Td>
                    <Td className="py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`relative h-6 w-12 rounded-full transition-all ${item.status === "ACTIVE" ? "bg-primary-500" : "dark:bg-dark-600 bg-gray-300"}`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${item.status === "ACTIVE" ? "left-6.5" : "left-0.5"}`} />
                      </button>
                    </Td>
                    <Td className="py-4 text-center">
                      <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="dark:hover:bg-dark-600 inline-flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                          <EllipsisHorizontalIcon className="size-5" />
                        </MenuButton>
                        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                          <MenuItems anchor="bottom end" className="dark:border-dark-500 dark:bg-dark-800 dark:ring-dark-500 z-[100] w-36 rounded-lg border border-gray-100 bg-white p-1 shadow-lg">
                            <MenuItem>
                              {({ active }) => (
                                <button onClick={() => handleOpenEditDrawer(item)} className={`${active ? "text-primary-600 dark:bg-dark-600 bg-gray-50 dark:text-white" : "dark:text-dark-200 text-gray-700"} flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium`}>
                                  <PencilIcon className="size-4" /> Edit
                                </button>
                              )}
                            </MenuItem>
                            <MenuItem>
                              {({ active }) => (
                                <button onClick={() => handleDelete(item.id)} className={`${active ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" : "dark:text-dark-200 text-gray-700"} flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium`}>
                                  <TrashIcon className="size-4" /> Delete
                                </button>
                              )}
                            </MenuItem>
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
              {currentItems.length === 0 && (
                <Tr><Td colSpan={17} className="py-12 text-center text-gray-400">No implements found</Td></Tr>
              )}
            </TBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="dark:border-dark-700 dark:bg-dark-800 flex flex-col gap-4 rounded-b-xl border-t border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center">
            <div className="order-1 flex items-center justify-center gap-2 text-sm text-gray-600 md:w-1/3 md:justify-start dark:text-gray-400">
              <span>Show</span>
              <div className="w-20">
                <Menu as="div" className="relative inline-block w-full text-left">
                  <MenuButton className="dark:border-dark-600 dark:bg-dark-700 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none dark:text-gray-200">
                    <span>{itemsPerPage}</span>
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </MenuButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <MenuItems anchor="bottom start" className="dark:bg-dark-700 dark:border-dark-600 z-[200] w-20 space-y-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black/5 focus:outline-none">
                      {entriesOptions.map((opt) => (
                        <MenuItem key={opt.id}>
                          {({ active }) => (
                            <button
                              onClick={() => { setItemsPerPage(opt.id); setCurrentPage(1); }}
                              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium ${
                                opt.id === itemsPerPage
                                  ? "bg-primary-500 text-white"
                                  : active
                                    ? "dark:bg-dark-600 bg-gray-100 text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {opt.name}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
              <span>entries</span>
            </div>

            <div className="order-2 flex justify-center md:w-1/3">
              <div className="dark:border-dark-700 dark:bg-dark-800 inline-flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400">
                  <ChevronLeftIcon className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      page === currentPage ? "bg-primary-500 text-white" : "dark:hover:bg-dark-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400">
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </div>

            <div className="order-3 flex items-center justify-center text-sm text-gray-500 select-none md:w-1/3 md:justify-end dark:text-gray-400">
              <span>
                {totalItems === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 w-full max-w-xs px-2 duration-200">
          <div className="dark:border-dark-500 dark:bg-dark-700/95 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="dark:text-dark-200 text-sm font-medium text-gray-600">
              Selected <span className="font-semibold text-gray-900 dark:text-white">{selectedIds.length}</span> items
            </div>
            <Button variant="filled" color="error" onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 shadow-sm">
              <TrashIcon className="size-4" />
              <span className="text-xs font-semibold">Delete</span>
            </Button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <Transition appear show={showDrawer} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={() => setShowDrawer(false)}>
          <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
          </TransitionChild>
          <TransitionChild as={Fragment} enter="ease-out transform-gpu transition-transform duration-200" enterFrom="translate-x-full" enterTo="translate-x-0" leave="ease-in transform-gpu transition-transform duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full">
            <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full max-w-2xl transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200">
              <div className="flex h-full flex-col">
                <div className="dark:border-dark-500 flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <h2 className="dark:text-dark-50 text-lg font-semibold text-gray-800">
                    {editId !== null ? "Edit Implement" : "Add Implement"}
                  </h2>
                  <button onClick={() => setShowDrawer(false)} className="size-8 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <div className="grow space-y-4 overflow-y-auto p-5">
                  {/* Operation Type Radio */}
                  <div>
                    <label className="dark:text-dark-200 mb-2 block text-sm font-medium text-gray-700">
                      Operation Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <Radio label="Self Operated" name="operationType" checked={formData.operationType === "SELF_OPERATED"} onChange={() => handleInputChange("operationType", "SELF_OPERATED")} />
                      <Radio label="Tractor Operated" name="operationType" checked={formData.operationType === "TRACTOR_OPERATED"} onChange={() => handleInputChange("operationType", "TRACTOR_OPERATED")} />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                    <Combobox
                      data={categories.map((c) => ({ value: String(c.id), label: c.categoryName }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={categories.map((c) => ({ value: String(c.id), label: c.categoryName })).find((o) => o.value === formData.categoryId) || null}
                      onChange={(val: any) => {
                        handleInputChange("categoryId", val?.value || "");
                        handleInputChange("brandId", "");
                        handleInputChange("modelId", "");
                        handleInputChange("variantId", "");
                        handleInputChange("colourId", "");
                      }}
                      placeholder="Select Category"
                    />
                    {errors.categoryId && <span className="text-xs text-orange-500">{errors.categoryId}</span>}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Brand <span className="text-red-500">*</span></label>
                    <Combobox
                      data={filteredBrands.map((b) => ({ value: String(b.id), label: b.brandName }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={filteredBrands.map((b) => ({ value: String(b.id), label: b.brandName })).find((o) => o.value === formData.brandId) || null}
                      onChange={(val: any) => {
                        handleInputChange("brandId", val?.value || "");
                        handleInputChange("modelId", "");
                        handleInputChange("variantId", "");
                        handleInputChange("colourId", "");
                      }}
                      placeholder={formData.categoryId ? "Select Brand" : "Select Category first"}
                      disabled={!formData.categoryId}
                    />
                    {errors.brandId && <span className="text-xs text-orange-500">{errors.brandId}</span>}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Model <span className="text-red-500">*</span></label>
                    <Combobox
                      data={filteredModels.map((m) => ({ value: String(m.id), label: m.modelName }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={filteredModels.map((m) => ({ value: String(m.id), label: m.modelName })).find((o) => o.value === formData.modelId) || null}
                      onChange={(val: any) => {
                        handleInputChange("modelId", val?.value || "");
                        handleInputChange("variantId", "");
                        handleInputChange("colourId", "");
                      }}
                      placeholder={formData.brandId ? "Select Model" : "Select Brand first"}
                      disabled={!formData.brandId}
                    />
                    {errors.modelId && <span className="text-xs text-orange-500">{errors.modelId}</span>}
                  </div>

                  {/* Variant */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Variant <span className="text-red-500">*</span></label>
                    <Combobox
                      data={filteredVariants.map((v) => ({ value: String(v.id), label: v.variantName }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={filteredVariants.map((v) => ({ value: String(v.id), label: v.variantName })).find((o) => o.value === formData.variantId) || null}
                      onChange={(val: any) => {
                        handleInputChange("variantId", val?.value || "");
                        handleInputChange("colourId", "");
                      }}
                      placeholder={formData.modelId ? "Select Variant" : "Select Model first"}
                      disabled={!formData.modelId}
                    />
                    {errors.variantId && <span className="text-xs text-orange-500">{errors.variantId}</span>}
                  </div>

                  {/* Colour */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Colour <span className="text-red-500">*</span></label>
                    <Combobox
                      data={filteredColours.map((c) => ({ value: String(c.id), label: c.colourName }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={filteredColours.map((c) => ({ value: String(c.id), label: c.colourName })).find((o) => o.value === formData.colourId) || null}
                      onChange={(val: any) => handleInputChange("colourId", val?.value || "")}
                      placeholder={formData.variantId ? "Select Colour" : "Select Variant first"}
                      disabled={!formData.variantId}
                    />
                    {errors.colourId && <span className="text-xs text-orange-500">{errors.colourId}</span>}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Item Code <span className="text-red-500">*</span></label>
                      <Input value={formData.itemCode} onChange={(e) => handleInputChange("itemCode", e.target.value)} placeholder="Enter Item Code" />
                      {errors.itemCode && <span className="text-xs text-orange-500">{errors.itemCode}</span>}
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Item Name <span className="text-red-500">*</span></label>
                      <Input value={formData.itemName} onChange={(e) => handleInputChange("itemName", e.target.value)} placeholder="Enter Item Name" />
                      {errors.itemName && <span className="text-xs text-orange-500">{errors.itemName}</span>}
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">HSN Code</label>
                      <Input value={formData.hsnCode} onChange={(e) => handleInputChange("hsnCode", e.target.value)} placeholder="Enter HSN Code" />
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Tax Slab</label>
                      <Combobox
                        data={taxSlabOptions}
                        displayField="label"
                        value={taxSlabOptions.find((t) => t.value === formData.taxSlab) || null}
                        onChange={(val: any) => handleInputChange("taxSlab", val?.value || "")}
                        placeholder="Select Tax Slab"
                        searchFields={["label"]}
                      />
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Unit</label>
                      <Combobox
                        data={unitOptions}
                        displayField="label"
                        value={unitOptions.find((u) => u.value === formData.unit) || null}
                        onChange={(val: any) => handleInputChange("unit", val?.value || "")}
                        placeholder="Select Unit"
                        searchFields={["label"]}
                      />
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Purchase Price</label>
                      <Input type="number" value={formData.purchasePrice} onChange={(e) => handleInputChange("purchasePrice", e.target.value)} placeholder="Enter Purchase Price" />
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Sales Price</label>
                      <Input type="number" value={formData.salesPrice} onChange={(e) => handleInputChange("salesPrice", e.target.value)} placeholder="Enter Sales Price" />
                    </div>
                    <div>
                      <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">MRP</label>
                      <Input type="number" value={formData.mrp} onChange={(e) => handleInputChange("mrp", e.target.value)} placeholder="Enter MRP" />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <Combobox
                      data={statusOptions}
                      displayField="label"
                      value={statusOptions.find((s) => s.value === formData.status) || null}
                      onChange={(val: any) => handleInputChange("status", val?.value || "ACTIVE")}
                      placeholder="Select Status"
                    />
                  </div>
                </div>

                <div className="dark:border-dark-500 flex items-center justify-end gap-3 border-t border-gray-200 p-5">
                  <button type="button" onClick={() => setShowDrawer(false)} className="dark:bg-dark-600 dark:hover:bg-dark-500 cursor-pointer rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:text-gray-300">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-semibold text-white">
                    {editId !== null ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => { setShowConfirmModal(false); setDeleteTargetId(null); setConfirmState("pending"); }}
        onOk={performDelete}
        confirmLoading={confirmLoading}
        state={confirmState}
        messages={{
          pending: {
            Icon: ExclamationTriangleIcon,
            title: isBulkDelete ? "Delete Selected Implements?" : "Are you sure?",
            description: isBulkDelete
              ? `Are you sure you want to delete ${selectedIds.length} selected implements? This action cannot be undone.`
              : "Are you sure you want to delete this implement? Once deleted, it cannot be restored.",
            actionText: isBulkDelete ? "Delete All" : "Delete",
          },
          success: {
            title: "Deleted Successfully",
            description: isBulkDelete ? `${selectedIds.length} implements have been deleted.` : "The implement has been deleted.",
            actionText: "Done",
          },
          error: {
            title: "Delete Failed",
            description: "Failed to delete. Please try again.",
            actionText: "Try Again",
          },
        }}
      />
    </div>
  );
};

export default CreateImplement;