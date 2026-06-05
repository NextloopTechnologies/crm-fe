import { useState } from 'react';
import FormPage, { FormSection } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { UserIcon, PhoneIcon, MailIcon, LockIcon, LocationIcon, CreatedIcon } from '@/assets/icons/components/index'
import SelectDropdown from "@/components/common/SelectDropdown";
import { InlineInput } from '@/components/common/InlineInput';
import { Checkbox } from '@/components/common/Checkbox';
import { InlineSelectDropdown } from '@/components/common/InlineSelectDropDown';
import { createLead } from '@/api/leads.api';
import { CreateLeadRequest } from '@/types/api.types';
import { showToast } from '@/components/common/Toast';
import { ResponseCode } from '@/constants/statusCodes';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/route';
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

const leadStatusOptions = [
  { label: "None", value: "None" },
  { label: "Attempted to Contact", value: "Attempted to Contact" },
  { label: "Contact in Future", value: "Contact in Future" },
  { label: "Contacted", value: "Contacted" },
  { label: "Junk Lead", value: "Junk Lead" },
  { label: "Lost Lead", value: "Lost Lead" },
  { label: "Not Contacted", value: "Not Contacted" },
  { label: "Pre-Qualified", value: "Pre-Qualified" },
  { label: "Not Qualified", value: "Not Qualified" },

];

const leadSourceOptions = [
  { label: "Web", value: "Web" },
  { label: "Phone", value: "Phone" },
  { label: "Email", value: "Email" },
  { label: "Cold Call", value: "Cold Call" },
  { label: "Existing Customer", value: "Existing Customer" },
  { label: "Partner", value: "Partner" },
  { label: "Other", value: "Other" },

];

const industryOptions = [
  { label: "Technology", value: "Technology" },
  { label: "Finance", value: "Finance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Education", value: "Education" },
  { label: "Retail", value: "Retail" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Other", value: "Other" },

];

const ratingOptions = [
  { label: "None", value: "None" },
  { label: "Acquired", value: "Acquired" },
  { label: "Active", value: "Active" },
  { label: "Market Failed", value: "Market Failed" },
  { label: "Project Cancelled", value: "Project Cancelled" },
  { label: "Shut Down", value: "Shut Down" },

];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateLeadRequest>({
    company: "",
    lastName: "",
    firstName: "",
    title: "",
    email: "",
    phone: "",
    fax: "",
    mobile: "",
    website: "",
    leadSource: "",
    leadStatus: "",
    industry: "",
    noOfEmployees: "",
    annualRevenue: "",
    rating: "",
    emailOptOut: false,
    skypeId: "",
    secondaryEmail: "",
    twitter: "",

    leadAddressRequestDto: {
      country: "",
      flatNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      organizationId: localStorage.getItem("organizationId") || "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await createLead(formData);
      if (response.code === ResponseCode.SUCCESS) {
        showToast({
          title: "Lead created!",
          description: "New lead added successfully.",
          type: "success",
          icon: <CreatedIcon />
        })
        navigate(ROUTES.LEADS);
      }
    } catch (error) {
      console.error(error);

      showToast({
        title: "Failed!",
        description: "Unable to create account.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe nested update helper
  const updateAddress = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      leadAddressRequestDto: {
        ...prev.leadAddressRequestDto!,
        [key]: value,
      },
    }));
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
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            leftIcon={<BuildingIcon />}
          />
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            leftIcon={<UserIcon className='w-5 h-5' />}
          />

          <Input
            id="email"
            label="Email"
            placeholder="Enter email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<MailIcon className='w-5 h-5' />}
          />

          <Input
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />

          <Input
            id="mobile"
            label="Mobile"
            placeholder="Enter mobile number"
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />

          <Input
            id="fax"
            label="Fax"
            placeholder="Enter fax number"
            type="tel"
            value={formData.fax}
            onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />

          <Input
            id="website"
            label="Website"
            placeholder="Enter website URL"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            leftIcon={<PhoneIcon className='w-5 h-5' />}
          />
          <SelectDropdown
            label="Lead Status"
            placeholder="Select lead status"
            options={leadStatusOptions}
            value={formData.leadStatus}
            onChange={(val) => {
              setFormData({ ...formData, leadStatus: val });
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !formData.leadStatus ? "Lead status is required" : undefined}
          />


          <SelectDropdown
            label="Lead Sources"
            placeholder="Select lead source"
            options={leadSourceOptions}
            value={formData.leadSource}
            onChange={(val) => {
              setFormData({ ...formData, leadSource: val });
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !formData.leadSource ? "Lead source is required" : undefined}
          />
          <SelectDropdown
            label="Industry"
            placeholder="Select industry"
            options={industryOptions}
            value={formData.industry}
            onChange={(val) => {
              setFormData({ ...formData, industry: val });
              setTouched(true);
            }}
            required
            leftIcon={<ShieldIcon />}
            error={(touched || isSubmitted) && !formData.industry ? "Industry is required" : undefined}
          />
          <Input
            id="Number of Employees"
            label="Number of Employees"
            placeholder="Enter number of employees"
            value={formData.noOfEmployees}
            onChange={(e) => setFormData({ ...formData, noOfEmployees: e.target.value })}
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <Input
            id="Annual Revenue"
            label="Annual Revenue"
            placeholder="Enter annual revenue"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
            leftIcon={<UserIcon className='w-5 h-5' />}
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
            error={(touched || isSubmitted) && !formData.rating ? "Rating is required" : undefined}
          />
          <div className="col-span-full mt-2 pb-6">

            <div className="px-6 flex flex-col gap-2">
              <span className="text-[12px]">Email Opt Out</span>

              <Checkbox
                id="emailOptOut"
                label="Do not contact this lead via email"
                checked={formData.emailOptOut}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    emailOptOut: checked,
                  })
                }
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
        <div className=" px-6 col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <Input
            id="Skype ID"
            label="Skype ID"
            placeholder="Enter Skype ID"
            value={formData.skypeId}
            onChange={(e) => setFormData({ ...formData, skypeId: e.target.value })}
            leftIcon={<MailIcon className='w-5 h-5' />}
          />
          <Input
            id="Secondary Email"
            label="Secondary Email"
            placeholder="Enter secondary email"
            type="email"
            value={formData.secondaryEmail}
            onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
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
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 pt-6 px-6">
          <InlineInput
            id="country"
            label="Country"
            placeholder="Select country"
            value={formData.leadAddressRequestDto?.country || ''}
            onChange={(e) => setFormData({ ...formData, leadAddressRequestDto: { ...formData.leadAddressRequestDto, street: e.target.value } })}
            required
          />
          <InlineInput id="street" label="Street" placeholder="Enter street address" value={formData.leadAddressRequestDto?.street || ''} onChange={(e) => setFormData({ ...formData, leadAddressRequestDto: { ...formData.leadAddressRequestDto, street: e.target.value } })} />
          <InlineInput id="state" label="State" placeholder="Enter state / province" value={formData.leadAddressRequestDto?.state || ''} onChange={(e) => setFormData({ ...formData, leadAddressRequestDto: { ...formData.leadAddressRequestDto, state: e.target.value } })} />
          <InlineInput id="flatNo" label="Flat No." placeholder="Enter flat number" value={formData.leadAddressRequestDto?.flatNo || ''} onChange={(e) => setFormData({ ...formData, leadAddressRequestDto: { ...formData.leadAddressRequestDto, flatNo: e.target.value } })} />
          <InlineInput id="city" label="City" placeholder="Enter city" value={formData.leadAddressRequestDto?.city || ''} onChange={(e) => setFormData({ ...formData, leadAddressRequestDto: { ...formData.leadAddressRequestDto, city: e.target.value } })} />
          <InlineInput id="zipCode" label="Zip Code" placeholder="Enter zip / postal code" value={formData.leadAddressRequestDto?.zipCode || ''} onChange={(e) => setFormData({ ...formData, leadAddressRequestDto: { ...formData.leadAddressRequestDto, zipCode: e.target.value } })} />
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
