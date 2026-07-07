import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiHelper from "@/utils/apiHelper";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Input } from "@/components/ui";
import { Combobox } from "@/components/shared/form/StyledCombobox";
import { DatePicker } from "@/components/shared/form/Datepicker";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui";

type FormValues = {
  id?: number;
  date: string;
  stockTransferId: string;
  branch: string;
  branchManagerName: string;
  contactNo: string;
  chassisNo: string;
  vehicleSrNo: string;
  model: string;
  variant: string;
  colour: string;
  itemName: string;
  itemCode: string;
  engineNo: string;
  mfgDate: string;
  keyNo: string;
  batteryNo: string;
  batteryMake: string;
  f1TyresNo: string;
  f2TyresNo: string;
  s1TyresNo: string;
  s2TyresNo: string;
  location: string;
  grnNumber: string;
  grnDate: string;
  grnRecordDate: string;
};

type SelectedVehicle = {
  id: number;
  chassisNo: string;
  vehicleSrNo: string;
  model: string;
  variant: string;
  colour: string;
  itemName: string;
  itemCode: string;
  engineNo: string;
  mfgDate: string;
  keyNo: string;
  batteryNo: string;
  batteryMake: string;
  f1TyresNo: string;
  f2TyresNo: string;
  s1TyresNo: string;
  s2TyresNo: string;
  location: string;
  grnNumber: string;
  grnDate: string;
  grnRecordDate: string;
};

const branchOptions = [
  { label: "Mumbai", value: "Mumbai" },
  { label: "Delhi", value: "Delhi" },
  { label: "Bangalore", value: "Bangalore" },
  { label: "Chennai", value: "Chennai" },
  { label: "Pune", value: "Pune" },
];

const chassisOptions = [
  { label: "CH-2024-001 - Honda City", value: "CH-2024-001" },
  { label: "CH-2024-002 - Toyota Innova", value: "CH-2024-002" },
  { label: "CH-2024-003 - Hyundai Creta", value: "CH-2024-003" },
  { label: "CH-2024-004 - Maruti Suzuki", value: "CH-2024-004" },
  { label: "CH-2024-005 - Tata Nexon", value: "CH-2024-005" },
];

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: state.isFocused
      ? "var(--color-primary-600)"
      : "var(--color-gray-700)",
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

const AddVehicleStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.item ? true : false;
  const editData = location.state?.item || null;

  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isActionChecked, setIsActionChecked] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState<SelectedVehicle | null>(
    null,
  );
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      stockTransferId: "",
      branch: "",
      branchManagerName: "",
      contactNo: "",
      chassisNo: "",
      vehicleSrNo: "",
      model: "",
      variant: "",
      colour: "",
      itemName: "",
      itemCode: "",
      engineNo: "",
      mfgDate: "",
      keyNo: "",
      batteryNo: "",
      batteryMake: "",
      f1TyresNo: "",
      f2TyresNo: "",
      s1TyresNo: "",
      s2TyresNo: "",
      location: "",
      grnNumber: "",
      grnDate: "",
      grnRecordDate: "",
    },
  });

  const watchedChassisNo = watch("chassisNo");
  const watchedBranch = watch("branch");

  // Auto-generate stock transfer ID
  useEffect(() => {
    const generateStockId = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      return `STK-${year}${month}${day}-${random}`;
    };
    setValue("stockTransferId", generateStockId());
  }, [setValue]);

  // Auto-fill manager name and contact based on branch
  useEffect(() => {
    if (watchedBranch) {
      const branchData: any = {
        Mumbai: { manager: "Mr. Rajesh Sharma", contact: "9876543210" },
        Delhi: { manager: "Mr. Amit Kumar", contact: "9876543211" },
        Bangalore: { manager: "Ms. Priya Patel", contact: "9876543212" },
        Chennai: { manager: "Mr. Suresh Iyer", contact: "9876543213" },
        Pune: { manager: "Ms. Sneha Desai", contact: "9876543214" },
      };
      const data = branchData[watchedBranch];
      if (data) {
        setValue("branchManagerName", data.manager);
        setValue("contactNo", data.contact);
      }
    }
  }, [watchedBranch, setValue]);

  // Auto-fill vehicle details based on chassis number (only when checkbox is unchecked and not saved)
  useEffect(() => {
    if (watchedChassisNo && !isActionChecked && !isSaved) {
      const mockData: any = {
        "CH-2024-001": {
          id: 1,
          chassisNo: "CH-2024-001",
          vehicleSrNo: "VH-001",
          model: "Honda City",
          variant: "ZX CVT",
          colour: "White",
          itemName: "Honda City ZX CVT",
          itemCode: "HON-CITY-ZX",
          engineNo: "ENG-2024-001",
          mfgDate: "2024-01-15",
          keyNo: "KEY-001",
          batteryNo: "BAT-001",
          batteryMake: "Exide",
          f1TyresNo: "TYR-F1-001",
          f2TyresNo: "TYR-F2-001",
          s1TyresNo: "TYR-S1-001",
          s2TyresNo: "TYR-S2-001",
          location: "Warehouse A",
          grnNumber: "GRN-001",
          grnDate: "2024-01-10",
          grnRecordDate: "2024-01-10",
        },
        "CH-2024-002": {
          id: 2,
          chassisNo: "CH-2024-002",
          vehicleSrNo: "VH-002",
          model: "Toyota Innova",
          variant: "VX",
          colour: "Silver",
          itemName: "Toyota Innova VX",
          itemCode: "TOY-INN-VX",
          engineNo: "ENG-2024-002",
          mfgDate: "2024-02-20",
          keyNo: "KEY-002",
          batteryNo: "BAT-002",
          batteryMake: "Amron",
          f1TyresNo: "TYR-F1-002",
          f2TyresNo: "TYR-F2-002",
          s1TyresNo: "TYR-S1-002",
          s2TyresNo: "TYR-S2-002",
          location: "Warehouse B",
          grnNumber: "GRN-002",
          grnDate: "2024-02-15",
          grnRecordDate: "2024-02-15",
        },
        "CH-2024-003": {
          id: 3,
          chassisNo: "CH-2024-003",
          vehicleSrNo: "VH-003",
          model: "Hyundai Creta",
          variant: "SX",
          colour: "Red",
          itemName: "Hyundai Creta SX",
          itemCode: "HYU-CRE-SX",
          engineNo: "ENG-2024-003",
          mfgDate: "2024-03-10",
          keyNo: "KEY-003",
          batteryNo: "BAT-003",
          batteryMake: "Exide",
          f1TyresNo: "TYR-F1-003",
          f2TyresNo: "TYR-F2-003",
          s1TyresNo: "TYR-S1-003",
          s2TyresNo: "TYR-S2-003",
          location: "Warehouse C",
          grnNumber: "GRN-003",
          grnDate: "2024-03-05",
          grnRecordDate: "2024-03-05",
        },
        "CH-2024-004": {
          id: 4,
          chassisNo: "CH-2024-004",
          vehicleSrNo: "VH-004",
          model: "Maruti Suzuki",
          variant: "ZXI",
          colour: "Blue",
          itemName: "Maruti Suzuki ZXI",
          itemCode: "MAR-SUZ-ZXI",
          engineNo: "ENG-2024-004",
          mfgDate: "2024-04-05",
          keyNo: "KEY-004",
          batteryNo: "BAT-004",
          batteryMake: "Amron",
          f1TyresNo: "TYR-F1-004",
          f2TyresNo: "TYR-F2-004",
          s1TyresNo: "TYR-S1-004",
          s2TyresNo: "TYR-S2-004",
          location: "Warehouse D",
          grnNumber: "GRN-004",
          grnDate: "2024-04-01",
          grnRecordDate: "2024-04-01",
        },
        "CH-2024-005": {
          id: 5,
          chassisNo: "CH-2024-005",
          vehicleSrNo: "VH-005",
          model: "Tata Nexon",
          variant: "XZ",
          colour: "Black",
          itemName: "Tata Nexon XZ",
          itemCode: "TAT-NEX-XZ",
          engineNo: "ENG-2024-005",
          mfgDate: "2024-05-20",
          keyNo: "KEY-005",
          batteryNo: "BAT-005",
          batteryMake: "Exide",
          f1TyresNo: "TYR-F1-005",
          f2TyresNo: "TYR-F2-005",
          s1TyresNo: "TYR-S1-005",
          s2TyresNo: "TYR-S2-005",
          location: "Warehouse E",
          grnNumber: "GRN-005",
          grnDate: "2024-05-15",
          grnRecordDate: "2024-05-15",
        },
      };

      const vehicleData = mockData[watchedChassisNo];
      if (vehicleData) {
        // Store the pending vehicle data
        setPendingVehicle(vehicleData);

        // Auto-fill form fields - INCLUDING chassisNo
        Object.keys(vehicleData).forEach((key) => {
          if (key !== "id") {
            setValue(key as keyof FormValues, vehicleData[key]);
          }
        });
      }
    }
  }, [watchedChassisNo, setValue, isActionChecked, isSaved]);

  // Set edit data
  useEffect(() => {
    if (isEditMode && editData) {
      Object.keys(editData).forEach((key) => {
        setValue(key as keyof FormValues, editData[key]);
      });
    }
  }, [isEditMode, editData, setValue]);

  const formValidationRules = {
    date: { required: "Date is required" },
    branch: { required: "Branch is required" },
    branchManagerName: { required: "Branch manager name is required" },
    contactNo: {
      required: "Contact number is required",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Contact number must be 10 digits",
      },
    },
    chassisNo: { required: "Chassis number is required" },
  };

  const handleBack = () => {
    navigate("/stocktransfer/vehiclestock");
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = selectedVehicles.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected =
    selectedVehicles.length > 0 &&
    selectedVehicles.every((item) => selectedIds.includes(item.id));

  // Handle action checkbox click - Only works once!
  // Handle action checkbox click - Auto-uncheck after saving
  const handleActionCheckboxChange = (checked: boolean) => {
    // If checkbox is being checked and we have pending data
    if (checked && pendingVehicle) {
      // Save data to table
      const exists = selectedVehicles.some((v) => v.id === pendingVehicle.id);
      if (!exists) {
        setSelectedVehicles([...selectedVehicles, pendingVehicle]);
        setSelectedIds([...selectedIds, pendingVehicle.id]);
      }

      // Clear ALL fields EXCEPT date and stockTransferId
      reset({
        date: watch("date"),
        stockTransferId: watch("stockTransferId"),
        branch: "",
        branchManagerName: "",
        contactNo: "",
        chassisNo: "",
        vehicleSrNo: "",
        model: "",
        variant: "",
        colour: "",
        itemName: "",
        itemCode: "",
        engineNo: "",
        mfgDate: "",
        keyNo: "",
        batteryNo: "",
        batteryMake: "",
        f1TyresNo: "",
        f2TyresNo: "",
        s1TyresNo: "",
        s2TyresNo: "",
        location: "",
        grnNumber: "",
        grnDate: "",
        grnRecordDate: "",
      });

      // Manually reset branch dropdown using setValue
      setValue("branch", "");
      setValue("branchManagerName", "");
      setValue("contactNo", "");

      setPendingVehicle(null);
      setIsSaved(true);

      // Auto-uncheck the checkbox
      setIsActionChecked(false);
    } else if (!checked) {
      // Just toggle state if unchecked manually
      setIsActionChecked(false);
    }
  };
  return (
    <div className="min-h-screen bg-white p-6 transition-colors duration-200 dark:bg-gray-900">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <button
          onClick={handleBack}
          className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Add Vehicle Stock
        </h2>
      </div>

      {/* Row 1: Date, Stock Transfer ID, Branch - 3 columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <DatePicker
            label="Date *"
            placeholder="Select Date"
            value={watch("date") ? [new Date(watch("date"))] : []}
            onChange={(val: Date[]) => {
              if (val && val[0]) {
                setValue("date", val[0].toISOString().split("T")[0]);
              }
            }}
          />
        </div>
        <div>
          <Input
            label="Stock Transfer ID"
            placeholder="Auto-generated"
            {...register("stockTransferId")}
            readOnly
            className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
          />
        </div>
        <div>
          <Combobox
            label="Select Branch *"
            placeholder="Select Branch"
            data={branchOptions}
            value={
              watch("branch")
                ? branchOptions.find((item) => item.value === watch("branch"))
                : null
            }
            onChange={(val: any) => {
              setValue("branch", val?.value || "");
            }}
            error={errors?.branch && errors.branch.message}
          />
        </div>
      </div>

      {/* Row 2: Branch Manager Name, Contact No - 2 columns */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Input
            label="Branch Manager Name *"
            placeholder="Enter manager name"
            {...register(
              "branchManagerName",
              formValidationRules.branchManagerName,
            )}
            error={
              errors?.branchManagerName && errors.branchManagerName.message
            }
          />
        </div>
        <div>
          <Input
            label="Contact No *"
            placeholder="Enter contact number"
            {...register("contactNo", formValidationRules.contactNo)}
            error={errors?.contactNo && errors.contactNo.message}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="dark:border-dark-500 my-4 border-b border-dashed border-gray-300"></div>

      {/* Row 3: Select Chassis No - Full width */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="dark:text-dark-200 mb-1 block text-sm font-medium text-gray-700">
            Select Chassis No *
          </label>
          <Controller
            name="chassisNo"
            control={control}
            rules={{ required: "Chassis number is required" }}
            render={({ field }) => (
              <Select
                options={chassisOptions}
                styles={customSelectStyles}
                classNamePrefix="react-select"
                placeholder="Search chassis number..."
                value={
                  chassisOptions.find(
                    (option) => option.value === field.value,
                  ) || null
                }
                onChange={(selected) => {
                  field.onChange(selected?.value || "");
                }}
                isDisabled={isSaved}
              />
            )}
          />
          {errors.chassisNo && (
            <span className="text-xs text-red-500">
              {errors.chassisNo.message}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="dark:border-dark-500 my-4 border-b border-dashed border-gray-300"></div>

      {/* Vehicle Details - 4 columns grid with Action column on right */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_90px]">
        {/* Fields - 4 columns */}
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <Input
                label="Vehicle Sr. No."
                placeholder="Auto-filled"
                {...register("vehicleSrNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Model"
                placeholder="Auto-filled"
                {...register("model")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Variant"
                placeholder="Auto-filled"
                {...register("variant")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Colour"
                placeholder="Auto-filled"
                {...register("colour")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Item Name"
                placeholder="Auto-filled"
                {...register("itemName")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Item Code"
                placeholder="Auto-filled"
                {...register("itemCode")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Chassis No."
                placeholder="Auto-filled"
                {...register("chassisNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Engine No."
                placeholder="Auto-filled"
                {...register("engineNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="MFG Date"
                placeholder="Auto-filled"
                {...register("mfgDate")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Key No."
                placeholder="Auto-filled"
                {...register("keyNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Battery No."
                placeholder="Auto-filled"
                {...register("batteryNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Battery Make"
                placeholder="Auto-filled"
                {...register("batteryMake")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="F1 Tyres No."
                placeholder="Auto-filled"
                {...register("f1TyresNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="F2 Tyres No."
                placeholder="Auto-filled"
                {...register("f2TyresNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="S1 Tyres No."
                placeholder="Auto-filled"
                {...register("s1TyresNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="S2 Tyres No."
                placeholder="Auto-filled"
                {...register("s2TyresNo")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="Location"
                placeholder="Auto-filled"
                {...register("location")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="GRN Number"
                placeholder="Auto-filled"
                {...register("grnNumber")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="GRN Date"
                placeholder="Auto-filled"
                {...register("grnDate")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Input
                label="GRN Record Date"
                placeholder="Auto-filled"
                {...register("grnRecordDate")}
                readOnly
                className="cursor-not-allowed bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Action Column - 1 column with vertical border */}
        <div className="relative">
          <div className="dark:bg-dark-500 absolute top-0 left-0 h-full w-px bg-gray-300"></div>
          <div className="pl-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </label>
            <div className="mt-2 flex items-center justify-center">
              <Checkbox
                checked={isActionChecked}
                onChange={(e: any) =>
                  handleActionCheckboxChange(e.target.checked)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vehicles Table - Always shows if there's data */}
    {selectedVehicles.length > 0 && (
  <div className="mt-8">
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
      Selected Vehicles
    </h3>
    <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table
          hoverable
          className="w-full min-w-[1800px] text-left [&_.table-th]:font-semibold"
        >
          <THead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
            <Tr>
              <Th className="w-12 py-3.5 text-center">
                <input
                  type="checkbox"
                  className="size-4.5"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </Th>
              <Th className="w-16 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                S.No
              </Th>
             
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Chassis No
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Vehicle Sr. No
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Model
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Variant
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Colour
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Item Name
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Item Code
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Engine No
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                MFG Date
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Key No
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Battery No
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Battery Make
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                F1 Tyres
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                F2 Tyres
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                S1 Tyres
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                S2 Tyres
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                Location
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                GRN Number
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                GRN Date
              </Th>
              <Th className="py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                GRN Record Date
              </Th>
            </Tr>
          </THead>
          <TBody className="dark:divide-dark-700 divide-y divide-gray-200">
            {selectedVehicles.map((item, index) => {
              const isRowSelected = selectedIds.includes(item.id);
              return (
                <Tr
                  key={item.id}
                  className={`${
                    isRowSelected
                      ? "dark:bg-dark-600/30 bg-gray-50/50"
                      : ""
                  } dark:hover:bg-dark-700/40 transition-colors hover:bg-gray-50/30`}
                >
                  <Td className="py-4 text-center">
                    <input
                      type="checkbox"
                      className="size-4.5"
                      checked={isRowSelected}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </Td>
                  <Td className="py-4 font-medium text-gray-500">
                    {index + 1}
                  </Td>
                 
                  <Td className="py-4 font-mono text-sm font-medium text-gray-900 dark:text-gray-400 whitespace-nowrap">
                    {item.chassisNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.vehicleSrNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.model}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.variant}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    <span
                      className="inline-flex h-3 w-3 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: item.colour.toLowerCase(),
                      }}
                    ></span>
                    <span className="ml-1">{item.colour}</span>
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.itemName}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.itemCode}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.engineNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.mfgDate}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.keyNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.batteryNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.batteryMake}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.f1TyresNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.f2TyresNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.s1TyresNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.s2TyresNo}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.location}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.grnNumber}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.grnDate}
                  </Td>
                  <Td className="py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {item.grnRecordDate}
                  </Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AddVehicleStock;
