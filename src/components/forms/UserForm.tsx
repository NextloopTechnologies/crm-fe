import { useMemo } from 'react';
import FormPage, { FormSection } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { UserIcon, PhoneIcon, MailIcon, LockIcon } from '@/assets/icons/components/index';
import SelectDropdown from "@/components/common/SelectDropdown";
import { useZodForm } from '@/hooks/useZodForm';
import { createUserFormSchema, UserFormData } from '@/schemas/user/UserFormSchema';

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const getRoleOptions = (callerRole: string) => {
  switch (callerRole.toUpperCase()) {
    case "SUPER_ADMIN":
      return [
        { label: "Admin", value: "ADMIN" },
        { label: "Manager", value: "MANAGER" },
        { label: "Sales", value: "SALES" },
      ];
    case "ADMIN":
      return [
        { label: "Manager", value: "MANAGER" },
        { label: "Sales", value: "SALES" },
      ];
    case "MANAGER":
      return [{ label: "Sales", value: "SALES" }];
    default:
      return [];
  }
};

interface UserFormProps {
  mode: "add" | "edit";
  callerRole: string;
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function UserForm({
  mode,
  callerRole,
  defaultValues = {},
  onSubmit,
  isLoading,
  onCancel,
}: UserFormProps) {


  const initialShowAssignToManager =
    ["ADMIN", "SUPER_ADMIN"].includes(callerRole.toUpperCase()) &&
    (defaultValues.roleName ?? "").toUpperCase() === "SALES";

  const schema = useMemo(
    () => createUserFormSchema(mode, initialShowAssignToManager),
    [mode, initialShowAssignToManager]
  );

  const { form, set, fieldError, handleSubmit } = useZodForm(schema, {
    username: defaultValues.username ?? "",
    password: defaultValues.password ?? "",
    email: defaultValues.email ?? "",
    firstName: defaultValues.firstName ?? "",
    lastName: defaultValues.lastName ?? "",
    phone: defaultValues.phone ?? "",
    roleName: defaultValues.roleName ?? "",
    assignToManagerUsername: defaultValues.assignToManagerUsername ?? "",
  });

  const showAssignToManager =
    ["ADMIN", "SUPER_ADMIN"].includes(callerRole.toUpperCase()) &&
    (form.roleName ?? "").toUpperCase() === "SALES";

  const handleRoleChange = (val: string) => {
    set("roleName")(val);
    if (val.toUpperCase() !== "SALES") {
      set("assignToManagerUsername")("");
    }
  };

  const roleOptions = getRoleOptions(callerRole);

  // ─── Sections ───────────────────────────────────────────────
  const sections: FormSection[] = [
    {
      icon: <UserIcon className="w-5 h-5" />,
      title: "User Information",
      subtitle: "Basic details about the user.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <>
          {mode === "add" && <Input id="username" label="Username" placeholder="Enter username" required value={form.username} onChange={(e) => set("username")(e.target.value)} leftIcon={<UserIcon className="w-5 h-5" />} error={fieldError("username")} />}
          {mode === "add" && <Input id="password" label="Password" placeholder="Enter password" required value={form.password ?? ""} onChange={(e) => set("password")(e.target.value)} type="password" leftIcon={<LockIcon className="w-5 h-5" />} error={fieldError("password")} />}
          <Input id="email"     label="Email"      placeholder="Enter email"        required value={form.email}     onChange={(e) => set("email")(e.target.value)}     type="email" leftIcon={<MailIcon className="w-5 h-5" />} error={fieldError("email")} />
          <Input id="firstName" label="First Name" placeholder="Enter first name"   required value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} leftIcon={<UserIcon className="w-5 h-5" />} error={fieldError("firstName")} />
          <Input id="lastName"  label="Last Name"  placeholder="Enter last name"    required value={form.lastName} onChange={(e) => set("lastName")(e.target.value)}  leftIcon={<UserIcon className="w-5 h-5" />} error={fieldError("lastName")} />
          <Input id="phone"     label="Phone"      placeholder="Enter phone number" required        value={form.phone}     onChange={(e) => set("phone")(e.target.value)}      type="tel" leftIcon={<PhoneIcon className="w-5 h-5" />} error={fieldError("phone")} />
        </>
      ),
    },
    {
      icon: <ShieldIcon />,
      title: "Account and Access Information",
      subtitle: "Set role and manager.",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      children: (
        <div className="-mx-7 px-6 pt-5  col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Role Dropdown */}
          {mode === "add" ? (
            // Add mode — normal dropdown
            <SelectDropdown
              label="Role Name"
              placeholder="Select a role"
              options={roleOptions}
              value={form.roleName}
              onChange={handleRoleChange}
              required
              leftIcon={<ShieldIcon />}
              error={fieldError("roleName")}
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111127]">
                Role Name
                <span className="ml-1 text-xs text-[#6b6b8d] font-normal">(cannot be changed)</span>
              </label>
              <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-[#e4e4f0] bg-[#f8f8fc] cursor-not-allowed">
                <ShieldIcon />
                <span className="text-sm text-[#6b6b8d]">
                  {form.roleName || "—"}
                </span>
                <span className="ml-auto text-xs text-[#6b6b8d]">🔒</span>
              </div>
            </div>
          )}
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
        onSubmit={handleSubmit(onSubmit)}   
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