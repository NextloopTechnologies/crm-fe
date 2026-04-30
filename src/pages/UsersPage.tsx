import { useState } from 'react';
import FormPage, { FormSection } from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { UserIcon, PhoneIcon, MailIcon, LockIcon, } from '@/assets/icons/components/index'
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // your API call here
    setTimeout(() => setLoading(false), 2000);
  };

  const sections: FormSection[] = [
    {
      icon: <UserIcon className='w-5 h-5'/>,
      title: "User Information",
      subtitle: "Basic details about the user.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <>
          <Input
            id="username"
            label="Username"
            placeholder="Enter username"
            required
            leftIcon={<UserIcon className='w-5 h-5' />}
          />
          <Input
            id="password"
            label="Password"
            placeholder="Enter password"
            type="password"
            required
            leftIcon={<LockIcon className='w-5 h-5'/>}
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
          <Input
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            type="tel"
            leftIcon={<PhoneIcon className='w-5 h-5'/>}
          />
        </>
      ),
    },
    {
      icon: <ShieldIcon />,
      title: "Account and Access Information",
      subtitle: "Set role, manager and status for the user.",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      children: (
        <>
          <Input
            id="roleName"
            label="Role Name"
            placeholder="Select role"
            required
          />
          <Input
            id="manager"
            label="Manager (Username)"
            placeholder="Select manager (optional)"
          />
          <Input
            id="orgId"
            label="Organization ID"
            placeholder="Enter organization id"
            required
            leftIcon={<BuildingIcon />}
          />
          <Input
            id="isActive"
            label="Is User Active"
            placeholder="Select status"
            required
          />
          <Input
            id="creationDate"
            label="Creation Date"
            type="datetime-local"
            required
          />
        </>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen p-4 rounded-lg">
    <FormPage
      heading="Create User"
      subheading="Add a new user to the system."
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
                'Add User'
              )}
            </Button>
      }
    />
    </div>
  );
}