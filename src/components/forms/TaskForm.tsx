import { useEffect, useState } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";
import { Bell, BellRing, ClipboardList, Link, Repeat } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Dropdown Options
// ─────────────────────────────────────────────────────────────

const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Developer", value: "developer" },
    { label: "Viewer", value: "viewer" },
];

// ─────────────────────────────────────────────────────────────
// Types  — FIX 1: all fields properly typed
// ─────────────────────────────────────────────────────────────

export interface TaskFormData {
    subject: string;
    description: string;
    priority: string;
    status: string;
    // Related To
    accountNumber: string;
    contactId: string;
    relatedToType: string;
    // Reminder & Repeat  — FIX 2: boolean, not string
    isReminder: boolean;
    isRepeat: boolean;
    repeatType: string;
    frequency: string;
    everyX: string;
    endType: string;
    endAfterTimes: string;
    endOnDate: string;
}

interface TaskFormProps {
    mode: "add" | "edit";
    defaultValues?: Partial<TaskFormData>;
    onSubmit: (data: TaskFormData) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function TaskForm({
    mode,
    defaultValues = {},
    onSubmit,
    isLoading,
    onCancel,
}: TaskFormProps) {

    // FIX 3: all fields present in initial state
    const [form, setForm] = useState<TaskFormData>({
        subject:       defaultValues.subject       ?? "",
        description:   defaultValues.description   ?? "",
        priority:      defaultValues.priority      ?? "",
        status:        defaultValues.status        ?? "",
        accountNumber: defaultValues.accountNumber ?? "",
        contactId:     defaultValues.contactId     ?? "",
        relatedToType: defaultValues.relatedToType ?? "",
        isReminder:    defaultValues.isReminder    ?? false,
        isRepeat:      defaultValues.isRepeat      ?? false,
        repeatType:    defaultValues.repeatType    ?? "",
        frequency:     defaultValues.frequency     ?? "",
        everyX:        defaultValues.everyX        ?? "",
        endType:       defaultValues.endType       ?? "",
        endAfterTimes: defaultValues.endAfterTimes ?? "",
        endOnDate:     defaultValues.endOnDate     ?? "",
    });

    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (defaultValues && Object.keys(defaultValues).length > 0) {
            setForm((prev) => ({ ...prev, ...defaultValues }));
        }
    }, [defaultValues]);

    // FIX 4: separate setter for string fields
    const set =
        (key: keyof TaskFormData) =>
        (val: string) => {
            setForm((prev) => ({ ...prev, [key]: val }));
            setTouched(true);
        };

    // FIX 5: separate setter for boolean toggle fields
    const toggle = (key: "isReminder" | "isRepeat") => () => {
        setForm((prev) => ({ ...prev, [key]: !prev[key] }));
        setTouched(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    // ───────────────────────────────────────────────────────────
    // Sections
    // ───────────────────────────────────────────────────────────

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
                        options={roleOptions}
                        value={form.priority}
                        onChange={set("priority")}
                        required
                        leftIcon={<ShieldIcon />}
                        error={touched && !form.priority ? "Priority is required" : undefined}
                    />

                    <SelectDropdown
                        label="Status"
                        placeholder="Select Status"
                        options={roleOptions}
                        value={form.status}
                        onChange={set("status")}
                        required
                        leftIcon={<ShieldIcon />}
                        error={touched && !form.status ? "Status is required" : undefined}
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
                    <Input
                        id="accountNumber"
                        label="Account Number"
                        placeholder="Enter account number"
                        value={form.accountNumber}
                        onChange={(e) => set("accountNumber")(e.target.value)}
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
                        options={roleOptions}
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

                    {/* Is Reminder Toggle */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-[#ECECEC]">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <BellRing className="w-4 h-4 text-[#5752FE]" />
                            Enable Reminder
                        </div>
                        <button
                            type="button"
                            onClick={toggle("isReminder")}
                            className={`w-10 h-5 rounded-full relative transition-colors ${
                                form.isReminder ? "bg-[#5752FE]" : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                                    form.isReminder ? "left-5" : "left-0.5"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Is Repeat Toggle */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-[#ECECEC]">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Repeat className="w-4 h-4 text-[#5752FE]" />
                            Enable Repeat
                        </div>
                        <button
                            type="button"
                            onClick={toggle("isRepeat")}
                            className={`w-10 h-5 rounded-full relative transition-colors ${
                                form.isRepeat ? "bg-[#5752FE]" : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                                    form.isRepeat ? "left-5" : "left-0.5"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Repeat Details — visible only when isRepeat = true */}
                    {form.isRepeat && (
                        <div className="bg-[#F8F7FF] border border-[#E4E2FF] rounded-xl p-4 flex flex-col gap-4">

                            {/* Repeat Type pills */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-500">
                                    Repeat Type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {["Daily", "Weekly", "Monthly", "Yearly", "Custom"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => set("repeatType")(type)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                                form.repeatType === type
                                                    ? "bg-[#5752FE] text-white border-[#5752FE]"
                                                    : "bg-white text-gray-500 border-gray-200"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom only fields */}
                            {form.repeatType === "Custom" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        id="frequency"
                                        label="Frequency"
                                        placeholder="e.g. Every 2 days"
                                        value={form.frequency}
                                        onChange={(e) => set("frequency")(e.target.value)}
                                    />
                                    <Input
                                        id="everyX"
                                        label="Every X"
                                        placeholder="e.g. 2"
                                        value={form.everyX}
                                        onChange={(e) => set("everyX")(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="border-t border-[#E4E2FF]" />

                            {/* End Type pills */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-500">
                                    End Type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {["Never", "After", "On date"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => set("endType")(type)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                                form.endType === type
                                                    ? "bg-[#5752FE] text-white border-[#5752FE]"
                                                    : "bg-white text-gray-500 border-gray-200"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* End After */}
                            {form.endType === "After" && (
                                <Input
                                    id="endAfterTimes"
                                    label="End after (times)"
                                    placeholder="e.g. 10"
                                    value={form.endAfterTimes}
                                    onChange={(e) => set("endAfterTimes")(e.target.value)}
                                />
                            )}

                            {/* End On Date */}
                            {form.endType === "On date" && (
                                <Input
                                    id="endOnDate"
                                    label="End on date"
                                    placeholder="DD-MM-YYYY"
                                    type="date"
                                    value={form.endOnDate}
                                    onChange={(e) => set("endOnDate")(e.target.value)}
                                />
                            )}

                        </div>
                    )}
                </div>
            ),
        },
    ];

    // ───────────────────────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────────────────────

    return (
        <div className="bg-white min-h-screen rounded-xl">
            <FormPage
                heading={mode === "add" ? "Create Task" : "Edit Task"}
                subheading={mode === "add" ? "Add a new task to the system." : "Update task details."}
                sections={sections}
                onSubmit={handleSubmit}
                onCancel={onCancel ?? (() => history.back())}
                isLoading={isLoading}
                submitLabel={
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="mt-1"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {mode === "add" ? "Creating..." : "Updating..."}
                            </div>
                        ) : mode === "add" ? "Save" : "Update"}
                    </Button>
                }
            />
        </div>
    );
}