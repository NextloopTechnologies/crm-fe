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
  Plus,
  CirclePlus,
} from "lucide-react";
import { CreateInvoiceRequest, InvoiceResponseDto , InvoiceItemDto, InvoiceStatus, CreateAccountRequest } from "@/types/api.types";
import { ROUTES } from "@/lib/route";
import BackButton from "../common/BackButton";
import { BANK_DETAILS, BANK_OPTIONS } from "@/constants/BankDetailOption";
import { InlineSelectDropdown } from "../common/InlineSelectDropDown";
import { InlineInput } from "../common/InlineInput";
import InvoicePreview from "@/pages/accounts/invoices/InvoicePreviewPage";
// ─────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: "Draft", value: "Draft" },
  { label: "Sent", value: "Sent" },
  { label: "Paid", value: "Paid" },
  { label: "Overdue", value: "Overdue" },
  { label: "FollowUp", value: "FollowUp" },
  { label: "Cancelled", value: "Cancelled" },
];

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
  account?: CreateAccountRequest; 
  defaultValues?: Partial<CreateInvoiceRequest | InvoiceResponseDto>;
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
  account,
  onSubmit,
  isLoading,
  onCancel,
}: InvoiceFormProps) {
  const [isPreview, setIsPreview] = useState(false);
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
    bankAddress: "",
    bankRoutingNo: "",
    accountHolderAddress: "",
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
      const discountAmt = round2(sub * (discount / 100));
      const taxAmt = round2((sub - discountAmt) * (taxPct / 100));
      const grand = round2(sub - discountAmt + taxAmt);
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

  const addRow = () =>{
    if (formData.items.length >= MAX_INVOICE_ITEM) return;
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  }

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

   // ── Bank selection — prefill & lock related fields ────────
  const handleBankSelect = (bankName: string) => {
    const match = BANK_DETAILS.find((b) => b.bankName === bankName);
    setFormData((prev) => ({
      ...prev,
      bankName,
      accountHolderName: match?.accountHolderName ?? "",
      accountNumber: match?.accountNumber ?? "",
      ifscCode: match?.ifscCode ?? "",
      bankAddress: match?.bankAddress ?? "",
      bankRoutingNo: match?.bankRoutingNo ?? "",
      accountHolderAddress: match?.accountHolderAddress ?? "",
    }));
  };

  const MAX_INVOICE_ITEM = 6;
  // ─────────────────────────────────────────────────────────────
  // Sections
  // ─────────────────────────────────────────────────────────────
  const sections: FormSection[] = [
    {
      icon: <ReceiptText className="w-5 h-5 " />,
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
            onChange={(e) => {
              set("invoiceDate")(e.target.value);
              // Reset due date if it's before new invoice date
              if (formData.dueDate && formData.dueDate < e.target.value) {
                set("dueDate")("");
              }
            }}
          />
          <Input
            id="dueDate"
            label="Due Date"
            type="date"
            required
            min={formData.invoiceDate}
            disabled={!formData.invoiceDate}
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
          <div className="col-span-3 flex flex-col gap-2">
            <label className="text-sm font-medium text-[#2B2B2B]">
              Description
            </label>
            <textarea
              value={formData.description}
              placeholder="Enter description"
              rows={3}
              onChange={(e) => set("description")(e.target.value)}
              className="w-[66%] border border-[#E0E0E0] rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#5752FE]"
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
                    maxLength={70}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const digitsOnly = value.replace(/[.-]/g, "");
                      if (digitsOnly.length <= 7) {
                        updateItem(idx, "rate", value);
                      }
                    }}
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
            
          {formData.items.length < MAX_INVOICE_ITEM && (
            <div className="flex justify-start mb-3">
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-[13px] font-medium text-[#5752FE] hover:text-[#5752FE]/80 transition-colors"
              >
                <CirclePlus size={16} />
                Add Row
              </button>
            </div>
          )}

          {/* Totals bar */}
          <div className="grid grid-cols-4 gap-0 border border-[#e2e8f0] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-r border-[#e2e8f0]">
              <p className="text-[11px] text-[#94a3b8] mb-1">Sub Total (Rs.)</p>
              <p className="text-[13px] font-semibold text-[#1e1e2d]">{fmt(formData.subTotal)}</p>
            </div>

            <div className="px-4 py-3 border-r border-[#e2e8f0]">
              <p className="text-[11px] text-[#94a3b8] mb-1">Discount (%)</p>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.discount || ""}
                placeholder="0%"
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
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 -mx-6 px-6">
              <InlineSelectDropdown
                label="Select Bank"
                placeholder="Select bank"
                options={BANK_OPTIONS}
                value={formData.bankName}
                onChange={handleBankSelect}
              />

            {formData.bankName && (
              <>
               <div className="col-span-full mt-2 grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex items-start gap-6">
                  <label className="min-w-[160px] text-sm font-medium text-gray-500">
                    A/C Holder Name
                  </label>

                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {formData.accountHolderName || "NA"}
                    </p>
                </div>

                <div className="flex items-start gap-6">
                  <label className="min-w-[160px] text-sm font-medium text-gray-500">
                    A/C Number
                  </label>

                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {formData.accountNumber || "NA"}
                    </p>
                </div>

                <div className="flex items-start gap-6">
                  <label className="min-w-[160px] text-sm font-medium text-gray-500">
                    IFSC Code
                  </label>

                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {formData.ifscCode || "NA"}
                    </p>
                </div>

                <div className="flex items-start gap-6">
                  <label className="min-w-[160px] text-sm font-medium text-gray-500">
                     Bank Address
                  </label>

                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {formData.bankAddress || "NA"}
                    </p>
                </div>

                <div className="flex items-start gap-6">
                  <label className="min-w-[160px] text-sm font-medium text-gray-500">
                    Bank Routing No.(SWIFT / BIC)
                  </label>

                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {formData.bankRoutingNo || "NA"}
                    </p>
                </div>

                <div className="flex items-start gap-6">
                  <label className="min-w-[160px] text-sm font-medium text-gray-500">
                    A/C Holder Address
                  </label>

                  <p className="text-sm font-semibold text-gray-900 break-words">
                    {formData.accountHolderAddress || "NA"}
                    </p>
                </div>
                </div>
              </>
            )}
          </div>
        </>
      ),
    },
  ];

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPreview(true);
  };

  // InvoiceForm.tsx — bottom of component
  if (isPreview) {
    return (
      <InvoicePreview
        data={formData as InvoiceResponseDto}
        account={account}
        onBack={() => setIsPreview(false)}
        onSave={() => onSubmit(formData)}
        isLoading={isLoading}
      />
    );
  }
  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen ">
       <div className="px-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#1e1e2d] transition-colors"
        >
          <ArrowLeft size={12} />Back
        </button>
      </div>
      <FormPage
        heading={mode === "add" ? "Create Invoice" : "Edit Invoice"}
        subheading={mode === "add" ? "Add a new invoice to the system." : "Update invoice details."}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        bordered={false}
        submitLabel={
          <div className="flex gap-2">
                    <Button type="button" onClick={handlePreview} className="mt-1">Preview</Button>
          <Button type="submit" variant="primary" size="lg" className="mt-1">
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
          </div>
        }
      />
    </div>
  );
}