// src/app/pages/implement/implementmodel.tsx
import React, { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Search, Filter, Plus } from "lucide-react";
import { RiFileExcel2Fill, RiFilePdfFill } from "react-icons/ri";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { Checkbox, Input } from "@/components/ui";
import { Combobox } from "@/components/shared/form/Combobox";
import { Listbox } from "@/components/shared/form/StyledListbox";
import apiHelper from "@/utils/apiHelper";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// ─── Types ──────────────────────────────────────────────────────────────────
interface ImplementModelItem {
  id: number;
  modelName: string;
  image?: string;
  categoryId: number;
  brandId: number;
  category?: { id: number; categoryName: string };
  brand?: { id: number; brandName: string };
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

interface FormValues {
  modelName: string;
  categoryId: string;
  brandId: string;
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

const statusFilterOptions = [
  { id: "All", name: "All Statuses" },
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
];

// ─── Main Component ──────────────────────────────────────────────────────
const ImplementModel = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [items, setItems] = useState<ImplementModelItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmState, setConfirmState] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [formData, setFormData] = useState<FormValues>({
    modelName: "",
    categoryId: "",
    brandId: "",
    status: "ACTIVE",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Fetch Data ──────────────────────────────────────────────────────
  const getModels = async () => {
    try {
      setLoading(true);
      const res = await apiHelper.get("/implement-model");
      let data = res?.data?.data || res?.data || res;
      if (!Array.isArray(data)) data = [];
      setItems(data);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await apiHelper.get("/implement-category");
      let data = res?.data?.data || res?.data || res;
      if (!Array.isArray(data)) data = [];
      setCategories(data.filter((c: any) => c.status === "ACTIVE"));
    } catch (err) {
      console.error(err);
    }
  };

  const getBrands = async () => {
    try {
      const res = await apiHelper.get("/implement-brand");
      let data = res?.data?.data || res?.data || res;
      if (!Array.isArray(data)) data = [];
      setBrands(data.filter((b: any) => b.status === "ACTIVE"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([getModels(), getCategories(), getBrands()]);
    };
    load();
  }, []);

  // Filter brands based on selected category
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = brands.filter(
        (b) => b.categoryId === Number(formData.categoryId),
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
  }, [formData.categoryId, brands]);

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
      modelName: "",
      categoryId: "",
      brandId: "",
      status: "ACTIVE",
    });
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (item: ImplementModelItem) => {
    setEditId(item.id);
    setFormData({
      modelName: item.modelName || "",
      categoryId: String(item.categoryId || ""),
      brandId: String(item.brandId || ""),
      status: item.status,
    });
    setImageFile(null);
    setImagePreview(item.image ? apiHelper.getImageUrl(item.image) : "");
    setShowDrawer(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setIsBulkDelete(false);
    setConfirmState("pending");
    setShowConfirmModal(true);
  };

  const handleBulkDelete = () => {
    setIsBulkDelete(true);
    setConfirmState("pending");
    setShowConfirmModal(true);
  };

  const performDelete = async () => {
    setConfirmLoading(true);
    try {
      if (isBulkDelete) {
        await Promise.all(
          selectedIds.map((id) => apiHelper.delete(`/implement-model/${id}`)),
        );
        toast.success(`${selectedIds.length} models deleted!`);
        setSelectedIds([]);
        await getModels();
        setCurrentPage(1);
        setConfirmState("success");
      } else {
        if (deleteTargetId === null) return;
        await apiHelper.delete(`/implement-model/${deleteTargetId}`);
        toast.success("Model deleted successfully!");
        await getModels();
        setDeleteTargetId(null);
        setConfirmState("success");
      }
      setTimeout(() => setShowConfirmModal(false), 1500);
    } catch (error: any) {
      setConfirmState("error");
      toast.error(error.response?.data?.message || "Failed to delete.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );

    try {
      await apiHelper.put(`/implement-model/${id}`, {
        modelName: item.modelName,
        categoryId: item.categoryId,
        brandId: item.brandId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to toggle status:", error);
      await getModels();
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.brandId) newErrors.brandId = "Brand is required";
    if (!formData.modelName.trim())
      newErrors.modelName = "Model Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = new FormData();
      payload.append("modelName", formData.modelName);
      payload.append("categoryId", formData.categoryId);
      payload.append("brandId", formData.brandId);
      payload.append("status", formData.status);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editId) {
        await apiHelper.put(`/implement-model/${editId}`, payload);
        toast.success("Model updated successfully!");
      } else {
        await apiHelper.post("/implement-model", payload);
        toast.success("Model created successfully!");
      }

      await getModels();
      setShowDrawer(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save model.");
    }
  };

  // ─── Filtering & Pagination ──────────────────────────────────────────────
  const filteredData = items.filter((item) => {
    const matchesSearch =
      item.modelName.toLowerCase().includes(search.toLowerCase()) ||
      (item.category?.categoryName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item.brand?.brandName || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "All" || item.status === selectedStatusFilter;
    const matchesCategory =
      selectedCategoryFilter === "All" ||
      item.category?.categoryName === selectedCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const isAllPageSelected =
    currentItems.length > 0 &&
    currentItems.every((item) => selectedIds.includes(item.id));

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
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const categoryFilterOptions = [
    { id: "All", name: "All Categories" },
    ...Array.from(
      new Set(items.map((i) => i.category?.categoryName).filter(Boolean)),
    ).map((name) => ({ id: name as string, name: name as string })),
  ];

  return (
    <div className="relative min-h-screen space-y-6 p-4 pb-28 text-gray-900 md:p-6 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl dark:text-white">
            Implement Model
          </h1>
          <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
            Manage implement models with category and brand
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 md:flex-nowrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                showFilterBar
                  ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-white"
                  : "dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter className="size-4.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <button className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <RiFileExcel2Fill className="text-lg text-green-500" />
            </button>
            <button className="dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <RiFilePdfFill className="text-lg text-red-500" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAddDrawer}
            className="bg-primary-600 hover:bg-primary-700 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors"
          >
            <Plus className="size-4.5" />
            Add Model
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search model, category, brand..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="dark:border-dark-500 dark:bg-dark-800 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>

      {/* Filter Bar */}
      {showFilterBar && (
        <div className="dark:bg-dark-700 dark:border-dark-500 animate-in fade-in slide-in-from-top-2 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>
              <Combobox
                data={categoryFilterOptions}
                value={
                  categoryFilterOptions.find(
                    (o) => o.id === selectedCategoryFilter,
                  ) || categoryFilterOptions[0]
                }
                displayField="name"
                searchFields={["name"]}
                onChange={(opt: any) => {
                  setSelectedCategoryFilter(opt?.id ?? "All");
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <label className="dark:text-dark-200 mb-1.5 block text-sm font-medium text-gray-700">
                Status
              </label>
              <Listbox
                data={statusFilterOptions}
                value={
                  statusFilterOptions.find(
                    (o) => o.id === selectedStatusFilter,
                  ) || statusFilterOptions[0]
                }
                onChange={(opt: any) => {
                  setSelectedStatusFilter(opt.id);
                  setCurrentPage(1);
                }}
                displayField="name"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table
            hoverable
            className="w-full min-w-[1000px] text-left [&_.table-th]:font-semibold"
          >
            <THead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
              <Tr>
                <Th className="w-12 py-3.5 text-center">
                  <Checkbox
                    className="size-4.5"
                    checked={isAllPageSelected}
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  S.No
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Image
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Model Name
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Category
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Brand
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Status
                </Th>
                <Th className="py-3.5 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Created
                </Th>
                <Th className="w-20 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </Th>
              </Tr>
            </THead>
            <TBody className="dark:divide-dark-700 divide-y divide-gray-200">
              {currentItems.map((item, index) => {
                const isRowSelected = selectedIds.includes(item.id);
                return (
                  <Tr
                    key={item.id}
                    className={
                      isRowSelected ? "dark:bg-dark-600/30 bg-gray-50/50" : ""
                    }
                  >
                    <Td className="py-4 text-center">
                      <Checkbox
                        className="size-4.5"
                        checked={isRowSelected}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </Td>
                    <Td className="py-4 font-medium text-gray-500">
                      {indexOfFirstItem + index + 1}
                    </Td>
                    <Td className="py-4">
                      <div className="dark:border-dark-600 h-12 w-12 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        {item.image ? (
                          <img
                            src={apiHelper.getImageUrl(item.image)}
                            alt={item.modelName}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            N/A
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td className="py-4 font-medium">{item.modelName}</Td>
                    <Td className="py-4">
                      {item.category?.categoryName || "-"}
                    </Td>
                    <Td className="py-4">{item.brand?.brandName || "-"}</Td>
                    <Td className="py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`relative h-6 w-12 rounded-full transition-all ${
                          item.status === "ACTIVE"
                            ? "bg-primary-500"
                            : "dark:bg-dark-600 bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                            item.status === "ACTIVE" ? "left-6.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </Td>
                    <Td className="py-4 text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </Td>
                    <Td className="py-4 text-center">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <MenuButton className="dark:hover:bg-dark-600 inline-flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                          <EllipsisHorizontalIcon className="size-5" />
                        </MenuButton>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <MenuItems
                            anchor="bottom end"
                            className="dark:bg-dark-800 dark:ring-dark-500 dark:border-dark-500 z-[100] w-36 rounded-lg border border-gray-100 bg-white p-1 shadow-lg"
                          >
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={() => handleOpenEditDrawer(item)}
                                  className={`${
                                    active
                                      ? "text-primary-600 dark:bg-dark-600 bg-gray-50 dark:text-white"
                                      : "dark:text-dark-200 text-gray-700"
                                  } flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium`}
                                >
                                  <PencilIcon className="size-4" /> Edit
                                </button>
                              )}
                            </MenuItem>
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className={`${
                                    active
                                      ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                      : "dark:text-dark-200 text-gray-700"
                                  } flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium`}
                                >
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
                <Tr>
                  <Td colSpan={9} className="py-12 text-center text-gray-400">
                    No models found
                  </Td>
                </Tr>
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
                <Menu
                  as="div"
                  className="relative inline-block w-full text-left"
                >
                  <MenuButton className="dark:border-dark-600 dark:bg-dark-700 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm">
                    <span>{itemsPerPage}</span>
                    <svg
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      anchor="bottom start"
                      className="dark:bg-dark-700 dark:border-dark-600 z-[200] w-20 space-y-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
                    >
                      {entriesOptions.map((opt) => (
                        <MenuItem key={opt.id}>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                setItemsPerPage(opt.id);
                                setCurrentPage(1);
                              }}
                              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm ${
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
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400"
                >
                  <ChevronLeftIcon className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary-500 text-white"
                          : "dark:hover:bg-dark-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400"
                >
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </div>
            <div className="order-3 flex items-center justify-center text-sm text-gray-500 select-none md:w-1/3 md:justify-end dark:text-gray-400">
              <span>
                {totalItems === 0 ? 0 : indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
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
              Selected{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedIds.length}
              </span>{" "}
              items
            </div>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
            >
              <TrashIcon className="size-4" />
              <span className="text-xs font-semibold">Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <Transition appear show={showDrawer} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-100"
          onClose={() => setShowDrawer(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full max-w-2xl transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200">
              <div className="flex h-full flex-col">
                <div className="dark:border-dark-500 flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <h2 className="dark:text-dark-50 text-lg font-semibold text-gray-800">
                    {editId !== null ? "Edit Model" : "Add Model"}
                  </h2>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="size-8 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <div className="grow space-y-4 overflow-y-auto p-5">
                  {/* Category */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={categories.map((c) => ({
                        value: String(c.id),
                        label: c.categoryName,
                      }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={
                        categories
                          .map((c) => ({
                            value: String(c.id),
                            label: c.categoryName,
                          }))
                          .find((o) => o.value === formData.categoryId) || null
                      }
                      onChange={(val: any) => {
                        handleInputChange("categoryId", val?.value || "");
                        handleInputChange("brandId", ""); // Reset brand
                      }}
                      placeholder="Select Category"
                    />
                    {errors.categoryId && (
                      <span className="text-xs text-orange-500">
                        {errors.categoryId}
                      </span>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <Combobox
                      data={filteredBrands.map((b) => ({
                        value: String(b.id),
                        label: b.brandName,
                      }))}
                      displayField="label"
                      searchFields={["label"]}
                      value={
                        filteredBrands
                          .map((b) => ({
                            value: String(b.id),
                            label: b.brandName,
                          }))
                          .find((o) => o.value === formData.brandId) || null
                      }
                      onChange={(val: any) =>
                        handleInputChange("brandId", val?.value || "")
                      }
                      placeholder={
                        formData.categoryId
                          ? "Select Brand"
                          : "Select Category first"
                      }
                      disabled={!formData.categoryId}
                    />
                    {errors.brandId && (
                      <span className="text-xs text-orange-500">
                        {errors.brandId}
                      </span>
                    )}
                  </div>

                  {/* Model Name */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">
                      Model Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Model Name"
                      value={formData.modelName}
                      onChange={(e) =>
                        handleInputChange("modelName", e.target.value)
                      }
                    />
                    {errors.modelName && (
                      <span className="text-xs text-orange-500">
                        {errors.modelName}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">
                      Model Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="dark:file:bg-dark-800 dark:file:text-dark-200 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="dark:border-dark-500 h-24 w-24 rounded-xl border border-gray-200 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <Combobox
                      data={statusOptions}
                      displayField="label"
                      value={
                        statusOptions.find(
                          (s) => s.value === formData.status,
                        ) || null
                      }
                      onChange={(val: any) =>
                        handleInputChange("status", val?.value || "ACTIVE")
                      }
                      placeholder="Select Status"
                    />
                  </div>
                </div>

                <div className="dark:border-dark-500 flex items-center justify-end gap-3 border-t border-gray-200 p-5">
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="dark:bg-dark-600 dark:hover:bg-dark-500 cursor-pointer rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    {editId !== null ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDeleteTargetId(null);
          setConfirmState("pending");
        }}
        onOk={performDelete}
        confirmLoading={confirmLoading}
        state={confirmState}
        messages={{
          pending: {
            Icon: ExclamationTriangleIcon,
            title: isBulkDelete ? "Delete Selected Models?" : "Are you sure?",
            description: isBulkDelete
              ? `Are you sure you want to delete ${selectedIds.length} selected models? This action cannot be undone.`
              : "Are you sure you want to delete this model? Once deleted, it cannot be restored.",
            actionText: isBulkDelete ? "Delete All" : "Delete",
          },
          success: {
            title: "Deleted Successfully",
            description: isBulkDelete
              ? `${selectedIds.length} models have been deleted.`
              : "The model has been deleted.",
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

export default ImplementModel;
