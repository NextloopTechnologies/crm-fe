import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, MapPin, UserRound } from "lucide-react";
import { ROUTES } from "@/lib/route";
import { getAccountByAccountNumber } from "@/api/account.api";
import AccountInvoiceTab from "./invoices/AccountInvoiceTab"; // ← NEW import
import { CreateAccountRequest } from "@/types/api.types";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const display = (val?: string) =>
    !val || val === "NA" || val === "0" ? "—" : val;

const initials = (name: string) =>
    name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────
const Field = ({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) => (
    <div className="flex flex-col gap-0.5">
        <p className="text-[12px] text-[#94a3b8]">{label}</p>
        {isLink ? (
            <a href={value.startsWith("http") ? value : `tel:${value}`}
                className="text-[14px] font-medium text-[#5752FE] hover:underline">
                {value}
            </a>
        ) : (
            <p className="text-[14px] font-semibold text-[#1e1e2d]">{value}</p>
        )}
    </div>
);

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function AccountDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState<CreateAccountRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "invoice">("details");

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const res = await getAccountByAccountNumber(id);
                const data = res.data || res;
                setAccount(Array.isArray(data) ? data[0] : data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white rounded-xl">
                <div className="flex flex-col items-center gap-3 text-[#94a3b8]">
                    <div className="w-8 h-8 border-2 border-[#5752FE] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Loading account details...</p>
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white rounded-xl text-[#94a3b8] text-sm">
                Account not found.
            </div>
        );
    }

    const addr = account.addresses?.[0];
    const contact = account.contacts?.[0];

    return (
        <div className="min-h-screen">

            {/* ── Back ── */}
            <div className="px-2 pb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#1e1e2d] transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* ── Main Card ── */}
            <div className="mx-2 mt-3 mb-6 bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b border-[#e8e8f0] px-6 bg-[#F9F9F9]">
                    {(["details", "invoice"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                borderBottom: activeTab === tab ? "2px solid #5752FE" : "2px solid transparent",
                            }}
                            className={`py-4 px-2 mr-6 -mb-px text-[13px] font-medium border-b-2 transition-colors capitalize ${
                                activeTab === tab
                                    ? "border-[#5752FE] text-[#5752FE]"
                                    : "border-transparent text-[#000000] hover:text-gray-500"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* ── Details Tab ── */}
                {activeTab === "details" && (
                    <div className="flex">

                        {/* Left Panel */}
                        <div className="flex-1 border-r border-[#e8e8f0]">

                            {/* Hero */}
                            <div className="px-6 py-5 border-b border-[#e8e8f0]">
                                <div className="flex items-center gap-4">
                                    <div className="h-[60px] w-[60px] rounded-full bg-[#e8e8f0] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <span className="text-[#5752FE] text-lg font-bold">
                                            {initials(account.accountName)}
                                        </span>
                                    </div>

                                    <div>
                                        <h1 className="text-[18px] font-bold text-[#1e1e2d]">
                                            {`${contact?.firstName ?? ""} ${contact?.lastName ?? ""}`}
                                        </h1>
                                        <p className="text-[13px] text-[#1e1e2d] mt-0.5">
                                            {display(account.accountName) !== "—" ? account.accountName : ""}
                                        </p>

                                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                                            {contact?.email && contact.email !== "NA" && (
                                                <a href={`mailto:${contact.email}`}
                                                    className="flex items-center gap-1.5 text-[12px] text-[#5752FE] hover:underline">
                                                    <Mail size={12} /> {contact.email}
                                                </a>
                                            )}
                                            {contact?.mobile && contact.mobile !== "NA" && (
                                                <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                                                    <Phone size={12} /> {contact.mobile}
                                                </span>
                                            )}
                                            {addr?.city && addr.city !== "NA" && (
                                                <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                                                    <MapPin size={12} /> {addr.city}{addr.state !== "NA" ? `, ${addr.state}` : ""}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="px-6 py-5">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-md bg-[#5752FE1A] flex items-center justify-center">
                                        <UserRound size={16} className="text-[#5752FE]" />
                                    </div>
                                    <h3 className="text-[14px] font-semibold text-[#1e1e2d]">Account Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                    <Field label="Account Owner"  value={display(account.accountOwner)} />
                                    <Field label="First Name"     value={display(contact?.firstName)} />
                                    <Field label="Last Name"      value={display(contact?.lastName)} />
                                    <Field label="Designation"    value={display(contact?.designation !== "NA" ? contact?.designation : "—")} />
                                    <Field
                                        label="Phone Number"
                                        value={contact?.mobile !== "NA" ? contact?.mobile ?? "—" : "—"}
                                        isLink={contact?.mobile !== "NA" && !!contact?.mobile}
                                    />
                                    <Field
                                        label="Fax"
                                        value={display(contact?.fax)}
                                        isLink={contact?.fax !== "NA" && !!contact?.fax}
                                    />
                                    <Field
                                        label="Email"
                                        value={contact?.email !== "NA" ? contact?.email ?? "—" : "—"}
                                        isLink={contact?.email !== "NA" && !!contact?.email}
                                    />
                                    <Field
                                        label="Website"
                                        value={account.website !== "NA" ? account.website ?? "—" : "—"}
                                        isLink={account.website !== "NA" && !!account.website}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Panel — Address */}
                        <div className="w-[280px] flex-shrink-0 px-6 py-5">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-7 h-7 rounded-md bg-[#5752FE1A] flex items-center justify-center">
                                    <MapPin size={16} className="text-[#5752FE]" />
                                </div>
                                <h3 className="text-[14px] font-semibold text-[#1e1e2d]">Address Information</h3>
                            </div>

                            <div className="flex flex-col gap-4">
                                {[
                                    { label: "Address",  value: display(addr?.flatNo)  },
                                    { label: "Street",   value: display(addr?.street)  },
                                    { label: "City",     value: display(addr?.city)    },
                                    { label: "State",    value: display(addr?.state)   },
                                    { label: "Zip Code", value: display(addr?.zipCode) },
                                ].map(f => (
                                    <div key={f.label}>
                                        <p className="text-[12px] text-[#94a3b8]">{f.label}</p>
                                        <p className="text-[14px] font-semibold text-[#1e1e2d] mt-0.5">{f.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Invoice Tab ── passes accountNumber so it can fetch filtered invoices */}
                {activeTab === "invoice" && (
                    <AccountInvoiceTab accountNumber={account.accountNumber} />
                )}

            </div>
        </div>
    );
}