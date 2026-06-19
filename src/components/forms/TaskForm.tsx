import { useEffect, useState } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";
import { Bell, BellRing, CalendarDays, ClipboardList, Link, Repeat, Search, ChevronDown, X, ArrowLeft } from "lucide-react";
import { CreateTaskRequest } from "@/types/api.types";
import { getAllAccounts } from "@/api/account.api"; // adjust path if needed
import { ROUTES } from "@/lib/route";
import BackButton from "../common/BackButton";

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────

export const STATUS_OPTIONS = [
  { label: "Not Started", value: "Not Started" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Waiting for input", value: "Waiting for input" },
  { label: "Deferred", value: "Deferred" },
];

export const PRIORITY_OPTIONS = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export const RELATED_TO_OPTIONS = [
  { label: "Account", value: "Account" },
  { label: "Contact", value: "Contact" },
  { label: "Lead", value: "Lead" },
];

const REPEAT_TYPES = ["Daily", "Weekly", "Monthly", "Yearly", "Custom"];
const END_TYPES = ["Never", "After", "On date"];

// ─────────────────────────────────────────────────────────────
// AccountDropdown — fetches accounts from API, searchable
// ─────────────────────────────────────────────────────────────

interface AccountOption {
  accountNumber: string;
  accountName: string;
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
        const list: AccountOption[] = (res.data ?? res ?? []).map((acc: any) => ({
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
      <label className="block text-xs font-medium text-gray-600 mb-2.5">
        Account Number
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

// ─────────────────────────────────────────────────────────────
// Form State Types
// ─────────────────────────────────────────────────────────────

interface RepeatDetails {
  repeatType: string;
  frequency: string;
  everyX: number | string;
  endType: string;
  endAfterTimes: number | string;
  endOnDate: string;
}

interface TaskFormState {
  subject: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  accountNumber: string;
  contactId: string;
  isReminder: boolean;
  isRepeat: boolean;
  relatedToType: string;
  repeatDetails: RepeatDetails;
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface TaskFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<CreateTaskRequest>;
  onSubmit: (data: CreateTaskRequest) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function TaskForm({
  mode,
  defaultValues = {},
  onSubmit,
  isLoading,
  onCancel,
}: TaskFormProps) {

  const [form, setForm] = useState<TaskFormState>({
    subject: defaultValues.subject ?? "",
    description: defaultValues.description ?? "",
    dueDate: defaultValues.dueDate ?? "",
    status: defaultValues.status ?? "",
    priority: defaultValues.priority ?? "",
    accountNumber: defaultValues.accountNumber ?? "",
    contactId: defaultValues.contactId ?? "",
    isReminder: defaultValues.isReminder === true || defaultValues.isReminder === ("true" as any),
    isRepeat: defaultValues.isRepeat === true || defaultValues.isRepeat === ("true" as any),
    relatedToType: defaultValues.relatedToType ?? "",
    repeatDetails: {
      repeatType: defaultValues.repeatDetails?.repeatType ?? "",
      frequency: defaultValues.repeatDetails?.frequency ?? "",
      everyX: defaultValues.repeatDetails?.everyX ?? "",
      endType: defaultValues.repeatDetails?.endType ?? "",
      endAfterTimes: defaultValues.repeatDetails?.endAfterTimes ?? "",
      endOnDate: defaultValues.repeatDetails?.endOnDate ?? "",
    },
  });

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...defaultValues,
        isReminder: defaultValues.isReminder === true || defaultValues.isReminder === ("true" as any),
        isRepeat: defaultValues.isRepeat === true || defaultValues.isRepeat === ("true" as any),
        repeatDetails: {
          ...prev.repeatDetails,
          ...(defaultValues.repeatDetails ?? {}),
        },
      }));
    }
  }, [defaultValues]);

  // ── Setters ──────────────────────────────────────────────────

  const set = (key: keyof Omit<TaskFormState, "repeatDetails" | "isReminder" | "isRepeat">) =>
    (val: string) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    };

  const setRepeat = (key: keyof RepeatDetails) => (val: string | number) => {
    setForm((prev) => ({
      ...prev,
      repeatDetails: { ...prev.repeatDetails, [key]: val },
    }));
  };

  const toggle = (key: "isReminder" | "isRepeat") => () => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDueDate = (value: string) => {
    if (!value) return "";
  
    const [date, time] = value.split("T");
    const [year, month, day] = date.split("-");
  
    return `${day}-${month}-${year} ${time}`;
  };

  // ── Submit ───────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDueDate = formatDueDate(form.dueDate);
    const payload: CreateTaskRequest = {
      ...form,
      dueDate: formattedDueDate,
      isReminder: form.isReminder as any,
      isRepeat: form.isRepeat as any,
      repeatDetails: form.isRepeat
        ? {
            ...form.repeatDetails,
            everyX: Number(form.repeatDetails.everyX) || 0,
            endAfterTimes: Number(form.repeatDetails.endAfterTimes) || 0,
          }
        : {
            repeatType: "",
            frequency: "",
            everyX: 0,
            endType: "",
            endAfterTimes: 0,
            endOnDate: "",
          },
    };

    onSubmit(payload);
  };

  // ─────────────────────────────────────────────────────────────
  // Sections
  // ─────────────────────────────────────────────────────────────

  const sections: FormSection[] = [
    {
      icon: <ClipboardList className="w-5 h-5" />,
      title: "Task Information",
      subtitle: "Capture basic details about the task.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <>
          <Input
            id="subject"
            label="Subject"
            placeholder="Enter subject"
            required
            value={form.subject}
            onChange={(e) => set("subject")(e.target.value)}
          />
          <Input
            id="description"
            label="Description"
            placeholder="Enter description"
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
          />
          <SelectDropdown
            label="Priority"
            placeholder="Select Priority"
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={set("priority")}
            required
            leftIcon={<ShieldIcon />}
          />
          <SelectDropdown
            label="Status"
            placeholder="Select Status"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={set("status")}
            required
            leftIcon={<ShieldIcon />}
          />
          <Input
            id="dueDate"
            label="Due Date"
            placeholder="DD-MM-YYYY"
            type="datetime-local"
            required
            value={form.dueDate}
            onChange={(e) => set("dueDate")(e.target.value)}
            leftIcon={<CalendarDays className="w-5 h-5" />}
          />
        </>
      ),
    },

    {
      icon: <Link className="w-5 h-5" />,
      title: "Related To",
      subtitle: "Link this task to an account or contact.",
      iconBg: "bg-[#5752FE1A]",
      iconColor: "text-[#5752FE]",
      children: (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 pt-6 -mx-6 px-6">

          {/* ✅ Account Number — searchable dropdown from API */}
          <AccountDropdown
            value={form.accountNumber}
            onChange={(accNum) => setForm((prev) => ({ ...prev, accountNumber: accNum }))}
          />

          <Input
            id="contactId"
            label="Contact ID"
            placeholder="Enter contact ID"
            value={form.contactId}
            onChange={(e) => set("contactId")(e.target.value)}
          />

          <SelectDropdown
            label="Related To Type"
            placeholder="Select related to type"
            options={RELATED_TO_OPTIONS}
            value={form.relatedToType}
            onChange={set("relatedToType")}
            leftIcon={<ShieldIcon />}
          />
        </div>
      ),
    },

    {
      icon: <Bell className="w-5 h-5" />,
      title: "Reminder & Repeat",
      subtitle: "Set reminders and repeat schedule for this task.",
      iconBg: "bg-[#EDE9FF]",
      iconColor: "text-[#5752FE]",
      children: (
        <div className="col-span-full flex flex-col gap-3">

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-[#ECECEC]">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <BellRing className="w-4 h-4 text-[#5752FE]" />
              Enable Reminder
            </div>
            <button
              type="button"
              onClick={toggle("isReminder")}
              className={`w-10 h-5 rounded-full relative transition-colors ${form.isReminder ? "bg-[#5752FE]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isReminder ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Repeat Toggle */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-[#ECECEC]">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Repeat className="w-4 h-4 text-[#5752FE]" />
              Enable Repeat
            </div>
            <button
              type="button"
              onClick={toggle("isRepeat")}
              className={`w-10 h-5 rounded-full relative transition-colors ${form.isRepeat ? "bg-[#5752FE]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isRepeat ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Repeat Details */}
          {form.isRepeat && (
            <div className="bg-[#F8F7FF] border border-[#E4E2FF] rounded-xl p-4 flex flex-col gap-4">

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-500">
                  Repeat Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {REPEAT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRepeat("repeatType")(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.repeatDetails.repeatType === type
                          ? "bg-[#5752FE] text-white border-[#5752FE]"
                          : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {form.repeatDetails.repeatType === "Custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    id="frequency"
                    label="Frequency"
                    placeholder="e.g. Every 2 days"
                    value={String(form.repeatDetails.frequency)}
                    onChange={(e) => setRepeat("frequency")(e.target.value)}
                  />
                  <Input
                    id="everyX"
                    label="Every X"
                    placeholder="e.g. 2"
                    value={String(form.repeatDetails.everyX)}
                    onChange={(e) => setRepeat("everyX")(e.target.value)}
                  />
                </div>
              )}

              <div className="border-t border-[#E4E2FF]" />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-500">
                  End Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {END_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRepeat("endType")(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.repeatDetails.endType === type
                          ? "bg-[#5752FE] text-white border-[#5752FE]"
                          : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {form.repeatDetails.endType === "After" && (
                <Input
                  id="endAfterTimes"
                  label="End after (times)"
                  placeholder="e.g. 10"
                  value={String(form.repeatDetails.endAfterTimes)}
                  onChange={(e) => setRepeat("endAfterTimes")(e.target.value)}
                />
              )}

              {form.repeatDetails.endType === "On date" && (
                <Input
                  id="endOnDate"
                  label="End on date"
                  placeholder="DD-MM-YYYY"
                  type="date"
                  value={form.repeatDetails.endOnDate}
                  onChange={(e) => setRepeat("endOnDate")(e.target.value)}
                />
              )}

            </div>
          )}
        </div>
      ),
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="bg-white min-h-screen rounded-xl">
       <BackButton
        path={ROUTES.TASKS}
        label="Back To List"
        icon={<ArrowLeft size={16} />}
      />
      <FormPage
        heading={mode === "add" ? "Create Task" : "Edit Task"}
        subheading={mode === "add" ? "Add a new task to the system." : "Update task details."}
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
                {mode === "add" ? "Saving..." : "Updating..."}
              </div>
            ) : mode === "add" ? "Save" : "Update"}
          </Button>
        }
      />
    </div>
  );
}