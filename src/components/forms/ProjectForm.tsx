import { useEffect, useState } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";


import {
    UserIcon,
} from "@/assets/icons/components/index";
import { CalendarDays, UsersIcon } from "lucide-react";
import { CreateProjectRequest } from "@/types/api.types";
import { formatDate } from "@/lib/utils";

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


export interface ProjectFormData {
    projectName: string;
    projectType: string;
    projectStatus: string;
    startDate: string;
    endDate: string;
    description: string;
    teamMember: string;
    clientId: string;
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
        clientId: defaultValues.clientId ?? ""
    });

    const [touched, setTouched] = useState(false);

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

                setTouched(true);
            };

    const handleSubmit = (

        e: React.FormEvent
    ) => {
        e.preventDefault();

        const formattedStartDate = formatDate(form.startDate);
        const formattedEndDate = formatDate(form.endDate);

        const payload = {
            ...form,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        }
        onSubmit(payload);
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
                        error={touched && !form.projectType ? "Project Type is required" : undefined}
                    />

                    <SelectDropdown
                        label="Project Status"
                        placeholder="Select Project Status"
                        options={projectStatusOptions}
                        value={form.projectStatus}
                        onChange={set("projectStatus")}
                        required
                        leftIcon={<ShieldIcon />}
                        error={touched && !form.projectStatus ? "Project Status is required" : undefined}
                    />

                    <Input
                        id="startDate"
                        label="Start Date"
                        placeholder="DD-MM-YYYY"
                        type="datetime-local"
                        required
                        value={form.startDate}
                        onChange={(e) => set("startDate")(e.target.value)}
                        leftIcon={<CalendarDays className="w-5 h-5" />}
                    />

                    <Input
                        id="endDate"
                        label="End Date"
                        placeholder="DD-MM-YYYY"
                        type="datetime-local"
                        required
                        value={form.endDate}
                        onChange={(e) => set("endDate")(e.target.value)}
                        leftIcon={<CalendarDays className="w-5 h-5" />}
                    />

                    <Input
                        id="teamMember"
                        label="No Of Members"
                        placeholder="Enter Project Member"
                        value={form.teamMember}
                        onChange={(e) => set("teamMember")(e.target.value)}
                        leftIcon={<UsersIcon className="w-5 h-5" />}
                        
                    />

                    <Input
                        id="clientId"
                        label="Client Id"
                        placeholder="Enter clientId"
                        value={form.clientId}
                        onChange={(e) => set("clientId")(e.target.value)}
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
                        disabled={isLoading}
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