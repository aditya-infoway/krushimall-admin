// Import Dependencies
import { useState } from "react";
import clsx from "clsx";
import { Combobox } from "../Combobox";

// Local Imports

// ----------------------------------------------------------------------
// 1. Data model — matches the fields shown in your reference design
// ----------------------------------------------------------------------

export interface VehicleService {
  id: string;
  label: string; // shown in the input once selected
  chassisNo: string;
  batteryNo: string;
  keyNo: string;
  awardDate: string; // e.g. "04-06-2026"
  days: number;

  motorNo: string;
}

const vehicleServices: VehicleService[] = [
  {
    id: "1",
    label: "PXDXC02VBM200594",
    chassisNo: "PXDXC02VBM200594",
    batteryNo: "T6014469D2C026709",
    keyNo: "00",
    awardDate: "04-06-2026",
    days: 0,
    motorNo: "MTC104C0X96482",
  },
  {
    id: "2",
    label: "PXDXC02VBM200811",
    chassisNo: "PXDXC02VBM200811",
    batteryNo: "T6014469D2C027120",
    keyNo: "01",
    awardDate: "12-06-2026",
    days: 3,
    motorNo: "MTC104C0X96599",
  },
  {
    id: "3",
    label: "PXDXC02VBM201002",
    chassisNo: "PXDXC02VBM201002",
    batteryNo: "T6014469D2C027344",
    keyNo: "00",
    awardDate: "20-06-2026",
    days: 5,
    motorNo: "MTC104C0X96741",
  },
];

// ----------------------------------------------------------------------
// 2. A small reusable "label: value" row used inside the detail card
// ----------------------------------------------------------------------

const DetailRow = ({
  label,
  value,
  badge,
  highlighted,
  align = "left",
}: {
  label: string;
  value: string | number;
  badge?: boolean;
  highlighted: boolean;
  align?: "left" | "right";
}) => (
  <div
    className={clsx(
      "flex items-center gap-1.5 text-[11px] leading-5 sm:text-xs",
      align === "right" && "justify-end",
    )}
  >
    <span className="font-semibold">{label}:</span>
    {badge ? (
      <span
        className={clsx(
          "rounded px-1.5 py-0.5 text-[10px] font-semibold",
          highlighted
            ? "bg-white/25 text-white"
            : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
        )}
      >
        {value}
      </span>
    ) : (
      <span className={clsx(!highlighted && "text-gray-600 dark:text-dark-200")}>
        {value}
      </span>
    )}
  </div>
);

// ----------------------------------------------------------------------
// 3. The option renderer — this is what reproduces the design 1:1
// ----------------------------------------------------------------------

 const renderVehicleOption = (
  item: VehicleService,
  { selected, active }: { selected: boolean; active: boolean; query: string },
) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-x-3 gap-y-1 border-b px-4 py-3 transition-colors last:border-b-0",
        selected
          ? "border-red-700/40 bg-red-600 text-white"
          : active
            ? "dark:bg-dark-600 dark:border-dark-500 border-gray-100 bg-gray-100 text-gray-800"
            : "dark:bg-dark-750 dark:border-dark-600 dark:text-dark-100 border-gray-100 bg-white text-gray-800",
      )}
    >
      {/* Left column */}
      <div className="space-y-1">
        <DetailRow label="Chassis No" value={item.chassisNo} highlighted={selected} />
        <DetailRow label="Battery No" value={item.batteryNo} highlighted={selected} />
        <DetailRow label="Key No" value={item.keyNo} highlighted={selected} />
      </div>

      {/* Right column */}
      <div className="space-y-1">
        <DetailRow
          label="Award Date"
          value={item.awardDate}
          badge
          align="right"
          highlighted={selected}
        />
        <DetailRow
          label="Days"
          value={item.days}
          badge
          align="right"
          highlighted={selected}
        />
        <DetailRow
          label="Motor No"
          value={item.motorNo}
          align="right"
          highlighted={selected}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. The full working example: search + select
// ----------------------------------------------------------------------

export default function VehicleServiceCombobox() {
  const [selected, setSelected] = useState<VehicleService | null>(null);

  return (
    <div className="mx-auto w-full max-w-xl p-4">
      <Combobox<VehicleService>
        data={vehicleServices}
        value={selected}
        onChange={(val) => setSelected(val)}
        displayField="label"
        searchFields={["chassisNo", "batteryNo", "keyNo", "motorNo"]}
        placeholder="Select Service"
        renderOption={renderVehicleOption}
        classNames={{ root: "w-full" }}
      />

      {/* Selected summary card below the combobox, same red design */}
      {selected && (
        <div className="mt-3 overflow-hidden rounded-lg">
          {renderVehicleOption(selected, {
            selected: true,
            active: false,
            query: "",
          })}
        </div>
      )}
    </div>
  );
}