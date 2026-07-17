import { useEffect, useState } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import {
  UserIcon,
} from "@/assets/icons/components/index";


// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ReportFormData {
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
  defaultValues?: Partial<ReportFormData>;
  onSubmit: (data: ReportFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function ReportForm({
  mode,
  defaultValues = {},
  onSubmit,
  isLoading,
  onCancel,
}: ClientFormProps) {
  const [form, setForm] = useState<ReportFormData>({
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
    (key: keyof ReportFormData) =>
      (val: string) => {
        setForm((prev) => ({
          ...prev,
          [key]: val,
        }));

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
      title: "Report Information",
      subtitle:
        "Capture basic details about the report.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",

      children: (
        <>
          <Input
            id="firstName"
            label="Report Name"
            placeholder="Enter report name"
            required
            value={form.firstName}
            onChange={(e) =>
              set("firstName")(e.target.value)
            }
          />

          <Input
            id="lastName"
            label="Description"
            placeholder="Enter description"
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
            label="Created By"
            placeholder="Enter email"
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              set("email")(e.target.value)
            }
          />

          <Input
            id="accountName"
            label="Schedule"
            placeholder="Enter account name"
            required
            value={form.email}
            onChange={(e) =>
              set("username")(e.target.value)
            }
          />     
        </>
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
            ? "Create Report"
            : "Edit Report"
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