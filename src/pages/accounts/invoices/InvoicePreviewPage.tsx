// components/forms/InvoicePreview.tsx
import { CreateAccountRequest, InvoiceResponseDto } from "@/types/api.types";
import logo from "@/assets/images/CompanyLogo.svg";
import { toWords } from "@/lib/utils";
import { ArrowLeft, Download } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

interface Props {
    data: InvoiceResponseDto;
    account?: CreateAccountRequest;
    onBack: () => void;
    onSave: () => void;
    isLoading?: boolean;
}

const fmt = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const round2 = (n: number) => Math.round(n * 100) / 100;

export default function InvoicePreview({ data, account, onBack, onSave, isLoading }: Props) {

    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!invoiceRef.current) return;

        html2pdf()
            .set({
                margin: 0.5,
                filename: `Invoice-${data.invoiceNumber || "preview"}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            })
            .from(invoiceRef.current)
            .save();
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Action bar */}
            <div className="flex flex-col-2 justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <div>
                    <h1 className="text-lg font-semibold">Invoice Preview</h1>
                </div>
                <div className="">
                    <button
                        style={{ border: "1px solid #5752FE" }}
                        className="text-[#5752FE] bg-transparent hover:bg-[#5752FE]/5 px-3 py-1 rounded-md text-sm font-medium"
                        onClick={handleDownload}
                    >
                        Download
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center p-4"></div>
            {/* Invoice template — matches your screenshot layout */}
            <div ref={invoiceRef} className="max-w-3xl mx-auto border border-gray-200 rounded-xl p-8 shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <img src={logo} alt="Logo" className="h-20" />
                    <h1 className="text-2xl font-bold text-[#5752FE] mt-5">INVOICE</h1>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-6 bg-[#5752FE1A]/10 px-4 py-3 mb-6 text-xs">
                    <div className="flex items-center gap-5">
                        <p>Invoice No:</p>
                        <p className="font-semibold">{data.invoiceNumber || "NA"}</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <p>Invoice Date:</p>
                        <p className="font-semibold">{data.invoiceDate || "NA"}</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <p>Due Date:</p>
                        <p className="font-semibold">{data.dueDate || "NA"}</p>
                    </div>
                </div>

                {/* Description */}
                {account?.accountName && (
                    <div className="border-b border-[#E6E6E6] mb-6 pb-4">
                        <div className="grid grid-cols-2 gap-52">
                            <div className="mt-3 w-56">
                                <p className="text-xs font-semibold ">{account.accountName}</p>
                                <p className="text-xs ">GSTIN: 23AATFN7619K1ZO</p>
                                <p className="text-xs ">
                                    {[
                                        account.addresses?.[0]?.flatNo,
                                        account.addresses?.[0]?.street,
                                        account.addresses?.[0]?.city,
                                        account.addresses?.[0]?.state,
                                        account.addresses?.[0]?.zipCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>
                            <div className="w-56">
                                <p className="text-xs text-gray-500">Bill Address:</p>
                                <p className="text-xs font-semibold ">{account.contacts?.[0]?.firstName}</p>
                                <p className="text-xs">
                                    {[
                                        account.addresses?.[0]?.flatNo,
                                        account.addresses?.[0]?.street,
                                        account.addresses?.[0]?.city,
                                        account.addresses?.[0]?.state,
                                        account.addresses?.[0]?.zipCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>

                )}

                {/* Items table */}
                <table className="data-table w-full text-xs mb-6">
                    <thead>
                        <tr className="bg-[#5752FE] text-white">
                            <th className="px-3 py-2 text-left">#</th>
                            <th className="px-3 py-2 text-left">Item & Description</th>
                            <th className="px-3 py-2 text-right">Quantity</th>
                            <th className="px-3 py-2 text-right">Rate</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, i) => (
                            <tr key={i} className="border border-[#E6E6E6]">
                                <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                                <td className="px-3 py-2 text-xs">{item.itemDetails || "—"}</td>
                                <td className="px-3 py-2 text-right text-xs">{item.quantity}</td>
                                <td className="px-3 py-2 text-right text-xs">{fmt(item.rate)}</td>
                                <td className="px-3 py-2 text-right font-medium text-xs">{fmt(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}

                <div className="flex justify-between items-start">
                    <div className="mt-2">
                        <p className="text-xs text-[#00000033]-400">Total In Words</p>
                        <p className="text-xs font-semibold">{toWords(data.grandTotal)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs mb-8 border border-[#E6E6E6] pt-4 pr-4">

                        <div className="flex gap-12">
                            <span className="text-gray-400">Sub Total (Rs.)</span>
                            <span className="font-semibold w-24 text-right">{fmt(data.subTotal)}</span>
                        </div>
                        <div className="flex gap-12">
                            <span className="text-gray-400">Discount ({data.discount}%)</span>
                            <span className="font-semibold w-24 text-right">
                                -{fmt(round2(data.subTotal * (data.discount / 100)))}
                            </span>
                        </div>
                        <div className="flex gap-12">
                            <span className="text-gray-400">Tax ({data.tax}%)</span>
                            <span className="font-semibold w-24 text-right">{fmt(round2((data.subTotal - round2(data.subTotal * (data.discount / 100))) * (data.tax / 100)))}</span>
                        </div>
                        <div className="flex gap-12 bg-[#5752FE] text-white px-4 py-2 mt-1 -mr-4">
                            <span>Grand Total (Rs.)</span>
                            <span className="font-bold w-24 text-right">{fmt(data.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {data.bankName && (
                    <div className="overflow-hidden">

                        <span className="text-[#5752FE] font-semibold text-xs">Bank Details:</span>
                        {[
                            { label: "Bank Name", value: data.bankName },
                            { label: "A/C Holder Name", value: data.accountHolderName },
                            { label: "Account No", value: data.accountNumber },
                            { label: "IFSC Code", value: data.ifscCode },
                            { label: "Bank Routing No.(SWIFT / BIC)", value: data.bankRoutingNo },
                            { label: "Bank Address", value: data.bankAddress },
                            { label: "A/C Holder Address", value: data.accountHolderAddress },
                        ].map((row, i, arr) => (
                            <div
                                key={row.label}
                                className={`grid grid-cols-[180px_1fr] ${i !== arr.length - 1
                                    }`}
                            >
                                <span className=" py-1 text-xs">
                                    {row.label}:
                                </span>
                                <span className=" py-1 text-xs font-semibold">
                                    {row.value || "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end mt-12 text-xs">
                    Authorised Signature
                </div>
            </div>
        </div>
    );
}