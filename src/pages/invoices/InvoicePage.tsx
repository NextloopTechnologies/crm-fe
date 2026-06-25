// pages/Accounts/InvoiceList.tsx
import { useMemo, useState, useCallback } from 'react';
import { DataTable, ColumnDef } from '@/components/common/Table';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/route';

// ── Types ─────────────────────────────────────────────────────
interface Invoice {
    id: string;
    date: string;
    invoiceNumber: string;
    orderNumber: string;
    customerName: string;
    status: string;
    amount: number;
}

// ── Static Data ───────────────────────────────────────────────
const STATIC_INVOICES: Invoice[] = [
    {
        id: "1",
        date: "2026-06-19",
        invoiceNumber: "INV_00001111",
        orderNumber: "5348584",
        customerName: "NextLoop Technologies",
        status: "Due in 12 days",
        amount: 200.00,
    },
    {
        id: "2",
        date: "2026-06-20",
        invoiceNumber: "INV_00001112",
        orderNumber: "5635455",
        customerName: "GreytHR",
        status: "Due in 10 days",
        amount: 550.00,
    },
];

// ── Status Color ──────────────────────────────────────────────
const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s?.includes("due"))     return "text-blue-600";
    if (s?.includes("paid"))    return "text-green-600";
    if (s?.includes("overdue")) return "text-red-500";
    return "text-gray-500";
};

// ── Main Component ────────────────────────────────────────────
export default function InvoiceList() {
    const [selectedRows, setSelectedRows] = useState<Invoice[]>([]);
    const navigate = useNavigate();

    const columns = useMemo<ColumnDef<Invoice>[]>(() => [
        {
            key: "date",
            label: "Date",
            width: "140px",
            render: (_, row) => (
                <span className="text-sm text-[#111127]">
                    {new Date(row.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                    })}
                </span>
            ),
        },
        {
            key: "invoiceNumber",
            label: "Invoice#",
            width: "160px",
            render: (_, row) => (
                <span className="text-sm text-[#5752FE] font-medium cursor-pointer hover:underline">
                    {row.invoiceNumber}
                </span>
            ),
        },
        {
            key: "orderNumber",
            label: "Order Number",
            width: "140px",
            render: (_, row) => (
                <span className="text-sm text-[#5752FE] font-medium cursor-pointer hover:underline">
                    {row.orderNumber}
                </span>
            ),
        },
        {
            key: "customerName",
            label: "Customer Name",
            width: "180px",
            render: (_, row) => (
                <span className="text-sm text-[#111127]">{row.customerName}</span>
            ),
        },
        {
            key: "status",
            label: "Status",
            width: "150px",
            render: (_, row) => (
                <span className={`text-sm font-medium ${getStatusStyle(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
        {
            key: "amount",
            label: "Amount",
            width: "120px",
            render: (_, row) => (
                <span className="text-sm text-[#111127] font-medium">
                    ₹{row.amount.toFixed(2)}
                </span>
            ),
        },
    ], []);

    const handleEdit      = useCallback((_row: Invoice) => {}, []);
    const handleDelete    = useCallback((_row: Invoice | Invoice[]) => {}, []);
    const handleRowClick  = useCallback((_row: Invoice) => {}, []);
    const handleSelection = useCallback((rows: Invoice[]) => setSelectedRows(rows), []);

    const headerActions = useMemo(() => (
        <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
            onClick={() => navigate(ROUTES.LEADS_CREATE)}
        >
            <PlusIcon size={16} />
            Create
        </Button>
    ), [navigate]);

    return (
        <div className="bg-white min-h-screen rounded-xl">
            <DataTable
                data={STATIC_INVOICES}
                columns={columns}
                searchable={false}
                selectable
                pageSize={8}
                loading={false}
                emptyMessage="No invoices found."
                headerActions={headerActions}
                onRowClick={handleRowClick}
                onSelectionChange={handleSelection}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}