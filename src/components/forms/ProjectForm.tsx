import { useEffect, useState } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";


import {
    UserIcon,
} from "@/assets/icons/components/index";
import { ArrowLeft, CalendarDays, ChevronDown, Search, X } from "lucide-react";
import { CreateProjectRequest } from "@/types/api.types";
import { formatDate, toInputDateTime } from "@/lib/utils";
import { ROUTES } from "@/lib/route";
import BackButton from "../common/BackButton";
import { getAllAccounts } from "@/api/account.api";

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

interface AccountOption {
  accountNumber: string;
  accountName: string;
  accountType: string;
}

interface AccountDropdownProps {
  value: string;
  onChange: (accountNumber: string) => void;
}

function AccountDropdown({ value, onChange }: AccountDropdownProps) {
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await getAllAccounts();
        // Adjust based on your actual response shape: res.data or res
        const list: AccountOption[] = (res.data ?? res ?? [])
        .filter((acc: AccountOption) => acc.accountType !== "Cross Sell")
        .map((acc: AccountOption) => ({
          accountNumber: acc.accountNumber,
          accountName: acc.accountName,
        }));
        setAccounts(list);
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const filtered = accounts.filter(
    (acc) =>
      acc.accountName.toLowerCase().includes(search.toLowerCase()) ||
      acc.accountNumber.toLowerCase().includes(search.toLowerCase())
  );

  const selected = accounts.find((acc) => acc.accountNumber === value);

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-[#111127] mb-2">
        Account<span className="text-red-600">*</span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{ border: "1.5px solid #e4e4ee" }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white text-sm text-left hover:border-[#5752FE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5752FE]/20"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected
            ? `${selected.accountName} `
            : "Select account"}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearch("");
              }}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#E4E2FF] rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#ECECEC]">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-52 overflow-y-auto">
            {loading ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                Loading accounts...
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                No accounts found.
              </li>
            ) : (
              filtered.map((acc) => (
                <li
                  key={acc.accountNumber}
                  onClick={() => {
                    onChange(acc.accountNumber);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F0EFFF] transition-colors ${
                    value === acc.accountNumber
                      ? "bg-[#5752FE]/10 text-[#5752FE] font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <span>{acc.accountName}</span>
                  <span className="text-xs text-gray-400 font-mono">{acc.accountNumber}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

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


export interface ProjectFormData {
    projectName: string;
    projectType: string;
    projectStatus: string;
    startDate: string;
    endDate: string;
    description: string;
    teamMember: string;
    relatedToType: string;
    relatedId: string;
}

const projectTypeOptions = [
    { label: "Backend", value: "Backend" },
    { label: "Frontend", value: "Frontend" },
    { label: "Full Stack", value: "Full Stack" },
    { label: "Mobile", value: "Mobile" },
    { label: "Other", value: "Other" },
];

const projectStatusOptions = [
    { label: "Planning", value: "Planning" },
    { label: "In Progress", value: "In Progress" },
    { label: "On Hold", value: "On Hold" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
];

interface ProjectFormProps {
    mode: "add" | "edit";
    defaultValues?: Partial<CreateProjectRequest>;
    onSubmit: (data: CreateProjectRequest) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function ProjectForm({
    mode,
    defaultValues = {},
    onSubmit,
    isLoading,
    onCancel,
}: ProjectFormProps) {
    const [form, setForm] = useState<CreateProjectRequest>({
        projectName: defaultValues.projectName ?? "",
        projectType: defaultValues.projectType ?? "",
        projectStatus: defaultValues.projectStatus ?? "",
        startDate: defaultValues.startDate ?? "",
        endDate: defaultValues.endDate ?? "",
        description: defaultValues.description ?? "",
        teamMember: defaultValues.teamMember ?? "",
        relatedToId: defaultValues.relatedToId ?? "",
        relatedToType: defaultValues.relatedToType ?? ""
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
        (key: keyof ProjectFormData) =>
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
            title: "Project Information",
            subtitle:
                "Capture basic details about the tenant.",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",

            children: (
                <>
                    <AccountDropdown
                        value={form.relatedToId || ""}
                        onChange={(accNum) => setForm((prev) => ({ ...prev, relatedToId: accNum }))}
                    />

                    <Input
                        id="projectName"
                        label="Project Name"
                        placeholder="Enter project name"
                        required
                        value={form.projectName}
                        onChange={(e) => set("projectName")(e.target.value)}
                        leftIcon={<UserIcon className="w-5 h-5" />}
                    />

                    <SelectDropdown
                        label="Project Type"
                        placeholder="Select Project Type"
                        options={projectTypeOptions}
                        value={form.projectType}
                        onChange={set("projectType")}
                        required
                        leftIcon={<ShieldIcon />}
                    />

                    <SelectDropdown
                        label="Project Status"
                        placeholder="Select Project Status"
                        options={projectStatusOptions}
                        value={form.projectStatus}
                        onChange={set("projectStatus")}
                        required
                        leftIcon={<ShieldIcon />}
                    />

                    <Input
                        id="startDate"
                        label="Start Date"
                        placeholder="DD-MM-YYYY"
                        type="datetime-local"
                        required
                        value={toInputDateTime(form.startDate)}
                        onChange={(e) => set("startDate")(formatDate(e.target.value))}
                        leftIcon={<CalendarDays className="w-5 h-5" />}
                    />

                    <Input
                        id="endDate"
                        label="End Date"
                        placeholder="DD-MM-YYYY"
                        type="datetime-local"
                        required
                        value={toInputDateTime(form.endDate)}
                        onChange={(e) => set("endDate")(formatDate(e.target.value))}
                        leftIcon={<CalendarDays className="w-5 h-5" />}
                    />

                    <div className="col-span-3 flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#2B2B2B]">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            placeholder="Enter description"
                            rows={3}
                            onChange={(e) => set("description")(e.target.value)}
                            className="w-[66%] border border-[#E0E0E0] rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#5752FE]"
                        />
                    </div>
                </>

            ),
        },
    ];

    // ───────────────────────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────────────────────

    return (
        <div className="bg-white min-h-screen rounded-lx">
            <BackButton
        path={ROUTES.PROJECT}
        label="Back To List"
        icon={<ArrowLeft size={16} />}
      />
            <FormPage
                heading={
                    mode === "add"
                        ? "Create Project"
                        : "Edit Project"
                }
                subheading={
                    mode === "add"
                        ? "Add a new project to the system."
                        : "Update project details."
                }
                sections={sections}
                onSubmit={handleSubmit}
                onCancel={
                    onCancel ??
                    (() => history.back())
                }
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