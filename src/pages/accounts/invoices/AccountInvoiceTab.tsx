import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/common/Button";
import { STATIC_INVOICES } from "./InvoicesList";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CreateInvoicePage from "@/pages/accounts/invoices/CreateInvoicePage"; // adjust path
import { ROUTES } from "@/lib/route";
import EditInvoicePage from "@/pages/accounts/invoices/EditInvoicePage";
import { CreateAccountRequest } from "@/types/api.types";

interface Props {
    accountNumber: string;  // passed from AccountDetailPage
    account : CreateAccountRequest;
}

// ─────────────────────────────────────────────────────────────
// Helpers


const formatAmount = (amt: number) =>
    `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function AccountInvoiceTab({ accountNumber , account }: Props) {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<typeof STATIC_INVOICES>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

    const fetchInvoices = useCallback(async () => {
        if (!accountNumber) return;
        try {
            setLoading(true);
            const mock = STATIC_INVOICES;
            setInvoices(mock);
            setTotal(mock.length);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [accountNumber]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);
    // ── Loading ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-[#94a3b8]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#5752FE] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Loading invoices…</p>
                </div>
            </div>
        );
    }

    if (isCreating) {
        return (
            <div className="px-6 py-5">
                <CreateInvoicePage
                    accountNumber={accountNumber}
                    account={account}
                    onSuccess={() => {
                        setIsCreating(false);
                        fetchInvoices();
                    }}
                    onCancel={() => setIsCreating(false)}
                />
            </div>
        );
    }

     if (editingInvoiceId) {
        return (
            <div className="px-6 py-5">
                <EditInvoicePage
                    invoiceId={editingInvoiceId}
                    accountNumber={accountNumber}
                    onSuccess={() => {
                        setEditingInvoiceId(null);
                        fetchInvoices();
                    }}
                    onCancel={() => setEditingInvoiceId(null)}
                />
            </div>
        );
    }
    // ── Header row ───────────────────────────────────────────
    return (
        <div className="px-6 py-5">

            {/* Section heading + Create button */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-semibold text-[#1e1e2d]">
                    All Invoices
                </h3>

                <Button
                    onClick={() => setIsCreating(true)}>
                    <PlusIcon />
                    Create
                </Button>
            </div>

            {/* Empty state */}
            {invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#94a3b8]">
                    <p className="text-sm">No invoices found for this account.</p>
                    <button
                        onClick={() => navigate("/invoices/create")}
                        className="mt-3 text-[13px] text-[#5752FE] hover:underline"
                    >
                        + Create the first invoice
                    </button>
                </div>
            ) : (

                /* Table */
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#e8e8f0]">
                                {/* Checkbox col */}
                                <th className="w-8 pb-3 pr-3">
                                    <Checkbox
                                        id="select-all-checkbox"
                                        className="border-[#dcdcf0] hover:border-[#5b5bd6]"
                                    />
                                </th>
                                {["Date", "Invoice #", "Customer Name", "Status", "Amount", "Actions"].map(col => (
                                    <th
                                        key={col}
                                        className="pb-3 pr-6 text-[11px] font-semibold tracking-wide text-[#000000] uppercase whitespace-nowrap"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.map((inv, i) => (
                                <tr
                                    key={inv.id}
                                    className={`border-b border-[#f1f5f9] hover:bg-[#f9f9ff] transition-colors ${i === invoices.length - 1 ? "border-b-0" : ""
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <td>
                                        <Checkbox
                                            id="select-all-checkbox"
                                            className="border-[#dcdcf0] hover:border-[#5b5bd6]"
                                        />
                                    </td>

                                    {/* Date */}
                                    <td className="py-3.5 pr-6 text-[13px] text-[#000000] whitespace-nowrap">
                                        {inv.date}
                                    </td>

                                    {/* Invoice # — clickable */}
                                    <td className="py-3.5 pr-6 whitespace-nowrap">
                                        <button
                                            onClick={() => navigate(`/invoices/${inv.id}`)} // ← adjust route
                                            className="text-[13px] font-medium text-[#000000]"
                                        >
                                            {inv.invoiceNumber}
                                        </button>
                                    </td>

                                    {/* Customer Name */}
                                    <td className="py-3.5 pr-6 text-[13px] font-medium text-[#000000]">
                                        {inv.customerName}
                                    </td>

                                    {/* Status */}
                                    <td className="py-3.5 pr-6 whitespace-nowrap">
                                        <span className={`text-[13px] text-[#000000] font-medium`}>
                                            {inv.status}
                                        </span>
                                    </td>

                                    {/* Amount */}
                                    <td className="py-3.5 pr-6 text-[13px] font-semibold text-[#000000] whitespace-nowrap">
                                        {formatAmount(inv.amount)}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3.5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setEditingInvoiceId(inv.id)}
                                                className="text-[#94a3b8] hover:text-[#5752FE] transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                }}
                                                className="text-[#94a3b8] hover:text-[#dc2626] transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer — row count */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f1f5f9]">
                        <p className="text-[12px] text-[#94a3b8]">
                            {total} invoice{total !== 1 ? "s" : ""} total
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}