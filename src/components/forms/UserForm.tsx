import { useEffect, useState } from 'react';
import FormPage, { FormSection } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { UserIcon, PhoneIcon, MailIcon, LockIcon } from '@/assets/icons/components/index';
import SelectDropdown from "@/components/common/SelectDropdown";

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Developer", value: "developer" },
  { label: "Viewer", value: "viewer" },
];

export interface UserFormData {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  manager: string
}

interface UserFormProps {
  mode: "add" | "edit"
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => void
  isLoading?: boolean
  onCancel?: () => void
}

export default function UserForm({ mode, defaultValues = {}, onSubmit, isLoading, onCancel }: UserFormProps) {
  const [form, setForm] = useState<UserFormData>({
    username:  defaultValues?.username  ?? "",
    password:  defaultValues?.password  ?? "",
    email:     defaultValues?.email     ?? "",
    firstName: defaultValues?.firstName ?? "",
    lastName:  defaultValues?.lastName  ?? "",
    phone:     defaultValues?.phone     ?? "",
    role:      defaultValues?.role      ?? "",
    manager:   defaultValues?.manager   ?? "",
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setForm({
        username:  defaultValues.username  ?? "",
        password:  defaultValues.password  ?? "",
        email:     defaultValues.email     ?? "",
        firstName: defaultValues.firstName ?? "",
        lastName:  defaultValues.lastName  ?? "",
        phone:     defaultValues.phone     ?? "",
        role:      defaultValues.role      ?? "",
        manager:   defaultValues.manager   ?? "",
      });
    }
  }, [defaultValues]);

  const set = (key: keyof UserFormData) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const sections: FormSection[] = [
    {
      icon: <UserIcon className="w-5 h-5" />,
      title: "User Information",
      subtitle: "Basic details about the user.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <>
          <Input id="username"  label="Username"   placeholder="Enter username"     required value={form.email}  onChange={(e) => set("username")(e.target.value)}  leftIcon={<UserIcon className="w-5 h-5" />} />
          {mode === "add" && (
            <Input id="password" label="Password"  placeholder="Enter password"     required value={form.email}  onChange={(e) => set("password")(e.target.value)}  type="password" leftIcon={<LockIcon className="w-5 h-5" />} />
          )}
          <Input id="email"     label="Email"      placeholder="Enter email"        required value={form.email}     onChange={(e) => set("email")(e.target.value)}     type="email" leftIcon={<MailIcon className="w-5 h-5" />} />
          <Input id="firstName" label="First Name" placeholder="Enter first name"   required value={form.email} onChange={(e) => set("firstName")(e.target.value)} leftIcon={<UserIcon className="w-5 h-5" />} />
          <Input id="lastName"  label="Last Name"  placeholder="Enter last name"    required value={form.email}  onChange={(e) => set("lastName")(e.target.value)}  leftIcon={<UserIcon className="w-5 h-5" />} />
          <Input id="phone"     label="Phone"      placeholder="Enter phone number"          value={form.phone}     onChange={(e) => set("phone")(e.target.value)}     type="tel" leftIcon={<PhoneIcon className="w-5 h-5" />} />
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
        <div className="-mx-7 px-6 pt-5  col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <SelectDropdown label="Role Name" placeholder="Select a role" options={roleOptions} value={form.role} onChange={set("role")} required leftIcon={<ShieldIcon />} error={touched && !form.role ? "Role is required" : undefined} />
          <SelectDropdown label="Manager"   placeholder="Select a manager" options={roleOptions} value={form.manager} onChange={set("manager")} required leftIcon={<ShieldIcon />} error={touched && !form.manager ? "Manager is required" : undefined} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen rounded-lx">
      <FormPage
        heading={mode === "add" ? "Create User" : "Edit User"}
        subheading={mode === "add" ? "Add a new user to the system." : "Update user details."}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onCancel ?? (() => history.back())}
        isLoading={isLoading}
        submitLabel={
          <Button type="submit" variant="primary" size="lg" fullWidth className="mt-1" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {mode === "add" ? "Creating..." : "Updating..."}
              </div>
            ) : mode === "add" ? "Add User" : "Update User"}
          </Button>
        }
      />
    </div>
  );
}