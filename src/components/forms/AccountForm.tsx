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
import { Globe, Printer, Star } from "lucide-react";

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

export interface AccountFormData {
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

interface ClientFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<AccountFormData>;
  onSubmit: (data: AccountFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function AccountForm({
  mode,
  defaultValues = {},
  onSubmit,
  isLoading,
  onCancel,
}: ClientFormProps) {
  const [form, setForm] = useState<AccountFormData>({
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
    (key: keyof AccountFormData) =>
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
      title: "Account Information",
      subtitle:
        "Capture basic details about the account.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",

      children: (
        <>
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
            value={form.firstName}
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
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
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
            id="accountName"
            label="Account Name"
            placeholder="Enter account name"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
          />

          <Input
            id="accountSite"
            label="Account Site"
            placeholder="Enter account site"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
          />

          <Input
            id="accountType"
            label="Account Type"
            placeholder="Enter account type"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
          />

          <Input
            id="rating"
            label="Rating"
            placeholder="Enter rating"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            leftIcon={
              <Star className="w-5 h-5" />
            }
          />

          <Input
            id="annualRevenue"
            label="Annual Revenue"
            placeholder="Enter annual revenue"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
          />

          <Input
            id="employees"
            label="Number of Employees"
            placeholder="Enter number of employees"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
          />

          <Input
            id="title"
            label="Title"
            placeholder="Enter title"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
            // leftIcon={
            //   <UserIcon className="w-5 h-5" />
            // }
          />
          <Input
            id="website"
            label="Website"
            placeholder="Enter website URL"
            type="url"
            value={form.website}
            onChange={(e) =>
              set("website")(e.target.value)
            }
            leftIcon={
              <Globe className="w-5 h-5" />
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
      icon: <ShieldIcon />,
      title: "Additional Information",
      subtitle: "More ways to reach and connect with the lead.",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      children: (
        <div className=" col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <Input
            id="Skype ID"
            label="Skype ID"
            placeholder="Enter Skype ID"
            // leftIcon={<MailIcon className='w-5 h-5' />}
          />
          <Input
            id="Secondary Email"
            label="Secondary Email"
            placeholder="Enter secondary email"
            type="email"
            leftIcon={<MailIcon className='w-5 h-5' />}
          />
           <Input
            id="designation"
            label="Designation"
            placeholder="Enter designation"
            // leftIcon={<MailIcon className='w-5 h-5' />}
          />
           <Input
            id="fax"
            label="Fax" 
            placeholder="Enter fax number"
            leftIcon={<Printer className='w-5 h-5' />}
          />
        </div>
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
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 -mx-6 px-6">
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
    <div className="bg-white min-h-screen  rounded-lx">
      <FormPage
        heading={
          mode === "add"
            ? "Create Account"
            : "Edit Account"
        }
        subheading={
          mode === "add"
            ? "Add a new account to the system."
            : "Update account details."
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
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {mode === "add"
                  ? "Creating..."
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