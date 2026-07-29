import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormSection {
  /** Icon shown in the coloured circle (any ReactNode — SVG, emoji, etc.) */
  icon: React.ReactNode;
  /** Section heading e.g. "User Information" */
  title: string;
  /** Section sub-heading e.g. "Basic details about the user." */
  subtitle: string;
  /** Icon background colour class — tailwind bg-* or inline style */
  iconBg?: string;
  /** Icon foreground colour class */
  iconColor?: string;
  /** The actual form fields rendered inside this section */
  children: React.ReactNode;
}

export interface FormPageProps {
  /** Page heading e.g. "Create User" */
  heading: string;
  /** Page sub-heading e.g. "Add a new user to the system." */
  subheading?: string;
  /** One or more sections */
  sections: FormSection[];
  /** Called when the primary CTA is clicked */
  onSubmit: (e: React.FormEvent) => void;
  /** Primary button label — default "Submit" */
  submitLabel?: React.ReactNode;
  /** Called when Cancel is clicked */
  onCancel?: () => void;
  /** Show a loading state on the submit button */
  isLoading?: boolean;
  bordered?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const FormPage: React.FC<FormPageProps> = ({
  heading,
  subheading,
  sections,
  onSubmit,
  submitLabel = "Submit",
  onCancel,
  isLoading = false,
  bordered = true,
}) => {
  return (
    <div
      className={`min-h-screen p-4 rounded-xl bg-white ${bordered ? "border-[1.5px] border-[#ECECEC]" : ""
        }`}
    >      {/* ── Page header ── */}
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-gray-900">{heading}</h1>
        {subheading && (
          <p className="text-xs text-gray-500">{subheading}</p>
        )}
      </div>

      {/* ── Form ── */}
      <form onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-4 -mx-4 p-2 border-t-[1.5px] border-[#ECECEC]">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className=" bg-white rounded-xl px-4 py-4 border-b border-[#ECECEC] last:border-b-0"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${section.iconBg ?? "bg-blue-50"
                    } ${section.iconColor ?? "text-blue-500"}`}
                >
                  {section.icon}
                </div>
                <div >
                  <p className="text-sm font-semibold text-gray-800">
                    {section.title}
                  </p>
                  <p className="text-xs text-gray-400">{section.subtitle}</p>
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.children}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer actions ── */}
        <div className="-mx-4 px-6 border-t-[1.5px] border-[#ECECEC] flex justify-end gap-3 mt-6 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : null}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;