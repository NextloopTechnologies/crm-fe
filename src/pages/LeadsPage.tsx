import { useState } from 'react';
import FormPage, { FormSection } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { UserIcon, PhoneIcon, MailIcon, LockIcon, LocationIcon } from '@/assets/icons/components/index'
import SelectDropdown from "@/components/common/SelectDropdown";
import { InlineInput } from '@/components/common/InlineInput';
import { Checkbox } from '@/components/common/Checkbox';
import { InlineSelectDropdown } from '@/components/common/InlineSelectDropDown';
// ── Icons ─────────────────────────────────────────────────────────────────────


const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AddUserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="16" y1="11" x2="22" y2="11" />
  </svg>
);

// flat options
const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Developer", value: "developer" },
  { label: "Viewer", value: "viewer" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // your API call here
    setTimeout(() => setLoading(false), 2000);
  };

  const sections: FormSection[] = [
    {
      icon: <UserIcon className='w-5 h-5' />,
      title: "Leads Information",
      subtitle: "Basic details about the lead.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <>
          <Input
            id="companyName"
            label="Company Name"
            placeholder="Enter company name"
            required
            leftIcon={<BuildingIcon />}
          />
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <SelectDropdown
            label="Lead Status"
            placeholder="Select lead status"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !role ? "Role is required" : undefined}
          />
          <Input
            id="title"
            label="Title"
            placeholder="Enter title"
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <Input
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            type="tel"
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />
          <Input
            id="email"
            label="Email"
            placeholder="Enter email"
            type="email"
            required
            leftIcon={<MailIcon className='w-5 h-5' />}
          />
          <Input
            id="fax"
            label="Fax"
            placeholder="Enter fax number"
            type="tel"
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />
          <Input
            id="website"
            label="Website"
            placeholder="Enter website URL"
            type="url"
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />
          <SelectDropdown
            label="Lead Sources"
            placeholder="Select lead source"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !role ? "Role is required" : undefined}
          />
          <SelectDropdown
            label="Industry"
            placeholder="Select industry"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !role ? "Role is required" : undefined}
          />
          <Input
            id="Number of Employees"
            label="Number of Employees"
            placeholder="Enter number of employees"
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <Input
            id="Annual Revenue"
            label="Annual Revenue"
            placeholder="Enter annual revenue"
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <SelectDropdown
            label="Rating"
            placeholder="Select rating"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !role ? "Role is required" : undefined}
          />
          <div className="col-span-full -mx-7 border-b-[1.5px] border-[#ECECEC] mt-2 pb-6">

            <div className="px-6 flex flex-col gap-2">
              <span className="text-[12px]">Email Opt Out</span>

              <Checkbox
                className="border-[#dcdcf0] hover:border-[#5b5bd6]"
                labelClassName="text-[12px]"
                id="rememberMe"
                label="Do not contact this lead via email"
              />
            </div>

          </div>
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
        <div className="-mx-7 px-6 pt-10 pb-10 border-b-[1.5px] border-[#ECECEC] col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <Input
            id="Skype ID"
            label="Skype ID"
            placeholder="Enter Skype ID"
            leftIcon={<MailIcon className='w-5 h-5' />}
          />
          <Input
            id="Secondary Email"
            label="Secondary Email"
            placeholder="Enter secondary email"
            type="email"
            leftIcon={<MailIcon className='w-5 h-5' />}
          />
        </div>
      ),
    },
    {
      icon: <LocationIcon className='w-5 h-5' />,
      title: "Address Information",
      subtitle: "Capture the physical address and location details.",
      iconBg: "bg-[#5752FE1A]",
      iconColor: "text-[#5752FE]",
      children: (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 pt-6 -mx-6 px-6">
          <InlineInput id="flatNo" label="Flat No." placeholder="Enter flat number" />
          <InlineInput id="zipCode" label="Zip Code" placeholder="Enter zip / postal code" />
          <InlineInput id="street" label="Street" placeholder="Enter street address" />
          <InlineInput id="latitude" label="Latitude" placeholder="Enter latitude" />
          <InlineInput id="city" label="City" placeholder="Enter city" />
          <InlineInput id="longitude" label="Longitude" placeholder="Enter longitude" />
          <InlineInput id="state" label="State" placeholder="Enter state / province" />
          <InlineSelectDropdown
            id="country"
            label="Country"
            placeholder="Select country"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !role ? "Role is required" : undefined}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen p-4 rounded-lx">
      <FormPage
        heading="Create Lead"
        subheading="Add a new lead to the system."
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={() => history.back()}
        isLoading={loading}
        submitLabel={
          <Button type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-1"
            disabled={loading}>
            {loading ? (
              <div className='flex items-center gap-2'>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent">
                  Creating.....
                </span>
              </div>) : (
              'Add Lead'
            )}
          </Button>
        }
      />
    </div>
  );
}