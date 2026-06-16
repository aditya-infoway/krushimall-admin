// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import { useState } from "react";

// Local Imports
import { Button, Input } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { MediaDocumnetSchema, MediaDocumnetType } from "../schema";

// ----------------------------------------------------------------------

// Image upload fields
const imageUploads = [
  { key: "frontView", label: "Front View", required: true },
  { key: "leftView", label: "Left View", required: true },
  { key: "rightView", label: "Right View", required: true },
  { key: "rearView", label: "Rear View", required: true },
  { key: "engineView", label: "Engine View", required: true },
  { key: "dashboardView", label: "Dashboard View", required: true },
  { key: "tyreView", label: "Tyre View", required: true },
  { key: "hydraulicView", label: "Hydraulic View", required: true },
  { key: "ptoView", label: "PTO View", required: true },
  { key: "chassisNumber", label: "Chassis Number", required: true },
  { key: "rcBook", label: "RC Book", required: true },
  { key: "additionalImage1", label: "Additional Image 1", required: false },
  { key: "additionalImage2", label: "Additional Image 2", required: false },
  { key: "additionalImage3", label: "Additional Image 3", required: false },
  { key: "additionalImage4", label: "Additional Image 4", required: false },
  { key: "additionalImage5", label: "Additional Image 5", required: false },
];

// Video upload fields
const videoUploads = [
  { key: "walkaroundVideo", label: "Walkaround Video" },
  { key: "engineStartVideo", label: "Engine Start Video" },
  { key: "ptoDemoVideo", label: "PTO Demo Video" },
  { key: "hydraulicDemoVideo", label: "Hydraulic Demo Video" },
];

// Document upload fields
const documentUploads = [
  { key: "brochure", label: "Brochure / Spec Sheet", required: true },
  { key: "warrantyCard", label: "Warranty Card", required: true },
  { key: "insuranceCertificate", label: "Insurance Certificate", required: true },
  { key: "invoice", label: "Invoice", required: true },
  { key: "others", label: "Others (Optional)", required: false },
];

export function MediaDocumnet({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();
  const [loading, setLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MediaDocumnetType>({
   resolver: yupResolver(MediaDocumnetSchema) as unknown as Resolver<MediaDocumnetType>,
    defaultValues: kycFormCtx.state.formData.MediaDocumnet,
  });

  const handleFileChange = (key: string, file: File | null) => {
    if (file) {
      setValue(key as any, file);
    }
  };

  const handleYoutubeLinkChange = (key: string, link: string) => {
    setYoutubeLinks((prev) => ({ ...prev, [key]: link }));
    setValue(`${key}Link` as any, link);
  };

  const onSubmit = (data: MediaDocumnetType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      kycFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: { MediaDocumnet: { ...data } },
      });
      kycFormCtx.dispatch({
        type: "SET_STEP_STATUS",
        payload: { MediaDocumnet: { isDone: true } },
      });
      setCurrentStep(5);
    }, 500);
  };

  const handleSaveDraft = () => {
    const formData = watch();
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { MediaDocumnet: { ...formData } },
    });
    // Show toast notification here if needed
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-8">
        {/* Images Upload Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Images Upload</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload images of your tractor from different angles
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imageUploads.map((image) => (
              <div key={image.key} className="rounded-lg border border-dashed border-gray-300 p-3">
                <label className="mb-1 block text-sm font-medium">
                  {image.label}
                  {image.required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(image.key, e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                />
                {errors[image.key as keyof MediaDocumnetType] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[image.key as keyof MediaDocumnetType]?.message as string}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG (Max: 5MB)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Videos Uploads Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Videos Uploads</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload videos or add YouTube link (Optional)
          </p>

          <div className="space-y-6">
            {videoUploads.map((video) => (
              <div key={video.key} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <h4 className="mb-3 font-medium text-gray-700">{video.label}</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Upload Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(video.key, e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      or Paste YouTube link
                    </label>
                    <Input
                      placeholder="https://youtube.com/..."
                      value={youtubeLinks[video.key] || ""}
                      onChange={(e) => handleYoutubeLinkChange(video.key, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Supported formats: MP4, MOV, AVI (Max size: 50MB)
          </p>
        </div>

        {/* Documents Uploads Section */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Documents Uploads</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload tractor related documents
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {documentUploads.map((doc) => (
              <div key={doc.key} className="rounded-lg border border-dashed border-gray-300 p-3">
                <label className="mb-1 block text-sm font-medium">
                  {doc.label}
                  {doc.required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                />
                {errors[doc.key as keyof MediaDocumnetType] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[doc.key as keyof MediaDocumnetType]?.message as string}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  PDF (Max size: 5MB)
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Supported format: PDF (Max size: 10MB)
          </p>
        </div>

        {/* Required Fields Note */}
        <div className="text-sm text-gray-500">
          * Marked fields are mandatory
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outlined"
          className="min-w-[7rem]"
          onClick={() => setCurrentStep(4)}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outlined"
            className="min-w-[7rem]"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            className="min-w-[7rem]"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Next"}
          </Button>
        </div>
      </div>
    </form>
  );
}