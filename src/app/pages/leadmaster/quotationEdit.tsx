import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiHelper from "@/utils/apiHelper";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  XMarkIcon,
  WrenchIcon,
  CogIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "@/components/ui";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { toast } from "sonner";
import { Switch } from "@headlessui/react";

type QuotationItem = {
  id?: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
};

type Accessory = {
  id: number;
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
};

type ShowroomVariant = {
  id: number;

  modelName: string;
  variantName: string;
  colourName: string;

  purPrice: number;
  purTaxPercent: number;

  exShowroomPrice: number;
  exShowroomTaxPercent: number;

  insurance: number;
  insuranceTaxPercent: number;

  rtoCharge: number;
  rtoTaxType: string;
  rtoTaxPercent: number;

  salesPrice: number;

  accessories: Accessory[];
};

type QuotationData = {
  id: number;
  leadId: number;
  quotationNo: string;
  quotationDate: string;
  validUntil: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  showroomVariant: ShowroomVariant;
  items: QuotationItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired";
  notes: string;
  terms: string;
};

const QuotationEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [showroomVariant, setShowroomVariant] = useState<ShowroomVariant | null>(null);

  // Fetch quotation data
const fetchLead = async () => {
  try {
    setLoading(true);

    const res = await apiHelper.get(`/leads/${id}`);

    // Choose ONE of these depending on your API
    const lead = res.data.data ?? res.data;

    console.log("Lead:", lead);

    setQuotation(lead);

    if (lead.showroomVariant) {
      setShowroomVariant(lead.showroomVariant);

      setAccessories(
        (lead.showroomVariant.accessories ?? []).map((item: any) => ({
          ...item,
          selected: true,
        }))
      );
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to load lead");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (id) {
    fetchLead();
  }
}, [id]);
 
  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discountTotal = items.reduce((sum, item) => sum + (item.discount || 0), 0);
    const taxTotal = items.reduce((sum, item) => sum + (item.taxRate || 0), 0);
    const accessoryTotal = accessories
      .filter(a => a.selected)
      .reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);
    const grandTotal = subtotal - discountTotal + taxTotal + accessoryTotal;
    return { subtotal, discountTotal, taxTotal, grandTotal, accessoryTotal };
  };

  const totals = calculateTotals();

  // Add new item row
  const addItem = () => {
    const newItem: QuotationItem = {
      itemName: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item row
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update item field
  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total for this item
    if (field === "quantity" || field === "unitPrice" || field === "discount" || field === "taxRate") {
      const qty = field === "quantity" ? value : updatedItems[index].quantity;
      const price = field === "unitPrice" ? value : updatedItems[index].unitPrice;
      const discount = field === "discount" ? value : updatedItems[index].discount;
      const tax = field === "taxRate" ? value : updatedItems[index].taxRate;
      updatedItems[index].total = (qty * price) - discount + tax;
    }
    
    setItems(updatedItems);
  };

  // Toggle accessory selection
  const toggleAccessory = (index: number) => {
    const updatedAccessories = [...accessories];
    updatedAccessories[index].selected = !updatedAccessories[index].selected;
    setAccessories(updatedAccessories);
  };

  // Update accessory quantity
  const updateAccessoryQuantity = (index: number, quantity: number) => {
    const updatedAccessories = [...accessories];
    updatedAccessories[index].quantity = Math.max(1, quantity);
    setAccessories(updatedAccessories);
  };

  // Save quotation
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...quotation,
        items: items,
        showroomVariant: {
          ...showroomVariant,
          accessories: accessories,
        },
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        accessoryTotal: totals.accessoryTotal,
        grandTotal: totals.grandTotal,
      };
      
      await apiHelper.put(`/leads/${id}/quotation`, payload);
      toast.success("Quotation updated successfully!");
      navigate(`/leadmaster`);
    } catch (error) {
      console.error("Error saving quotation:", error);
      toast.error("Failed to save quotation");
    } finally {
      setSaving(false);
    }
  };

  // Send quotation
  const handleSend = async () => {
    try {
      setSaving(true);
      await apiHelper.post(`/leads/${id}/quotation/send`);
      toast.success("Quotation sent successfully!");
      navigate(`/leadmaster`);
    } catch (error) {
      console.error("Error sending quotation:", error);
      toast.error("Failed to send quotation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Quotation not found</p>
          <button
            onClick={() => navigate("/leadmaster")}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 transition-colors duration-200 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/leadmaster")}
            className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Edit Quotation
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quotation #{quotation.quotationNo} - {quotation.customerName}
            </p>
          </div>
          <div className="ml-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                quotation.status === "Draft"
                  ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  : quotation.status === "Sent"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : quotation.status === "Accepted"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : quotation.status === "Rejected"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {quotation.status}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            color="primary"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
          >
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            color="success"
            onClick={handleSend}
            loading={saving}
            disabled={saving || quotation.status === "Sent"}
          >
            Send Quotation
          </Button>
        </div>
      </div>

      {/* Customer & Vehicle Info */}
      <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Customer Name
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {quotation.customer?.accountName}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Phone
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
           {quotation.customer?.mobile}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Quotation Date
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(quotation.quotationDate).toLocaleDateString("en-IN")}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Valid Until
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(quotation.validUntil).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Showroom Variant Details - Replaces Model, Variant, Colour */}
      {showroomVariant && (
        <div className="">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
            <SparklesIcon className="mb-1 mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
            Showroom Variant Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
      <label className="text-xs text-gray-500">
        Existing Model
      </label>

      <Input
        value={quotation.model?.modelName || ""}
        readOnly
      />
    </div>

    <div>
      <label className="text-xs text-gray-500">
        Existing Variant
      </label>

      <Input
        value={quotation.
showroomVariant?.variantName
 || ""}
        readOnly
      />
    </div>

    <div>
      <label className="text-xs text-gray-500">
        Existing Colour
      </label>

      <Input
        value={quotation.colour?.colourName || ""}
        readOnly
      />
    </div>
          </div>
      <div className="my-6 border-t border-gray-300 dark:border-gray-700"></div>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mt-3">

    <Input
      label="Purchase Price"
      value={showroomVariant?.purPrice || ""}
      readOnly
    />

    <Input
      label="Purchase Tax %"
      value={showroomVariant?.purTaxPercent || ""}
      readOnly
    />

    <Input
      label="Ex Showroom Price"
      value={showroomVariant?.exShowroomPrice || ""}
      readOnly
    />

    <Input
      label="Ex Showroom Tax %"
      value={showroomVariant?.exShowroomTaxPercent || ""}
      readOnly
    />

    <Input
      label="Insurance"
      value={showroomVariant?.insurance || ""}
      readOnly
    />

    <Input
      label="Insurance Tax %"
      value={showroomVariant?.insuranceTaxPercent || ""}
      readOnly
    />

    <Input
      label="RTO Charge"
      value={showroomVariant?.rtoCharge || ""}
      readOnly
    />

    <Input
      label="RTO Tax Type"
      value={showroomVariant?.rtoTaxType || ""}
      readOnly
    />

    <Input
      label="RTO Tax %"
      value={showroomVariant?.rtoTaxPercent || ""}
      readOnly
    />

    <Input
      label="Sales Price"
      value={showroomVariant?.salesPrice || ""}
      readOnly
    />

  </div>
</div>
    
      )}

      {/* Accessories Section */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            <CogIcon className="mb-1 mr-2 inline h-5 w-5 text-gray-600 dark:text-gray-400" />
            Accessories
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Selected: {accessories.filter(a => a.selected).length} items
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {accessories.map((accessory, index) => (
            <div
              key={accessory.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                accessory.selected
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                  : "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/30"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {accessory.name}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ₹{accessory.price?.toLocaleString("en-IN") || "0"}
                  </span>
                  {accessory.selected && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={accessory.quantity || 1}
                        onChange={(e) => updateAccessoryQuantity(index, Number(e.target.value))}
                        className="w-12 rounded border border-gray-300 px-1 py-0.5 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <Switch
                  checked={accessory.selected}
                  onChange={() => toggleAccessory(index)}
                  className={`${
                    accessory.selected ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      accessory.selected ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          ))}
        </div>

        {accessories.length === 0 && (
          <div className="py-8 text-center text-gray-400 dark:text-gray-500">
            No accessories available for this variant
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Items ({items.length})
          </h3>
          <Button color="primary" variant="outline" onClick={addItem}>
            <PlusIcon className="mr-1.5 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Table hoverable className="w-full min-w-[900px] text-left">
            <THead className="border-b border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700/60">
              <Tr>
                <Th className="w-12">#</Th>
                <Th className="min-w-[150px]">Item Name</Th>
                <Th className="min-w-[200px]">Description</Th>
                <Th className="w-24 text-center">Qty</Th>
                <Th className="w-32 text-right">Unit Price</Th>
                <Th className="w-28 text-right">Discount</Th>
                <Th className="w-28 text-right">Tax</Th>
                <Th className="w-32 text-right">Total</Th>
                <Th className="w-12 text-center">Action</Th>
              </Tr>
            </THead>
            <TBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item, index) => (
                <Tr key={index}>
                  <Td className="text-center font-medium text-gray-500">
                    {index + 1}
                  </Td>
                  <Td>
                    <Input
                      value={item.itemName}
                      onChange={(e) => updateItem(index, "itemName", e.target.value)}
                      placeholder="Item name"
                      className="w-full border-0 bg-transparent p-0 shadow-none focus:ring-0"
                    />
                  </Td>
                  <Td>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Description"
                      className="w-full border-0 bg-transparent p-0 shadow-none focus:ring-0"
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      min="1"
                      className="w-20 border-0 bg-transparent p-0 text-center shadow-none focus:ring-0"
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-28 border-0 bg-transparent p-0 text-right shadow-none focus:ring-0"
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) => updateItem(index, "discount", Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-24 border-0 bg-transparent p-0 text-right shadow-none focus:ring-0"
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={item.taxRate}
                      onChange={(e) => updateItem(index, "taxRate", Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-24 border-0 bg-transparent p-0 text-right shadow-none focus:ring-0"
                    />
                  </Td>
                  <Td className="font-semibold text-gray-900 dark:text-white">
                    ₹{(item.quantity * item.unitPrice - item.discount + item.taxRate).toLocaleString("en-IN")}
                  </Td>
                  <Td className="text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="rounded-md p-1 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </Td>
                </Tr>
              ))}
              {items.length === 0 && (
                <Tr>
                  <Td colSpan={9} className="py-12 text-center text-gray-400">
                    No items added yet. Click "Add Item" to get started.
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col items-end gap-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Summary
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Base Price
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  ₹{showroomVariant?.price?.toLocaleString("en-IN") || "0"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Accessories Total
                </span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  ₹{totals.accessoryTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Subtotal (Items)
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  ₹{totals.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Discount
                </span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  -₹{totals.discountTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-700/60">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tax
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  ₹{totals.taxTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-blue-600/10 p-2 dark:bg-blue-500/20">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Grand Total
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{totals.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="w-full max-w-md">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                value={quotation.notes || ""}
                onChange={(e) => setQuotation({ ...quotation, notes: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Additional notes..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Terms & Conditions
              </label>
              <textarea
                value={quotation.terms || ""}
                onChange={(e) => setQuotation({ ...quotation, terms: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Terms and conditions..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full max-w-md gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/leadmaster")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
            className="flex-1"
          >
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            color="success"
            onClick={handleSend}
            loading={saving}
            disabled={saving || quotation.status === "Sent"}
            className="flex-1"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationEdit;