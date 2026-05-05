// components/forms/UserForm.tsx

import { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import SelectDropdown from "@/components/common/SelectDropdown";
import { UserIcon, PhoneIcon, MailIcon, LockIcon } from '@/assets/icons/components';

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Developer", value: "developer" },
  { label: "Viewer", value: "viewer" },
];

export function getUserFormSections({
  role,
  setRole,
  touched,
  isSubmitted,
}: any): FormSection[] {
  return [
    {
      icon: <UserIcon className='w-5 h-5' />,
      title: "User Information",
      subtitle: "Basic details about the user.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <>
          <Input id="username" label="Username" />
          <Input id="password" label="Password" type="password" />
          <Input id="email" label="Email" type="email" />
          <Input id="firstName" label="First Name" />
          <Input id="lastName" label="Last Name" />
          <Input id="phone" label="Phone" />
        </>
      ),
    },
    {
      icon: <ShieldIcon />,
      title: "Account and Access Information",
      subtitle: "Set role, manager.",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      children: (
        <div className="-mx-7 px-6 pt-10 border-t-[1.5px] border-[#ECECEC] col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <SelectDropdown
            label="Role Name"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
            }}
            error={(touched || isSubmitted) && !role ? "Role is required" : undefined}
          />

          <SelectDropdown
            label="Manager"
            options={roleOptions}
            value={role}
            onChange={(val) => {
              setRole(val);
            }}
          />
        </div>
      ),
    },
  ];
}