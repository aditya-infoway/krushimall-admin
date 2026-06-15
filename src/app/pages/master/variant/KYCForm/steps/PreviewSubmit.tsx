// Import Dependencies
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Checkbox } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";

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
    // Save draft logic here
    console.log("Saving draft...", formData);
  };

  return (
    <div className="mt-6 max-w-4xl">
      {/* Tractor Overview Header */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gradient-to-r from-primary-50 to-transparent p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {formData.BasicInformation?.brandName 
                ? `${formData.BasicInformation.brandName} ${formData.BasicInformation.modelName}`
                : "Tractor Name"}
            </h2>
            <p className="mt-1 text-lg text-primary-600">New Tractor</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{formData.Enginedetails?.horsePower || "45"} HP</span>
              <span>2WD</span>
              <span>{formData.Enginedetails?.fuelType || "Diesel"}</span>
              <span>2024</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ex-Showroom Price</p>
            <p className="text-2xl font-bold text-primary-600">
              {/* ₹ {formData.PriceLocation?.exShowroomPrice?.toLocaleString() || "8,20,000"} */}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <PreviewSection title="Basic Information">
        <PreviewRow label="Brand" value={formData.BasicInformation?.brandName || "Swaraj"} />
        <PreviewRow label="Category" value="Utility Tractor" />
        <PreviewRow label="Model" value={formData.BasicInformation?.modelName || "744 FE"} />
        <PreviewRow label="Launch Year" value="2024" />
        <PreviewRow label="Variant" value="Standard" />
        <PreviewRow label="Country of Origin" value={formData.BasicInformation?.countryOfOrigin || "India"} />
      </PreviewSection>

      {/* Engine Details Section */}
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

      {/* Transmission Details Section */}
      {/* <PreviewSection title="Transmission Details">
        <PreviewRow label="Clutch Type" value={formData.Transmission?.clutchType || "Single Clutch"} />
        <PreviewRow label="Gear Box" value={formData.Transmission?.gearBox || "8 Forward + 2 Reverse"} />
        <PreviewRow label="PTO HP" value={formData.Transmission?.ptoHp ? `${formData.Transmission.ptoHp} HP` : "39 HP"} />
        <PreviewRow label="PTO RPM" value={formData.Transmission?.ptoRpm ? `${formData.Transmission.ptoRpm} RPM` : "540 RPM"} />
        <PreviewRow label="Gear Type" value={formData.Transmission?.gearType || "Side Shift"} />
        <PreviewRow label="Reverse PTO" value={formData.Transmission?.reversePto ? "Yes" : "No"} />
        <PreviewRow label="Transmission Type" value={formData.Transmission?.transmissionType || "Constant Mesh"} />
        <PreviewRow label="PTO Type" value={formData.Transmission?.ptoType || "Independent"} />
      </PreviewSection> */}

      {/* Hydraulic & Tyres Section */}
      <PreviewSection title="Hydraulic & Tyres">
        <PreviewRow 
          label="Lifting Capacity" 
          value={formData.HydraulicTyres?.liftingCapacity ? `${formData.HydraulicTyres.liftingCapacity} kg` : "1800 kg"} 
        />
        <PreviewRow label="Hydraulic Type" value={formData.HydraulicTyres?.addc ? "ADDC" : formData.HydraulicTyres?.hydraulicType || "Standard"} />
        <PreviewRow label="3 Point Linkage" value="Cat II" />
        <PreviewRow label="Remote Valve" value={formData.HydraulicTyres?.remoteValveType === "double_acting" ? "1 Double Acting" : "1 Single Acting"} />
        {/* <PreviewRow label="Front Tyre" value={formData.Tyres?.frontTyre || "6.00 x 16"} />
        <PreviewRow label="Rear Tyre" value={formData.Tyres?.rearTyre || "14.9 x 28"} /> */}
      </PreviewSection>

      {/* Price & Location Section */}
      {/* <PreviewSection title="Price & Location">
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
      </PreviewSection> */}

      {/* Media & Documents Section */}
      <PreviewSection title="Media & Documents">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <span className="text-lg font-bold text-blue-600">10</span>
            </div>
            <div>
              <p className="text-sm font-medium">Images</p>
              <p className="text-xs text-gray-500">+6</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <span className="text-lg font-bold text-green-600">2</span>
            </div>
            <div>
              <p className="text-sm font-medium">Videos</p>
              <p className="text-xs text-gray-500">+6</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <span className="text-lg font-bold text-purple-600">3</span>
            </div>
            <div>
              <p className="text-sm font-medium">Documents</p>
              <p className="text-xs text-gray-500">+2</p>
            </div>
          </div>
        </div>
      </PreviewSection>

      {/* Confirmation Section */}
      <div className="mt-8 rounded-lg border border-gray-200 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            I confirm that all the information provided is correct to the best of my knowledge. 
            I agree to the Terms & Conditions and Listing Policy of Tractor Junction.
          </span>
        </label>
      </div>

      {/* Info Note */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700">
        <CheckCircleIcon className="mr-2 inline h-5 w-5" />
        Once submitted, our team will review your tractor details. You will get notified via email / SMS.
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
        //   variant="outline"
          className="min-w-[7rem]"
          onClick={() => setCurrentStep(5)}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            // variant="outline"
            className="min-w-[7rem]"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            className="min-w-[7rem]"
            color="primary"
            disabled={!agreed || loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200">
      <h3 className="border-b border-gray-200 px-4 py-3 text-lg font-semibold text-gray-800">
        {title}
      </h3>
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}