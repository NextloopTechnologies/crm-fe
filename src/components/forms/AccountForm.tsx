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
import { AccountAddressRequestDto, ContactRequestDto, CreateAccountRequest } from "@/types/api.types";
import { ROUTES } from "@/lib/route";

const ratingOptions = [
  { label: "None", value: "None" },
  { label: "Acquired", value: "Acquired" },
  { label: "Active", value: "Active" },
  { label: "Market Failed", value: "Market Failed" },
  { label: "Project Cancelled", value: "Project Cancelled" },
  { label: "Shut Down", value: "Shut Down" },
];

const ownershipOptions = [
  { label: "Public", value: "Public" },
  { label: "Private", value: "Private" },
  { label: "Subsidiary", value: "Subsidiary" },
  { label: "Other", value: "Other" },
];

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

interface ClientFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<CreateAccountRequest>;
  onSubmit: (data: CreateAccountRequest) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function AccountForm({
  mode,
  defaultValues = {},
  onSubmit,
  isLoading,
  onCancel,
}: ClientFormProps) {
  const [formData, setFormData] = useState<CreateAccountRequest>({
    accountName: "",
    accountSite: "",
    accountType: "",
    rating: "",
    website: "",
    tickerSymbol: "",
    ownership: "",
    parentAccount: "",
    employees: "",
    annualRevenue: "",

    contacts: [
      {
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        secondaryEmail: "",
        phone: "",
        mobile: "",
        skypeId: "",
        designation: "",
        department: "",
        dateOfBirth: "",
        fax: "",
      },
    ],

    addresses: [
      {
        addressType: "",
        country: "",
        flatNo: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
      },
    ],
  });

  const [touched, setTouched] = useState(false);

  const setAddress =
    (key: keyof AccountAddressRequestDto) =>
      (val: string) => {
        setFormData((prev) => ({
          ...prev,
          addresses: [
            {
              ...(prev.addresses?.[0] ?? {}),
              [key]: val,
            },
          ],
        }));
        setTouched(true);
      };

  const setContact =
    (key: keyof ContactRequestDto) =>
      (val: string) => {
        setFormData((prev) => ({
          ...prev,
          contacts: [
            {
              ...(prev.contacts?.[0] ?? {}),
              [key]: val,
            },
          ],
        }));
        setTouched(true);
      };

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...defaultValues,
      }));
    }
  }, [defaultValues]);

  const set =
    (key: keyof CreateAccountRequest) =>
      (val: string) => {
        setFormData((prev) => ({
          ...prev,
          [key]: val,
        }));
        setTouched(true);
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const sections: FormSection[] = [
    {
      icon: <UserIcon className="w-5 h-5" />,
      title: "Account Information",
      subtitle: "Capture basic details about the account.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",

      children: (
        <>
          {/* FIX 1: was `formData.` (syntax error) → formData.contacts[0].firstName */}
          {/* FIX 2: was set("firstName") (wrong helper) → setContact("firstName") */}
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
            value={formData.contacts?.[0].firstName}
            onChange={(e) => setContact("firstName")(e.target.value)}
            leftIcon={<UserIcon className="w-5 h-5" />}
          />

          {/* FIX 3: was formData.lastName / set("lastName") → contacts[0] */}
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
            value={formData.contacts?.[0].lastName}
            onChange={(e) => setContact("lastName")(e.target.value)}
          />

          {/* FIX 4: was formData.email / set("email") → contacts[0] */}
          <Input
            id="email"
            label="Email"
            placeholder="Enter email"
            type="email"
            required
            value={formData.contacts?.[0].email}
            onChange={(e) => setContact("email")(e.target.value)}
            leftIcon={<MailIcon className="w-5 h-5" />}
          />

          <Input
            id="accountName"
            label="Account Name"
            placeholder="Enter account name"
            required
            value={formData.accountName}
            onChange={(e) => set("accountName")(e.target.value)}
          />

          <Input
            id="accountSite"
            label="Account Site"
            placeholder="Enter account site"
            required
            value={formData.accountSite}
            onChange={(e) => set("accountSite")(e.target.value)}
          />

          <Input
            id="accountType"
            label="Account Type"
            placeholder="Enter account type"
            required
            value={formData.accountType}
            onChange={(e) => set("accountType")(e.target.value)}
          />

          <SelectDropdown
            label="Rating"
            placeholder="Select rating"
            options={ratingOptions}
            value={formData.rating}
            onChange={(val) => {
              setFormData({ ...formData, rating: val });
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
          />

          <SelectDropdown
            label="Ownership"
            placeholder="Select ownership"
            options={ownershipOptions}
            value={formData.ownership}
            onChange={(val) => {
              setFormData({ ...formData, ownership: val });
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
          />

          <Input
            id="annualRevenue"
            label="Annual Revenue"
            placeholder="Enter annual revenue"
            required
            value={formData.annualRevenue}
            onChange={(e) => set("annualRevenue")(e.target.value)}
          />

          <Input
            id="employees"
            label="Number of Employees"
            placeholder="Enter number of employees"
            required
            value={formData.employees}
            onChange={(e) => set("employees")(e.target.value)}
          />

          {/* FIX 5: was formData.title / set("title") → contacts[0] */}
          <Input
            id="title"
            label="Title"
            placeholder="Enter title"
            required
            value={formData.contacts?.[0].title}
            onChange={(e) => setContact("title")(e.target.value)}
          />

          <Input
            id="website"
            label="Website"
            placeholder="Enter website URL"
            type="url"
            value={formData.website}
            onChange={(e) => set("website")(e.target.value)}
            leftIcon={<Globe className="w-5 h-5" />}
          />

          {/* FIX 6: was formData.phone / set("phone") → contacts[0] */}
          <Input
            id="mobile"
            label="Mobile"
            placeholder="Enter mobile number"
            type="tel"
            value={formData.contacts?.[0].mobile}
            onChange={(e) => setContact("mobile")(e.target.value)}
            leftIcon={<PhoneIcon className="w-5 h-5" />}
          />

          <Input
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            type="tel"
            value={formData.contacts?.[0].phone}
            onChange={(e) => setContact("phone")(e.target.value)}
            leftIcon={<PhoneIcon className="w-5 h-5" />}
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
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          {/* FIX 7: all 4 inputs were uncontrolled → wired to contacts[0] via setContact */}
          <Input
            id="skypeId"
            label="Skype ID"
            placeholder="Enter Skype ID"
            value={formData.contacts?.[0].skypeId}
            onChange={(e) => setContact("skypeId")(e.target.value)}
          />
          <Input
            id="secondaryEmail"
            label="Secondary Email"
            placeholder="Enter secondary email"
            type="email"
            value={formData.contacts?.[0].secondaryEmail}
            onChange={(e) => setContact("secondaryEmail")(e.target.value)}
            leftIcon={<MailIcon className="w-5 h-5" />}
          />
          <Input
            id="designation"
            label="Designation"
            placeholder="Enter designation"
            value={formData.contacts?.[0].designation}
            onChange={(e) => setContact("designation")(e.target.value)}
          />
          <Input
            id="fax"
            label="Fax"
            placeholder="Enter fax number"
            value={formData.contacts?.[0].fax}
            onChange={(e) => setContact("fax")(e.target.value)}
            leftIcon={<Printer className="w-5 h-5" />}
          />
        </div>
      ),
    },
    {
      icon: <LocationIcon className="w-5 h-5" />,
      title: "Address Information",
      subtitle: "Capture the physical address details.",
      iconBg: "bg-[#5752FE1A]",
      iconColor: "text-[#5752FE]",

      children: (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 -mx-6 px-6">
          {/* FIX 8: was formData.addresses.country (object access on array) → addresses[0] */}
          {/* FIX 9: was missing onChange handler */}

         <InlineSelectDropdown
         id="addressType"
         label="Address Type"
         placeholder="Select address type"
         value={formData.addresses?.[0].addressType || ""}
         onChange={(val) => setAddress("addressType")(val)}
         options={[
           { label: "Billing", value: "Billing" },
           { label: "Shipping", value: "Shipping" },
           { label: "Other", value: "Other" },
         ]}
       />
       
          <InlineInput
            id="country"
            label="Country"
            placeholder="Select country"
            value={formData.addresses?.[0].country}
            onChange={(e) => setAddress("country")(e.target.value)}
            required
          />

          {/* FIX 10: was formData.addresses.street etc. → addresses[0] */}
          <InlineInput
            id="street"
            label="Street"
            placeholder="Enter street address"
            value={formData.addresses?.[0].street}
            onChange={(e) => setAddress("street")(e.target.value)}
          />

          <InlineInput
            id="state"
            label="State"
            placeholder="Enter state"
            value={formData.addresses?.[0].state}
            onChange={(e) => setAddress("state")(e.target.value)}
          />

          <InlineInput
            id="flatNo"
            label="Flat No."
            placeholder="Enter flat number"
            value={formData.addresses?.[0].flatNo}
            onChange={(e) => setAddress("flatNo")(e.target.value)}
          />

          <InlineInput
            id="city"
            label="City"
            placeholder="Enter city"
            value={formData.addresses?.[0].city}
            onChange={(e) => setAddress("city")(e.target.value)}
          />

          <InlineInput
            id="zipCode"
            label="Zip Code"
            placeholder="Enter zip code"
            value={formData.addresses?.[0].zipCode}
            onChange={(e) => setAddress("zipCode")(e.target.value)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen rounded-lx">
        <button
              onClick={() => {navigation.navigate(ROUTES.ACCOUNTS)}}
              className="flex mt-[-10px] mb-4 items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
                <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
              Back to list
            </button>
      <FormPage
        heading={mode === "add" ? "Create Account" : "Edit Account"}
        subheading={
          mode === "add"
            ? "Add a new account to the system."
            : "Update account details."
        }
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onCancel ?? (() => history.back())}
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
                {mode === "add" ? "Creating..." : "Updating..."}
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