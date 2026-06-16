// Import Dependencies
import { Dialog, DialogPanel, Transition, TransitionChild, Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { 
  XMarkIcon, 
  PencilSquareIcon, 
  TrashIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import apiHelper from "@/utils/apiHelper";

// Local UI Imports
import { Button, Checkbox, Input } from "@/components/ui";
import {
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
} from "@/components/ui/Table";
import { Listbox } from "@/components/shared/form/StyledListbox";

type YearDataType = {
  id: number;
  category: string;
  categoryId?: number;
  brand: string;
  brandId?: number;
  model: string;
  modelId?: number;
  year: number;
  status: string;  // "ACTIVE" or "INACTIVE"
  createdAt: string;
};

type FormValues = {
  category: string;
  categoryId: number | string;
  brand: string;
  brandId: number | string;
  model: string;
  modelId: number | string;
  year: string;
  status: string;
};

const entriesOptions = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 30, name: "30" },
  { id: 40, name: "40" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

const statusOptions = [
  { id: "ACTIVE", name: "On" },
  { id: "INACTIVE", name: "Off" },
];

export default function ModelYear() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [years, setYears] = useState<YearDataType[]>([]);
const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
const [brands, setBrands] = useState<{id: number, name: string}[]>([]);
const [models, setModels] = useState<{id: number, name: string}[]>([]);
const [loading, setLoading] = useState(false);

 

 const categoryOptions = categories.map((cat) => ({ id: String(cat.id), name: cat.name }));
const brandOptions = brands.map((br) => ({ id: String(br.id), name: br.name }));
const modelOptions = models.map((md) => ({ id: String(md.id), name: md.name }));

 

  const [search, setSearch] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  
  // Filter dropdown states - Added selectedYearFilter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All");
  const [selectedModelFilter, setSelectedModelFilter] = useState("All");
  const [selectedYearFilter, setSelectedYearFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);


  useEffect(() => {
  getYears();
  getCategories();
  getBrands();
  getModels();
}, []);

const getYears = async () => {
  try {
    setLoading(true);
    const response = await apiHelper.get("/model-year");
    let data = response?.data || response;
    if (!Array.isArray(data)) data = [];
    const mapped = data.map((item: any) => ({
      ...item,
      category: typeof item.category === 'object' ? item.category?.categoryName || item.category?.name || "" : item.category || "",
      categoryId: typeof item.category === 'object' ? item.category?.id : item.categoryId,
      brand: typeof item.brand === 'object' ? item.brand?.brandName || item.brand?.name || "" : item.brand || "",
      brandId: typeof item.brand === 'object' ? item.brand?.id : item.brandId,
      model: typeof item.model === 'object' ? item.model?.modelName || item.model?.name || "" : item.model || "",
      modelId: typeof item.model === 'object' ? item.model?.id : item.modelId,
      id: item.id || item._id,
      year: item.modelYear || item.year || "",  // ✅ modelYear from backend, map to year
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "",
    }));
    setYears(mapped);
  } catch (error) { console.error(error); setYears([]); }
  finally { setLoading(false); }
};

const getCategories = async () => {
  try {
    const response = await apiHelper.get("/category");
    const data = response?.data || response;
    setCategories((Array.isArray(data) ? data : []).map((item: any) => ({ id: item.id || item._id, name: item.categoryName || item.name })));
  } catch (error) { setCategories([]); }
};

const getBrands = async () => {
  try {
    const response = await apiHelper.get("/brand");
    const data = response?.data || response;
    setBrands((Array.isArray(data) ? data : []).map((item: any) => ({ id: item.id || item._id, name: item.brandName || item.name })));
  } catch (error) { setBrands([]); }
};

const getModels = async () => {
  try {
    const response = await apiHelper.get("/model");
    const data = response?.data || response;
    setModels((Array.isArray(data) ? data : []).map((item: any) => ({ id: item.id || item._id, name: item.modelName || item.name })));
  } catch (error) { setModels([]); }
};

  // React Hook Form implementation
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
   defaultValues: {
  category: "", categoryId: "",
  brand: "", brandId: "",
  model: "", modelId: "",
  year: "",
  status: "ACTIVE",
}
  });

  const formStatusValue = useWatch({ control, name: "status" });
  const formCategoryValue = useWatch({ control, name: "category" });
  const formBrandValue = useWatch({ control, name: "brand" });
  const formModelValue = useWatch({ control, name: "model" });

  const formValidationRules = {
    year: { required: "Year is required" },
    category: { required: "Category selection is required" },
    brand: { required: "Brand selection is required" },
    model: { required: "Model selection is required" },
  };

  // Filter options
  const categoryFilterOptions = [
    { id: "All", name: "All Categories" },
    ...categories.map((c) => ({ id: c, name: c })),
  ];

  const brandFilterOptions = [
    { id: "All", name: "All Brands" },
    ...brands.map((b) => ({ id: b, name: b })),
  ];

  const modelFilterOptions = [
    { id: "All", name: "All Models" },
    ...models.map((m) => ({ id: m, name: m })),
  ];

  // Year filter options - dynamically generated from existing data
  const yearFilterOptions = [
    { id: "All", name: "All Years" },
    ...Array.from(new Set(years.map((y) => y.year)))
      .sort((a, b) => b - a)
      .map((yr) => ({ id: yr.toString(), name: yr.toString() })),
  ];

 const statusFilterOptions = [
  { id: "All", name: "All Statuses" },
  { id: "ACTIVE", name: "On" },
  { id: "INACTIVE", name: "Off" },
];

 const handleOpenAddDrawer = () => {
  setEditId(null);
  const firstCategory = categories[0] || { id: "", name: "" };
  const firstBrand = brands[0] || { id: "", name: "" };
  const firstModel = models[0] || { id: "", name: "" };
  reset({ 
    category: firstCategory.name, categoryId: firstCategory.id,
    brand: firstBrand.name, brandId: firstBrand.id,
    model: firstModel.name, modelId: firstModel.id,
    year: "", 
    status: "ACTIVE"  // ✅ String, not true
  });
  setShowDrawer(true);
};

 const handleOpenEditDrawer = (item: YearDataType) => {  // ✅ YearDataType
  setEditId(item.id);
  reset({ 
    category: item.category, categoryId: item.categoryId || "",
    brand: item.brand, brandId: item.brandId || "",
    model: item.model, modelId: item.modelId || "",
    year: item.year.toString(), 
    status: item.status
  });
  setShowDrawer(true);
};

  const handleDelete = async (id: number) => {
  try { await apiHelper.delete(`/model-year/${id}`); getYears(); }
  catch (error) { console.error(error); }
};

const handleBulkDelete = async () => {
  try {
    await Promise.all(selectedIds.map((id) => apiHelper.delete(`/model-year/${id}`)));
    await getYears(); setSelectedIds([]); setCurrentPage(1);
  } catch (error) { console.error(error); }
};

const handleToggleTableStatus = async (id: number) => {
  const item = years.find((y) => y.id === id);
  if (!item) return;
  try {
    const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await apiHelper.put(`/model-year/${id}`, { 
      categoryId: item.categoryId, 
      brandId: item.brandId, 
      modelId: item.modelId, 
      modelYear: String(item.year),  // ✅ Send as String
      status: newStatus 
    });
    setYears((prev) => prev.map((y) => y.id === id ? { ...y, status: newStatus } : y));
    await getYears();
  } catch (error) { await getYears(); }
};

const onFormSubmit = async (data: FormValues) => {
  try {
    const payload = { 
      categoryId: Number(data.categoryId), 
      brandId: Number(data.brandId), 
      modelId: Number(data.modelId), 
      modelYear: String(data.year),  // ✅ Send as String
      status: data.status 
    };
    
    if (editId !== null) await apiHelper.put(`/model-year/${editId}`, payload);
    else await apiHelper.post("/model-year", payload);
    await getYears(); setShowDrawer(false); reset();
  } catch (error: any) { console.error(error); }
};

  // Filter logic - Added year filter matching
  const filteredData = years.filter((item) => {
    const matchesSearch = 
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.year.toString().includes(search.toLowerCase());
    
    const matchesCategoryDropdown = selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;
    const matchesBrandDropdown = selectedBrandFilter === "All" || item.brand === selectedBrandFilter;
    const matchesModelDropdown = selectedModelFilter === "All" || item.model === selectedModelFilter;
    const matchesYearDropdown = selectedYearFilter === "All" || item.year.toString() === selectedYearFilter;
    const matchesStatusDropdown = selectedStatusFilter === "All" || String(item.status) === selectedStatusFilter;
    
    return matchesSearch && matchesCategoryDropdown && matchesBrandDropdown && matchesModelDropdown && matchesYearDropdown && matchesStatusDropdown;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredData, currentPage, totalPages]);

  const isAllPageSelected = currentItems.length > 0 && currentItems.every((item) => selectedIds.includes(item.id));

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
    <div className="p-4 md:p-6 space-y-6 min-h-screen relative pb-28 text-gray-900 dark:text-gray-100">
      
      {/* Upper Actions Control Toolbar Layout */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Year Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">Manage all years from here</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button"
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              showFilterBar 
                ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-white" 
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200"
            }`}
          >
            <FunnelIcon className="size-4.5" />
            Filter
          </button>
          
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200">
            <DocumentArrowDownIcon className="size-4.5 text-gray-400" />
            Excel
          </button>
          
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:bg-dark-800 dark:border-dark-500 dark:text-dark-200">
            <DocumentArrowDownIcon className="size-4.5 text-gray-400" />
            PDF
          </button>
          
          <Button color="primary" onClick={handleOpenAddDrawer} className="w-full sm:w-auto">
            Add Year
          </Button>
        </div>
      </div>

      {/* Global Context Search Box */}
      <div className="w-full max-w-md relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search year, model or brand..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-lg border border-gray-300 dark:border-dark-500 dark:bg-dark-800 pl-10 pr-4 py-2.5 outline-none bg-white text-sm"
        />
      </div>

      {/* Five Dropdown Filters - Added Year Filter */}
      {showFilterBar && (
        <div className="dark:bg-dark-700 rounded-xl border border-gray-200 bg-white p-4 dark:border-dark-500 transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Category</span>
            <Listbox data={categoryOptions} value={categoryOptions.find((opt) => opt.name === formCategoryValue) || categoryOptions[0]} 
  onChange={(opt: any) => { setValue("category", opt.name); setValue("categoryId", opt.id); }} displayField="name" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Brand</span>
              <Listbox data={brandOptions} value={brandOptions.find((opt) => opt.name === formBrandValue) || brandOptions[0]} 
  onChange={(opt: any) => { setValue("brand", opt.name); setValue("brandId", opt.id); }} displayField="name" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Model</span>
             <Listbox data={modelOptions} value={modelOptions.find((opt) => opt.name === formModelValue) || modelOptions[0]} 
  onChange={(opt: any) => { setValue("model", opt.name); setValue("modelId", opt.id); }} displayField="name" />
            </div>

            {/* New Year Filter */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Year</span>
              <Listbox
                data={yearFilterOptions}
                value={yearFilterOptions.find((o) => o.id === selectedYearFilter) || yearFilterOptions[0]}
                placeholder="All Years"
                onChange={(opt: any) => {
                  setSelectedYearFilter(opt.id);
                  setCurrentPage(1);
                }}
                displayField="name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Status</span>
              <Listbox
                data={statusFilterOptions}
                value={statusFilterOptions.find((o) => o.id === selectedStatusFilter) || statusFilterOptions[0]}
                placeholder="All Statuses"
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

      {/* Main Table Layout Panel Container */}
      <div className="dark:bg-dark-800 rounded-xl border border-gray-200 bg-white dark:border-dark-700 shadow-sm">
        <div className="overflow-x-auto"> 
          <Table hoverable className="w-full text-left [&_.table-th]:font-semibold min-w-[800px]">
            <THead className="bg-gray-100 dark:bg-dark-700/60 border-b border-gray-200 dark:border-dark-600">
              <Tr>
                <Th className="w-12 text-center py-3.5">
                  <Checkbox
                    className="size-4.5"
                    checked={isAllPageSelected}
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th className="w-16 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">S.No</Th>
                <Th className="py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</Th>
                <Th className="py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Brand</Th>
                <Th className="py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Model</Th>
                <Th className="py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Year</Th>
                <Th className="py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</Th>
                <Th className="py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</Th>
                <Th className="w-20 text-center py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</Th>
              </Tr>
            </THead>

            <TBody className="divide-y divide-gray-200 dark:divide-dark-700">
              {currentItems.map((item, index) => {
                const isRowSelected = selectedIds.includes(item.id);
                return (
                  <Tr key={item.id} className={`${isRowSelected ? "bg-gray-50/50 dark:bg-dark-600/30" : ""} hover:bg-gray-50/30 dark:hover:bg-dark-700/40 transition-colors`}>
                    <Td className="text-center py-4">
                      <Checkbox
                        className="size-4.5"
                        checked={isRowSelected}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </Td>
                    <Td className="font-medium text-gray-500 py-4">{indexOfFirstItem + index + 1}</Td>
                    <Td className="text-gray-600 dark:text-dark-200 py-4">{item.category}</Td>
                    <Td className="text-gray-600 dark:text-dark-200 py-4">{item.brand}</Td>
                    <Td className="font-medium text-gray-900 dark:text-white py-4">{item.model}</Td>
                    <Td className="font-medium text-gray-900 dark:text-white py-4">{item.year}</Td>
                  <Td className="py-4">
  <button type="button" onClick={() => handleToggleTableStatus(item.id)}
    className={`relative h-6 w-12 rounded-full transition-all ${item.status === "ACTIVE" ? "bg-primary-500" : "bg-gray-300 dark:bg-dark-600"}`}>
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${item.status === "ACTIVE" ? "left-6.5" : "left-0.5"}`} />
  </button>
</Td>
                    <Td className="text-gray-500 dark:text-gray-400 py-4">{item.createdAt}</Td>
                    <Td className="text-center py-4">
                      <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors text-gray-500 dark:text-dark-200">
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
                            className="w-36 rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-dark-800 dark:ring-dark-500 z-[100] p-1 border border-gray-100 dark:border-dark-500 [--anchor-gap:4px]"
                          >
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditDrawer(item)}
                                  className={`${
                                    active ? "bg-gray-50 dark:bg-dark-600 text-primary-600 dark:text-white" : "text-gray-700 dark:text-dark-200"
                                  } flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium`}
                                >
                                  <PencilSquareIcon className="size-4" />
                                  Edit
                                </button>
                              )}
                            </MenuItem>
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className={`${
                                    active ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400" : "text-gray-700 dark:text-dark-200"
                                  } flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium`}
                                >
                                  <TrashIcon className="size-4" />
                                  Delete
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
                  <Td colSpan={9} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    No years found
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>

        {/* Premium Three-Column Footer System */}
        {totalItems > 0 && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center border-t border-gray-200 bg-white px-4 py-4 dark:border-dark-700 dark:bg-dark-800 rounded-b-xl">
            
            {/* Column 1: Row Limits Selection */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400 md:w-1/3 order-1">
              <span>Show</span>
              <div className="w-20">
                <Menu as="div" className="relative inline-block w-full text-left">
                  <MenuButton className="flex w-full items-center justify-between rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none">
                    <span>{itemsPerPage}</span>
                    <svg className="ml-2 h-4 w-4 transform transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
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
                      anchor="top start"
                      className="w-20 rounded-lg bg-white dark:bg-dark-700 shadow-xl ring-1 ring-black/5 focus:outline-none border border-gray-200 dark:border-dark-600 p-1 space-y-0.5 z-[200] [--anchor-gap:6px]"
                    >
                      {entriesOptions.map((opt) => (
                        <MenuItem key={opt.id}>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => {
                                setItemsPerPage(opt.id);
                                setCurrentPage(1);
                              }}
                              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium ${
                                opt.id === itemsPerPage
                                  ? "bg-primary-500 text-white"
                                  : active
                                  ? "bg-gray-100 dark:bg-dark-600 text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {opt.name}
                              {opt.id === itemsPerPage && (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
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

            {/* Column 2: Page Navigation */}
            <div className="flex justify-center md:w-1/3 order-2">
              <div className="inline-flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-dark-700 dark:bg-dark-800 shadow-sm">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-dark-700"
                >
                  <ChevronLeftIcon className="size-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-primary-500 text-white"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-dark-700"
                >
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </div>

            {/* Column 3: Stats Summary */}
            <div className="flex items-center justify-center md:justify-end text-sm text-gray-500 dark:text-gray-400 select-none md:w-1/3 order-3">
              <span>
                {totalItems === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Floating Action Bar for Selected Checks */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-xs px-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-dark-500 dark:bg-dark-700/95">
            <div className="text-sm font-medium text-gray-600 dark:text-dark-200">
              Selected <span className="font-semibold text-gray-900 dark:text-white">{selectedIds.length}</span> items
            </div>
            <Button
              variant="filled"
              color="error"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 flex items-center gap-1.5 shadow-sm"
            >
              <TrashIcon className="size-4" />
              <span className="text-xs font-semibold">Delete Selected</span>
            </Button>
          </div>
        </div>
      )}

      {/* Slide Transition Form Drawer */}
      <Transition appear show={showDrawer} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setShowDrawer(false)}>
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
            <DialogPanel className="fixed right-0 top-0 flex h-full w-full max-w-md transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200 dark:bg-dark-700">
              
              <form onSubmit={handleSubmit(onFormSubmit)} className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark-500">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-50">
                    {editId !== null ? "Edit Year" : "Add Year"}
                  </h2>
                  <Button
                    onClick={() => setShowDrawer(false)}
                    variant="flat"
                    isIcon
                    className="size-8 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    type="button"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                </div>

                {/* Content Input Fields */}
                <div className="grow overflow-y-auto p-5 space-y-5">
                  <div>
                    <span className="mb-2 block text-sm font-medium">Category</span>
                  <Listbox
  data={categoryOptions}
  value={categoryOptions.find((opt) => opt.name === formCategoryValue) || categoryOptions[0]} 
  placeholder="Select Category"
  onChange={(opt: any) => { 
    setValue("category", opt.name); 
    setValue("categoryId", opt.id); 
  }}
  displayField="name"
/>
                  </div>

                  <div>
                    <span className="mb-2 block text-sm font-medium">Brand</span>
                   <Listbox
  data={brandOptions}
  value={brandOptions.find((opt) => opt.name === formBrandValue) || brandOptions[0]} 
  placeholder="Select Brand"
  onChange={(opt: any) => { 
    setValue("brand", opt.name); 
    setValue("brandId", opt.id); 
  }}
  displayField="name"
/>
                  </div>

                  <div>
                    <span className="mb-2 block text-sm font-medium">Model</span>
                 <Listbox
  data={modelOptions}
  value={modelOptions.find((opt) => opt.name === formModelValue) || brandOptions[0]} 
  placeholder="Select Model"
  onChange={(opt: any) => { 
    setValue("model", opt.name); 
    setValue("modelId", opt.id); 
  }}
  displayField="name"
/>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Year</label>
                    <Input
                      type="number"
                      placeholder="Enter year"
                      {...register("year", formValidationRules.year)}
                      error={errors?.year && errors.year.message}
                    />
                  </div>

                  <div>
                    <span className="mb-2 block text-sm font-medium">Status</span>
                    <Listbox
                      data={statusOptions}
                      value={statusOptions.find((opt) => opt.id === formStatusValue) || statusOptions[0]} 
                      placeholder="Select Status"
                      onChange={(selectedOpt: any) => setValue("status", selectedOpt.id)}
                      displayField="name"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-5 flex items-center justify-end gap-3 dark:border-dark-500">
                  <Button variant="outlined" color="neutral" type="button" onClick={() => setShowDrawer(false)} className="h-10 w-1/2">
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" className="h-10 w-1/2">
                    Save
                  </Button>
                </div>
              </form>

            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  );
}