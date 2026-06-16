// Import Dependencies
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import {
  Gauge,
  Tractor,
  Fuel,
  CalendarDays,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronLeft,
  Save,
  Send,
} from "lucide-react";
// ----------------------------------------------------------------------

export function PreviewSubmit({
  setCurrentStep,
  setFinished,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const kycFormCtx = useKYCFormContext();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const formData = kycFormCtx.state.formData;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFinished(true);
    }, 2000);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...", formData);
  };

  return (
    <div className="mt-6 ">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        Dashboard &gt; New Tractor &gt; Add New Tractor &gt;{" "}
        <span className="text-primary-600 font-medium">Preview &amp; Submit</span>
      </div>

      {/* Tractor Overview Header - Redesigned to match image */}
      <div className="mb-8 rounded-xl border border-gray-200  p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-800">Tractor Overview</h3>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left - Images */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100" style={{ minHeight: "200px" }}>
              <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                <Tractor className="h-20 w-20 text-gray-400" />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="h-14 w-14 rounded border border-gray-200  object-cover"
                />
              ))}
              <div className="flex h-14 w-14 items-center justify-center rounded border border-gray-200 b text-sm font-medium text-gray-600">
                +6
              </div>
            </div>
          </div>

          {/* Center - Details */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {formData.BasicInformation?.brandName || "Swaraj"} {formData.BasicInformation?.modelName || "744 FE"}
              </h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                New Tractor
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{formData.Enginedetails?.horsePower || 45} HP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tractor className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">2WD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{formData.Enginedetails?.fuelType || "Diesel"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{formData.BasicInformation?.modelYear || 2024}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Ex-Showroom Price
              </p>
              <h3 className="mt-1 text-3xl font-bold text-primary-600">
                ₹ {formData.PriceLocation?.exShowroomPrice?.toLocaleString() || "8,20,000"}
              </h3>
            </div>
          </div>

          {/* Right - Highlights */}
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <h4 className="mb-3 text-sm font-semibold text-gray-700">Key Highlights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Power Steering
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Oil Immersed Brakes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Multi Speed PTO
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> High Lifting Capacity
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Fuel Efficient Engine
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections - Updated styling */}
      <div className="space-y-6">
        {/* Basic Information */}
        <PreviewSection title="Basic Information" >
          
          <PreviewRow label="Brand" value={formData.BasicInformation?.brandName || "Swaraj"} />
          <PreviewRow label="Category" value="Utility Tractor" />
          <PreviewRow label="Model" value={formData.BasicInformation?.modelName || "744 FE"} />
          <PreviewRow label="Launch Year" value={formData.BasicInformation?.modelYear?.toString() || "2024"} />
          <PreviewRow label="Variant" value="Standard" />
          <PreviewRow label="Country of Origin" value={formData.BasicInformation?.country || "India"} />
        </PreviewSection>

        {/* Engine Details */}
        <PreviewSection title="Engine Details">
          <PreviewRow label="Engine Type" value={formData.Enginedetails?.engineType || "4 Stroke, Direct Injection"} />
          <PreviewRow label="Fuel Type" value={formData.Enginedetails?.fuelType || "Diesel"} />
          <PreviewRow label="Rated RPM" value={formData.Enginedetails?.ratedRpm ? `${formData.Enginedetails.ratedRpm} RPM` : "2000 RPM"} />
          <PreviewRow label="Engine Capacity" value={formData.Enginedetails?.horsePower ? `${formData.Enginedetails.horsePower} HP` : "45 HP"} />
          <PreviewRow label="HP Category" value={formData.Enginedetails?.horsePower ? `${formData.Enginedetails.horsePower} HP` : "45 HP"} />
          <PreviewRow label="Cooling System" value={formData.Enginedetails?.coolingSystem || "Water Cooled"} />
          <PreviewRow label="Max Torque" value={formData.Enginedetails?.maximumTorque ? `${formData.Enginedetails.maximumTorque} Nm` : "185 Nm"} />
          <PreviewRow label="Torque Backup" value={formData.Enginedetails?.torqueBackup ? `${formData.Enginedetails.torqueBackup}%` : "20%"} />
        </PreviewSection>

        {/* Transmission Details */}
        <PreviewSection title="Transmission Details">
          <PreviewRow label="Clutch Type" value={formData.Transmission?.clutchType || "Single Clutch"} />
          <PreviewRow label="Gear Box" value={formData.Transmission?.gearBox || "8 Forward + 2 Reverse"} />
          <PreviewRow label="PTO HP" value={formData.Transmission?.ptoHp ? `${formData.Transmission.ptoHp} HP` : "39 HP"} />
          <PreviewRow label="PTO RPM" value={formData.Transmission?.ptoRpm ? `${formData.Transmission.ptoRpm} RPM` : "540 RPM"} />
          <PreviewRow label="Gear Type" value={formData.Transmission?.gearType || "Side Shift"} />
          <PreviewRow label="Reverse PTO" value={formData.Transmission?.reversePto ? "Yes" : "No"} />
          <PreviewRow label="Transmission Type" value={formData.Transmission?.transmissionType || "Constant Mesh"} />
          <PreviewRow label="PTO Type" value={formData.Transmission?.ptoType || "Independent"} />
        </PreviewSection>

        {/* Hydraulic & Tyres */}
        <PreviewSection title="Hydraulic &amp; Tyres">
          <PreviewRow 
            label="Lifting Capacity" 
            value={formData.HydraulicTyres?.liftingCapacity ? `${formData.HydraulicTyres.liftingCapacity} kg` : "1800 kg"} 
          />
          <PreviewRow label="Hydraulic Type" value={formData.HydraulicTyres?.addc ? "ADDC" : formData.HydraulicTyres?.hydraulicType || "Standard"} />
          <PreviewRow label="3 Point Linkage" value="Cat II" />
          <PreviewRow label="Remote Valve" value={formData.HydraulicTyres?.remoteValveType === "double_acting" ? "1 Double Acting" : "1 Single Acting"} />
          <PreviewRow label="Front Tyre" value={formData.Tyres?.frontTyre || "6.00 x 16"} />
          <PreviewRow label="Rear Tyre" value={formData.Tyres?.rearTyre || "14.9 x 28"} /> 
        </PreviewSection>

        {/* Price & Location */}
        <PreviewSection title="Price &amp; Location">
          <PreviewRow 
            label="Ex-Showroom Price" 
            value={formData.PriceLocation?.exShowroomPrice ? `₹ ${formData.PriceLocation.exShowroomPrice.toLocaleString()}` : "₹ 8,20,000"} 
          />
          <PreviewRow 
            label="On-Road Price" 
            value={formData.PriceLocation?.onRoadPrice ? `₹ ${formData.PriceLocation.onRoadPrice.toLocaleString()}` : "₹ 9,35,000"} 
          />
          <PreviewRow label="Finance Available" value={formData.PriceLocation?.financeAvailable ? "Yes" : "No"} />
          <PreviewRow label="EMI Available" value={formData.PriceLocation?.emiAvailable ? "Yes" : "No"} />
          <PreviewRow label="Location" value={formData.PriceLocation?.location || "Haryana, India"} />
          <PreviewRow label="Pincode" value={formData.PriceLocation?.pincode || "122001"} />
        </PreviewSection>

        {/* Media & Documents - Redesigned to match image */}
        <div className="rounded-xl border border-gray-200  p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Media &amp; Documents</h3>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <ImageIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">10 Images</p>
                <p className="text-xs text-gray-400">+6</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <Video className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">2 Videos</p>
                <p className="text-xs text-gray-400">+6</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">3 Documents</p>
                <p className="text-xs text-gray-400">+2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Section - Redesigned */}
      <div className="mt-8 rounded-xl border border-gray-200  p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            I confirm that all the information provided is correct to the best of my knowledge. 
            I agree to the <a href="#" className="text-primary-600 hover:underline">Terms &amp; Conditions</a> and{" "}
            <a href="#" className="text-primary-600 hover:underline">Listing Policy</a> of Tractor Junction.
          </span>
        </label>
      </div>

      {/* Info Note - Redesigned */}
      <div className="mt-4 rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700 border border-blue-100">
        <CheckCircleIcon className="mr-2 inline h-5 w-5" />
        Once submitted, our team will review your tractor details. You will get notified via email / SMS.
      </div>

      {/* Action Buttons - Redesigned */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <Button
          type="button"
          variant="outlined"
          className="min-w-[7rem] flex items-center gap-2"
          onClick={() => setCurrentStep(5)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outlined"
            className="min-w-[7rem] flex items-center gap-2"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            type="button"
            className="min-w-[7rem] flex items-center gap-2"
            color="primary"
            disabled={!agreed || loading}
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper Components - Improved styling
function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200  shadow-sm overflow-hidden">
      <h3 className="border-b border-gray-100  px-5 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}