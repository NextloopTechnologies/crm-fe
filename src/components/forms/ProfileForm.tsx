import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { User } from "@/data/user.data";
import { TenantFormData } from "@/components/forms/TenantForm";
import { useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Info Field (view mode)
// ─────────────────────────────────────────────────────────────

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function InfoField({ icon, label, value }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 flex items-center justify-center flex-shrink-0 text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface ProfileFormProps {
  user: User;
  mode?: "view" | "edit";
  onSubmit?: (data: TenantFormData) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
  onUploadPhoto?: () => void;
  isLoading?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

// add useRef to imports

export function ProfileForm({
  user,
  mode = "view",
  onSubmit,
  onCancel,
  onEditClick,
  onUploadPhoto,
  isLoading,
}: ProfileFormProps) {
  const initials =
    user.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const [form, setForm] = useState<TenantFormData>({
    firstName: user.name ?? "",
    lastName: "",
    industry: "",
    email: user.email ?? "",
    username: "",
    password: "",
    website: "",
    phone: user.phone ?? "",
    country: "",
    street: "",
    state: "",
    flatNo: "",
    city: "",
    zipCode: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const set = (field: keyof TenantFormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => onSubmit?.(form);

  const isEdit = mode === "edit";

  return (
    <div className="bg-white border border-gray-200 rounded-xl ">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-base font-bold text-gray-900">Personal Information</h1>
        {!isEdit && (
          <Button
            type="button"
            size="sm"
            onClick={onEditClick}
            className="flex items-center gap-1.5 !border !border-[#5752FE] !text-[#5752FE] !bg-transparent hover:!bg-[#5752FE0D] rounded-lg text-sm font-medium"
          >
            <EditIcon />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Avatar + Content */}
      <div className="flex items-start gap-[4.25rem]">

        {/* Avatar */}
        <div className="flex-shrink-0 ml-5 mt-10 flex flex-col items-center">
          <div className="relative w-[150px] h-[150px]">

            {/* Image or initials */}
            {previewUrl || user.avatar ? (
              <img
                src={previewUrl ?? user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover ring-4 ring-gray-100"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#FDE68A] flex items-center justify-center text-2xl font-bold text-yellow-800 select-none ring-4 ring-gray-100">
                {initials}
              </div>
            )}

            {/* Camera overlay — only in edit mode */}
            {isEdit && (
              <>
                <button
                  type="button"
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white border border-[#D6D6D6] flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
          {isEdit && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "1px solid #5752FE" }}
              className="mt-6 px-4 py-1.5 text-xs font-medium text-[#5752FE] bg-transparent hover:bg-[#5752FE0D] rounded-lg transition-colors"
            >
              Upload New Photo
            </button>
          )}
          {/* Remove "Upload New Photo" button since camera icon replaces it */}
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 flex-1 min-w-0">
          {isEdit ? (
            <>
              <Input id="firstName" label="Full Name" placeholder="Enter full name"
                required value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} />
              <Input id="jobTitle" label="Job Title" placeholder="Enter job title"
                required value={form.industry} onChange={(e) => set("industry")(e.target.value)} />
              <Input id="email" label="Email" placeholder="Enter email"
                required value={form.email} onChange={(e) => set("email")(e.target.value)} />
              <Input id="department" label="Department" placeholder="Enter department"
                value={form.username} onChange={(e) => set("username")(e.target.value)} />
              <Input id="phone" label="Phone Number" placeholder="Enter phone number"
                required value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
              <Input id="dob" label="Date of Birth" placeholder="Enter date of birth"
                value={form.website} onChange={(e) => set("website")(e.target.value)} />
            </>
          ) : (
            <>
              <InfoField icon={<BriefcaseIcon />} label="Full Name" value={user.name} />
              <InfoField icon={<BriefcaseIcon />} label="Role" value={user.role} />
              <InfoField icon={<BuildingIcon />} label="Email Address" value={user.email} />
              <InfoField icon={<BuildingIcon />} label="Location" value={user.location} />
              <InfoField icon={<CalendarIcon />} label="Phone Number" value={user.phone} />
              <InfoField icon={<CalendarIcon />} label="Joined At" value={user.joinedAt} />
            </>
          )}
        </div>
      </div>

      {/* Actions — only in edit mode */}
      {isEdit && (
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            style={{ border: "1.5px solid #E0E0E0" }}
            onClick={onCancel}
            className="w-28 px-4 py-1.5 text-xs font-medium text-[#5F616E] bg-transparent hover:bg-[#5752FE0D] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            type="button"
            size="sm"
            disabled={isLoading}
            loading={isLoading}
            onClick={handleSubmit}
            className="w-28 px-5 rounded-lg text-xs font-medium"
          >
            Save Changes
          </Button>
        </div>
      )}

    </div>
  );
}