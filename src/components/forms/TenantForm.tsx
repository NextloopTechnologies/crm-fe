import { useEffect, useState } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";
import { InlineInput } from "@/components/common/InlineInput";
import { InlineSelectDropdown } from "@/components/common/InlineSelectDropDown";

import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  EyeOffIcon,
} from "@/assets/icons/components/index";

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Dropdown Options
// ─────────────────────────────────────────────────────────────

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Developer", value: "developer" },
  { label: "Viewer", value: "viewer" },
];

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface TenantFormData {
  firstName: string;
  lastName: string;
  industry: string;
  email: string;
  username: string;
  password: string;
  website: string;
  phone: string;

  country: string;
  street: string;
  state: string;
  flatNo: string;
  city: string;
  zipCode: string;
}

interface TenantFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<TenantFormData>;
  onSubmit: (data: TenantFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function TenantForm({
  mode,
  defaultValues = {},
  onSubmit,
  isLoading,
  onCancel,
}: TenantFormProps) {
  const [form, setForm] = useState<TenantFormData>({
    firstName: defaultValues.firstName ?? "",
    lastName: defaultValues.lastName ?? "",
    industry: defaultValues.industry ?? "",
    email: defaultValues.email ?? "",
    username: defaultValues.username ?? "",
    password: defaultValues.password ?? "",
    website: defaultValues.website ?? "",
    phone: defaultValues.phone ?? "",

    country: defaultValues.country ?? "",
    street: defaultValues.street ?? "",
    state: defaultValues.state ?? "",
    flatNo: defaultValues.flatNo ?? "",
    city: defaultValues.city ?? "",
    zipCode: defaultValues.zipCode ?? "",
  });

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (
      defaultValues &&
      Object.keys(defaultValues).length > 0
    ) {
      setForm((prev) => ({
        ...prev,
        ...defaultValues,
      }));
    }
  }, [defaultValues]);

  const set =
    (key: keyof TenantFormData) =>
    (val: string) => {
      setForm((prev) => ({
        ...prev,
        [key]: val,
      }));

      setTouched(true);
    };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    onSubmit(form);
  };

  // ───────────────────────────────────────────────────────────
  // Sections
  // ───────────────────────────────────────────────────────────

  const sections: FormSection[] = [
    {
      icon: <UserIcon className="w-5 h-5" />,
      title: "Tenant Information",
      subtitle:
        "Capture basic details about the tenant.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",

      children: (
        <>
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
            value={form.email}
            onChange={(e) =>
              set("firstName")(e.target.value)
            }
            leftIcon={
              <UserIcon className="w-5 h-5" />
            }
          />

          <Input
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
            value={form.email}
            onChange={(e) =>
              set("lastName")(e.target.value)
            }
            leftIcon={
              <UserIcon className="w-5 h-5" />
            }
          />

          <SelectDropdown
            label="Industry"
            placeholder="Select industry"
            options={roleOptions}
            value={form.industry}
            onChange={set("industry")}
            required
            leftIcon={<ShieldIcon />}
            error={
              touched && !form.industry
                ? "Industry is required"
                : undefined
            }
          />

          <Input
            id="email"
            label="Email"
            placeholder="Enter email"
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              set("email")(e.target.value)
            }
            leftIcon={
              <MailIcon className="w-5 h-5" />
            }
          />

          <Input
            id="username"
            label="Username"
            placeholder="Enter username"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            leftIcon={
              <UserIcon className="w-5 h-5" />
            }
          />

          {mode === "add" && (
            <Input
              id="password"
              label="Password"
              placeholder="Enter password"
              required
              type="password"
              value={form.password}
              onChange={(e) =>
                set("password")(e.target.value)
              }
              leftIcon={
                <EyeOffIcon className="w-5 h-5" />
              }
            />
          )}

          <Input
            id="website"
            label="Website"
            placeholder="Enter website URL"
            type="url"
            value={form.website}
            onChange={(e) =>
              set("website")(e.target.value)
            }
          />

          <Input
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            type="tel"
            value={form.phone}
            onChange={(e) =>
              set("phone")(e.target.value)
            }
            leftIcon={
              <PhoneIcon className="w-5 h-5" />
            }
          />
        </>
      ),
    },

    {
      icon: (
        <LocationIcon className="w-5 h-5" />
      ),

      title: "Address Information",

      subtitle:
        "Capture the physical address details.",

      iconBg: "bg-[#5752FE1A]",
      iconColor: "text-[#5752FE]",

      children: (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 pt-6 -mx-6 px-6">
          <InlineSelectDropdown
            id="country"
            label="Country"
            placeholder="Select country"
            options={roleOptions}
            value={form.country}
            onChange={set("country")}
            required
            leftIcon={<ShieldIcon />}
            error={
              touched && !form.country
                ? "Country is required"
                : undefined
            }
          />

          <InlineInput
            id="street"
            label="Street"
            placeholder="Enter street address"
            value={form.street}
            onChange={(e) =>
              set("street")(e.target.value)
            }
          />

          <InlineInput
            id="state"
            label="State"
            placeholder="Enter state"
            value={form.state}
            onChange={(e) =>
              set("state")(e.target.value)
            }
          />

          <InlineInput
            id="flatNo"
            label="Flat No."
            placeholder="Enter flat number"
            value={form.flatNo}
            onChange={(e) =>
              set("flatNo")(e.target.value)
            }
          />

          <InlineInput
            id="city"
            label="City"
            placeholder="Enter city"
            value={form.city}
            onChange={(e) =>
              set("city")(e.target.value)
            }
          />

          <InlineInput
            id="zipCode"
            label="Zip Code"
            placeholder="Enter zip code"
            value={form.zipCode}
            onChange={(e) =>
              set("zipCode")(e.target.value)
            }
          />
        </div>
      ),
    },
  ];

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="bg-white min-h-screen rounded-lx">
      <FormPage
        heading={
          mode === "add"
            ? "Create Tenant"
            : "Edit Tenant"
        }
        subheading={
          mode === "add"
            ? "Add a new tenant to the system."
            : "Update tenant details."
        }
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={
          onCancel ??
          (() => history.back())
        }
        isLoading={isLoading}
        submitLabel={
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {mode === "add"
                  ? "Saving..."
                  : "Updating..."}
              </div>
            ) : mode === "add" ? (
              "Save"
            ) : (
              "Update"
            )}
          </Button>
        }
      />
    </div>
  );
}