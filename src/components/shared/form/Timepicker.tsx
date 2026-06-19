// ─── Timepicker.tsx ──────────────────────────────────────────────────────────
import { DatePicker } from "@/components/shared/form/Datepicker";

interface TimepickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Timepicker = ({
  value,
  onChange,
  placeholder = "Select time...",
  className = "",
}: TimepickerProps) => {
  return (
    <div className={`max-w-xl ${className}`}>
      <DatePicker
        options={{
          enableTime: true,
          noCalendar: true,
          time_24hr: true, // Use 24-hour format
          minuteIncrement: 1,
          enableSeconds: false,
          // For desktop clock view
          static: false,
          position: "auto",
          clickOpens: true,
          // Time format for display
          dateFormat: "H:i", // 24-hour format, or "h:i K" for 12-hour with AM/PM
        }}
        placeholder={placeholder}
        value={value}
        onChange={(selectedDates: Date[]) => {
          const value = selectedDates[0]?.toLocaleTimeString() || "";
          // Call your onChange with the string value
          if (onChange) onChange(value);
        }}
      />
    </div>
  );
};

export { Timepicker };
