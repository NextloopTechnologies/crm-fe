// components/forms/InvoicePreview.tsx
import { CreateAccountRequest, InvoiceResponseDto } from "@/types/api.types";
import logo from "@/assets/images/CompanyLogo.svg";
import { toWords } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

export default function InvoicePreview({ data, account, onBack }: Props) {

    const invoiceRef = useRef<HTMLDivElement>(null);

 const handleDownload = async () => {
  if (!invoiceRef.current) return;

  const canvas = await html2canvas(invoiceRef.current, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = 297;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Invoice-${data.accountNumber}.pdf`);
};
    return (
        <div className="bg-white min-h-screen">
            {/* Action bar */}
            <div className="flex items-center justify-between px-4 py-3 gap-[10px]">
                <button
                    onClick={onBack}
                    className="flex items-center gap-[10px] text-sm text-gray-500 hover:text-gray-800"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-lg font-semibold">Invoice Preview</h1>
                <button
                    style={{ border: "1px solid #5752FE" }}
                    className="text-[#5752FE] bg-transparent hover:bg-[#5752FE]/5 px-3 py-1 rounded-md text-sm font-medium"
                    onClick={handleDownload}
                >
                    Download
                </button>
            </div>

            {/* Invoice template */}
            <div className="flex justify-center">
            <div
  ref={invoiceRef}
className="relative w-full border border-gray-200 p-8 rounded-xl shadow-sm"
style={{
  width: "210mm",
  minHeight: "297mm",
  boxSizing: "border-box",
}} >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 gap-[10px]">
                    <img src={logo} alt="Logo" className="h-20" />
                    <h1 className="text-2xl font-bold text-[#5752FE]">INVOICE</h1>
                </div>

                {/* Meta row */}
                <div className="flex justify-between bg-[#5752FE]/10 px-4 py-3 mb-6 text-xs" style={{ alignItems: "center" }}>
                    <div className="flex gap-[5px]" style={{ alignItems: "center", lineHeight: "1.2" }}>
                        <p style={{ margin: 0 }}>Invoice No:</p>
                        <p className="font-semibold" style={{ margin: 0 }}>{data.invoiceNumber || "NA"}</p>
                    </div>
                    <div className="flex gap-[5px]" style={{ alignItems: "center", lineHeight: "1.2" }}>
                        <p style={{ margin: 0 }}>Invoice Date:</p>
                        <p className="font-semibold" style={{ margin: 0 }}>{data.invoiceDate || "NA"}</p>
                    </div>
                    <div className="flex gap-[5px]" style={{ alignItems: "center", lineHeight: "1.2" }}>
                        <p style={{ margin: 0 }}>Due Date:</p>
                        <p className="font-semibold" style={{ margin: 0 }}>{data.dueDate || "NA"}</p>
                    </div>
                </div>

                {/* Description */}
                {account?.accountName && (
                    <div className="border-b border-[#E6E6E6] mb-6 pb-4">
                        <div className="flex justify-between gap-[100px] text-xs">
                            <div>
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
                            <div>
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
                <table className="data-table w-full text-xs mb-6 border-collapse">
                    <thead>
                        <tr className="bg-[#5752FE] text-white">
                            <th className="px-3 py-2 text-left w-10">#</th>
                            <th className="px-3 py-2 text-left">Item & Description</th>
                            <th className="px-3 py-2 text-right w-20">Quantity</th>
                            <th className="px-3 py-2 text-right w-24">Rate</th>
                            <th className="px-3 py-2 text-right w-24">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, i) => (
                            <tr key={i} className="border border-[#E6E6E6]">
                                <td className="px-3 py-2 text-left text-gray-400 w-10">{i + 1}</td>
                                <td className="px-3 py-2 text-left" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                                    {item.itemDetails || "NA"}
                                </td>
                                <td className="px-3 py-2 text-right w-20">{item.quantity}</td>
                                <td className="px-3 py-2 text-right w-24">{fmt(item.rate)}</td>
                                <td className="px-3 py-2 text-right font-medium w-24">{fmt(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-between items-start">
                    <div className="mt-2">
                        <p className="text-xs">Total In Words:</p>
                        <p className="text-xs font-semibold">{toWords(data.grandTotal)}</p>
                    </div>
                    <div className="flex flex-col gap-[10px] text-[10px] mb-8 border border-[#E6E6E6] w-64 items-end">
                        <div className="flex flex-col gap-[10px] px-4 py-2 w-full">
                            <div className="flex justify-between gap-[20px] w-full">
                                <span className="text-gray-400">Sub Total (Rs.)</span>
                                <span className="font-semibold text-right">{fmt(data.subTotal)}</span>
                            </div>
                            <div className="flex justify-between gap-[20px] w-full">
                                <span className="text-gray-400">Tax ({data.tax}%)</span>
                                <span className="font-semibold text-right">
                                    {fmt(round2((data.subTotal - round2(data.subTotal * (data.discount / 100))) * (data.tax / 100)))}
                                </span>
                            </div>
                            {data.discount > 0 && (
                <div className="flex justify-between gap-[20px] w-full">
                    <span className="text-gray-400">Discount ({data.discount}%)</span>
                    <span className="font-semibold text-right">
                        -{fmt(round2(data.subTotal * (data.discount / 100)))}
                    </span>
                </div>
            )}
                        </div>
                        <div className="flex justify-between bg-[#5752FE] text-white px-4 py-2 w-full">
                            <span>Grand Total (Rs.)</span>
                            <span className="font-bold text-right">{fmt(data.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {data.bankName && (
                    <div className="mb-6">
                        <span className="text-[#5752FE] font-semibold text-xs">Bank Details:</span>
                        <div>
                            {[
                                { label: "Bank Name", value: data.bankName },
                                { label: "A/C Holder Name", value: data.accountHolderName },
                                { label: "Account No", value: data.accountNumber },
                                { label: "IFSC Code", value: data.ifscCode },
                                { label: "Bank Routing No.(SWIFT / BIC)", value: data.bankRoutingNo },
                                { label: "Bank Address", value: data.bankAddress },
                                { label: "A/C Holder Address", value: data.accountHolderAddress },
                            ].map((row) => (
                                <div key={row.label} className="flex py-[1px]">
                                    <span className="text-xs">{row.label}:</span>
                                    <span className="text-xs font-semibold">{row.value || "NA"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Signature — pinned to bottom */}
<div
  style={{
    position: "absolute",
    bottom: "20mm",
    right: "20mm",
  }} className="text-xs">
                    Authorised Signature
                </div>
            </div>
        </div>
        </div>
    );
}