import SelectDropdown from "@/components/common/SelectDropdown";
import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/common/Button";

export default function DeleteAccountPage() {

  const option = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Developer", value: "developer" },
    { label: "Viewer", value: "viewer" },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">

        {/* Header */}
        <div className="px-10 py-6 border-b border-[#E0E0E0] bg-[#FAFAFA]">
          <h1 className="text-2xl font-semibold text-[#2B2B2B]">
            Deleted Account
          </h1>
        </div>

        {/* Content */}
        <div className="p-10 flex flex-col gap-4">

          <SelectDropdown
            label="Reasons for closing your account?"
            placeholder="Select Reason"
            options={option}
            required
          />

          {/* Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#2B2B2B]">
              Would you like to share feedback with us?
            </label>

            <textarea
              placeholder="Enter feedback"
              rows={3}
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#5752FE]"
            />
          </div>

          {/* Warning Text */}
          <p className="text-xs text-[#EB4335] leading-5">
            Please note that all the data associated with your apps will be
            deleted as per our privacy policy. The deletion is permanent and
            the data cannot be recovered.
          </p>

          {/* Checkbox */}
          <Checkbox
            className="border-[#dcdcf0] hover:border-[#5b5bd6]"
            id="rememberMe"
            label="I understand and confirm that I agree to close my account."
          />

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              type="button"
              size="sm"
              className="min-w-[170px] h-10 rounded-lg text-sm font-medium bg-[rgb(235,67,53)]"            >
              Delete Account
            </Button>

            <button
              type="button"
              style={{ border: "1.5px solid #E0E0E0" }}
              className="min-w-[170px] h-10 rounded-lg text-sm font-medium text-[#5F616E] bg-transparent hover:bg-[#5752FE0D] rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}