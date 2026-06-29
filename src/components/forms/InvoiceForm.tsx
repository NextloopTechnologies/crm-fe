import { useState, useEffect, useCallback } from "react";
import FormPage, { FormSection } from "@/components/common/Form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import SelectDropdown from "@/components/common/SelectDropdown";
import {
  PlusCircle,
  Trash2,
  Building2,
  FileText,
  ReceiptText,
  ArrowLeft,
} from "lucide-react";
import { CreateInvoiceRequest, InvoiceItemDto, InvoiceStatus } from "@/types/api.types";
import { ROUTES } from "@/lib/route";
import BackButton from "../common/BackButton";

// ─────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: "Draft", value: "Draft" },
  { label: "Sent", value: "Sent" },
  { label: "Paid", value: "Paid" },
  { label: "Overdue", value: "Overdue" },
  { label: "Cancelled", value: "Cancelled" },
];

const BANK_OPTIONS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Bank of India",
  "Bank of Baroda",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
].map((b) => ({ label: b, value: b }));

const emptyItem = (): InvoiceItemDto => ({
  itemDetails: "",
  quantity: 0,
  rate: 0,
  amount: 0,
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const round2 = (n: number) => Math.round(n * 100) / 100;

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────
interface InvoiceFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<CreateInvoiceRequest>;
  accountNumber?: string; // pre-filled from AccountDetailPage
  onSubmit: (data: CreateInvoiceRequest) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function InvoiceForm({
  mode,
  defaultValues = {},
  accountNumber,
  onSubmit,
  isLoading,
  onCancel,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    invoiceDate: "",
    dueDate: "",
    status: "Draft",
    description: "",
    items: [emptyItem()],
    subTotal: 0,
    discount: 0,
    tax: 0,
    grandTotal: 0,
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    accountNumber_ref: accountNumber ?? "",
    orderNumber: "",
  });

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setFormData((prev) => ({ ...prev, ...defaultValues }));
    }
  }, [defaultValues]);

  // ── Recalculate totals whenever items / discount / tax change ──
  const recalcTotals = useCallback(
    (items: InvoiceItemDto[], discount: number, taxPct: number) => {
      const sub = items.reduce((acc, it) => acc + it.amount, 0);
      const taxAmt = round2((sub - discount) * (taxPct / 100));
      const grand = round2(sub - discount + taxAmt);
      setFormData((prev) => ({ ...prev, subTotal: round2(sub), grandTotal: grand }));
    },
    []
  );

  // ── Item helpers ──────────────────────────────────────────
  const updateItem = (idx: number, key: keyof InvoiceItemDto, raw: string) => {
    setFormData((prev) => {
      const items = prev.items.map((it, i) => {
        if (i !== idx) return it;
        const updated = { ...it, [key]: key === "itemDetails" ? raw : parseFloat(raw) || 0 };
        updated.amount = round2(updated.quantity * updated.rate);
        return updated;
      });
      recalcTotals(items, prev.discount, prev.tax);
      return { ...prev, items };
    });
  };

  const addRow = () =>
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));

  const removeRow = (idx: number) =>
    setFormData((prev) => {
      const items = prev.items.filter((_, i) => i !== idx);
      recalcTotals(items, prev.discount, prev.tax);
      return { ...prev, items };
    });

  // ── Top-level field setter ────────────────────────────────
  const set = <K extends keyof CreateInvoiceRequest>(key: K) =>
    (val: CreateInvoiceRequest[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [key]: val };
        if (key === "discount" || key === "tax") {
          recalcTotals(
            next.items,
            key === "discount" ? (val as number) : next.discount,
            key === "tax" ? (val as number) : next.tax
          );
        }
        return next;
      });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // ─────────────────────────────────────────────────────────────
  // Sections
  // ─────────────────────────────────────────────────────────────
  const sections: FormSection[] = [
    {
      icon: <ReceiptText className="w-5 h-5" />,
      title: "Invoice Information",
      subtitle: "Capture basic details about the invoice.",
      iconBg: "bg-[#5752FE1A]",
      iconColor: "text-[#5752FE]",
      children: (
        <>
          <Input
            id="invoiceDate"
            label="Invoice Date"
            type="date"
            required
            value={formData.invoiceDate}
            onChange={(e) => set("invoiceDate")(e.target.value)}
          />
          <Input
            id="dueDate"
            label="Due Date"
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => set("dueDate")(e.target.value)}
          />
          <SelectDropdown
            label="Status"
            placeholder="Select status"
            options={STATUS_OPTIONS}
            value={formData.status}
            onChange={(v) => set("status")(v as InvoiceStatus)}
            required
          />
          <div className="col-span-full">
            <Input
              id="description"
              label="Description"
              placeholder="Text Here......"
              value={formData.description ?? ""}
              onChange={(e) => set("description")(e.target.value)}
            />
          </div>
        </>
      ),
    },

    {
      icon: <FileText className="w-5 h-5" />,
      title: "Invoice Items",
      subtitle: "Add line items and review the calculated totals.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      children: (
        <div className="col-span-full">
          {/* Table */}
          <div className="border border-[#e2e8f0] rounded-xl overflow-hidden mb-3">
            {/* Header */}
            <div className="grid grid-cols-[48px_1fr_120px_120px_120px_36px] bg-[#f8fafc] border-b border-[#e2e8f0]">
              {["S. No", "Item Details", "Quantity", "Rate", "Amount", ""].map((h) => (
                <div
                  key={h}
                  className="px-3 py-2.5 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide"
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {formData.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[48px_1fr_120px_120px_120px_36px] border-b border-[#f1f5f9] last:border-b-0 items-center"
              >
                <div className="px-3 py-2 text-[13px] text-[#94a3b8]">{idx + 1}</div>

                <div className="px-2 py-1.5">
                  <input
                    className="w-full h-8 px-2 text-[13px] text-[#1e1e2d] bg-transparent border border-transparent rounded focus:border-[#5752FE] focus:bg-white focus:ring-1 focus:ring-[#5752FE]/10 outline-none placeholder:text-[#cbd5e1] transition-all"
                    placeholder="Item Details"
                    value={item.itemDetails}
                    onChange={(e) => updateItem(idx, "itemDetails", e.target.value)}
                  />
                </div>

                <div className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    className="w-full h-8 px-2 text-[13px] text-[#1e1e2d] text-right bg-transparent border border-transparent rounded focus:border-[#5752FE] focus:bg-white focus:ring-1 focus:ring-[#5752FE]/10 outline-none transition-all"
                    value={item.quantity || ""}
                    placeholder="0.00"
                    onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  />
                </div>

                <div className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    className="w-full h-8 px-2 text-[13px] text-[#1e1e2d] text-right bg-transparent border border-transparent rounded focus:border-[#5752FE] focus:bg-white focus:ring-1 focus:ring-[#5752FE]/10 outline-none transition-all"
                    value={item.rate || ""}
                    placeholder="0.00"
                    onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  />
                </div>

                <div className="px-3 py-2 text-[13px] text-[#1e1e2d] text-right font-medium">
                  {fmt(item.amount)}
                </div>

                <div className="flex items-center justify-center">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="text-[#cbd5e1] hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#5752FE] hover:text-[#4540e0] border border-[#5752FE]/30 hover:border-[#5752FE] rounded-lg px-3 py-1.5 transition-all mb-5"
          >
            <PlusCircle size={14} />
            Add Row
          </button>

          {/* Totals bar */}
          <div className="grid grid-cols-4 gap-0 border border-[#e2e8f0] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-r border-[#e2e8f0]">
              <p className="text-[11px] text-[#94a3b8] mb-1">Sub Total (Rs.)</p>
              <p className="text-[13px] font-semibold text-[#1e1e2d]">{fmt(formData.subTotal)}</p>
            </div>

            <div className="px-4 py-3 border-r border-[#e2e8f0]">
              <p className="text-[11px] text-[#94a3b8] mb-1">Discount (Rs.)</p>
              <input
                type="number"
                min={0}
                value={formData.discount || ""}
                placeholder="0"
                onChange={(e) => set("discount")(parseFloat(e.target.value) || 0)}
                className="w-full text-[13px] font-semibold text-[#1e1e2d] bg-transparent outline-none placeholder:text-[#cbd5e1]"
              />
            </div>

            <div className="px-4 py-3 border-r border-[#e2e8f0]">
              <p className="text-[11px] text-[#94a3b8] mb-1">Tax (%)</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.tax || ""}
                  placeholder="0%"
                  onChange={(e) => set("tax")(parseFloat(e.target.value) || 0)}
                  className="w-full text-[13px] font-semibold text-[#1e1e2d] bg-transparent outline-none placeholder:text-[#cbd5e1]"
                />
                <span className="text-[12px] text-[#94a3b8]">%</span>
              </div>
            </div>

            <div className="px-4 py-3 bg-[#5752FE08]">
              <p className="text-[11px] text-[#94a3b8] mb-1">Grand Total (Rs.)</p>
              <p className="text-[14px] font-bold text-[#5752FE]">{fmt(formData.grandTotal)}</p>
            </div>
          </div>
        </div>
      ),
    },

    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Bank Details",
      subtitle: "Add bank account information for this invoice.",
      iconBg: "bg-[#EDE9FF]",
      iconColor: "text-[#5752FE]",
      children: (
        <>
          <SelectDropdown
            label="Bank Name"
            placeholder="Select bank"
            options={BANK_OPTIONS}
            value={formData.bankName}
            onChange={set("bankName")}
          />
          <Input
            id="accountHolderName"
            label="A/C Holder Name"
            placeholder="Enter account holder name"
            value={formData.accountHolderName}
            onChange={(e) => set("accountHolderName")(e.target.value)}
          />
          <Input
            id="accountNumber"
            label="Account No."
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={(e) => set("accountNumber")(e.target.value)}
          />
          <Input
            id="ifscCode"
            label="IFSC Code"
            placeholder="e.g. HDFC0007995"
            value={formData.ifscCode}
            onChange={(e) => set("ifscCode")(e.target.value.toUpperCase())}
          />
          <div className="col-span-full">
            <Input
              id="branch"
              label="Branch"
              placeholder="Enter branch name / address"
              value={formData.branch ?? ""}
              onChange={(e) => set("branch")(e.target.value)}
            />
          </div>
        </>
      ),
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen rounded-xl">
      <BackButton
        path={ROUTES.INVOICE}
        label="Back To List"
        icon={<ArrowLeft size={16} />}
      />
      <FormPage
        heading={mode === "add" ? "Create Invoice" : "Edit Invoice"}
        subheading={mode === "add" ? "Add a new invoice to the system." : "Update invoice details."}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onCancel ?? (() => history.back())}
        submitLabel={
          <Button type="submit" variant="primary" size="lg" fullWidth className="mt-1">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {mode === "add" ? "Saving..." : "Updating..."}
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