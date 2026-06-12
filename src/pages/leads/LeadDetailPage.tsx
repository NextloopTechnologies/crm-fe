// pages/Leads/LeadDetailPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Pencil, ArrowLeft, Mail, Phone, Globe, Building2,
    MapPin, User, Star,  Calendar, Hash,
     Twitter
} from "lucide-react";
import { ROUTES } from "@/lib/route";
import { getLeadByLeadNumber } from "@/api/leads.api";
import {
    formatDate,
    formatCurrency,
    displayValue,
    STATUS_COLOR,
    RATING_COLOR,
    LeadAvatar,
    LeadStatusBadge,
    SectionTitle,
    Field,
} from "./leadHelper";
// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function LeadDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const res = await getLeadByLeadNumber(id);
                setLead(res.data || res);
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
                    <p className="text-sm">Loading lead details...</p>
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white rounded-xl text-[#94a3b8] text-sm">
                Lead not found.
            </div>
        );
    }

    const ratingCls = RATING_COLOR[lead.rating] ?? "text-slate-600 bg-slate-100";
    const addr = lead.leadAddressResponseDto;
    const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "—";

    return (
        <div className="bg-white min-h-screen rounded-xl flex flex-col">

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1e1e2d] transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <Button
                    className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-2"
                    onClick={() => navigate(ROUTES.LEADS_EDIT(String(lead.leadNumber)))}
                >
                    <Pencil size={14} />
                    Edit Lead
                </Button>
            </div>

            {/* ── Hero Card ── */}
            <div className="px-6 py-6 border-b border-[#f1f5f9]">
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <LeadAvatar
                        firstName={lead.firstName}
                        lastName={lead.lastName}
                        email={lead.email}
                        size="h-16 w-16"
                    />

                    {/* Name + badges */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-[22px] font-bold text-[#1e1e2d]">{fullName}</h1>

                            {/* Status badge */}
                            <LeadStatusBadge status={lead.leadStatus} />

                            {/* Rating badge */}
                            {lead.rating && lead.rating !== "NA" && (
                                <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${ratingCls}`}>
                                    <Star size={10} />
                                    {lead.rating}
                                </span>
                            )}
                        </div>

                        {/* Title + Company */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {lead.title && lead.title !== "NA" && (
                                <span className="text-[13px] text-[#64748b]">{lead.title}</span>
                            )}
                            {lead.company && (
                                <>
                                    {lead.title && lead.title !== "NA" && <span className="text-[#cbd5e1]">·</span>}
                                    <span className="text-[13px] text-[#64748b] font-medium">{lead.company}</span>
                                </>
                            )}
                        </div>

                        {/* Quick info row */}
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                            {lead.email && (
                                <a href={`mailto:${lead.email}`}
                                    className="flex items-center gap-1.5 text-[12px] text-[#5752FE] hover:underline">
                                    <Mail size={12} /> {lead.email}
                                </a>
                            )}
                            {lead.phone && lead.phone !== "NA" && (
                                <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                                    <Phone size={12} /> {lead.phone}
                                </span>
                            )}
                            {addr?.city && addr.city !== "NA" && (
                                <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                                    <MapPin size={12} /> {addr.city}, {addr.state}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                                <Hash size={12} /> {lead.leadNumber}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: 2 sections stacked */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Basic Information */}
                    <div className="border border-[#e8e8f0] rounded-2xl p-5">
                        <SectionTitle icon={<User size={13} />} label="Basic Information" />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <Field label="First Name" value={displayValue(lead.firstName)} />
                            <Field label="Last Name" value={displayValue(lead.lastName)} />
                            <Field label="Lead Owner" value={displayValue(lead.leadOwner)} />
                            <Field label="Lead Source" value={displayValue(lead.leadSource)} />
                            <Field
                                label="Lead Status"
                                value={
                                    <LeadStatusBadge
                                        status={lead.leadStatus}
                                    />
                                }
                            />
                            <Field label="Rating" value={
                                lead.rating && lead.rating !== "NA"
                                    ? <span className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full ${ratingCls}`}>
                                        <Star size={10} /> {lead.rating}
                                    </span>
                                    : "—"
                            } />
                            <Field label="Title" value={displayValue(lead.title)} />
                            <Field label="Industry" value={displayValue(lead.industry)} />
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="border border-[#e8e8f0] rounded-2xl p-5">
                        <SectionTitle icon={<Mail size={13} />} label="Contact Details" />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <Field label="Email" value={
                                lead.email
                                    ? <a href={`mailto:${lead.email}`} className="text-[#5752FE] hover:underline">{lead.email}</a>
                                    : "—"
                            } />
                            <Field label="Secondary Email" value={
                                lead.secondaryEmail && lead.secondaryEmail !== "NA"
                                    ? <a href={`mailto:${lead.secondaryEmail}`} className="text-[#5752FE] hover:underline">{lead.secondaryEmail}</a>
                                    : "—"
                            } />
                            <Field label="Phone" value={displayValue(lead.phone)} />
                            <Field label="Mobile" value={displayValue(lead.mobile)} />
                            <Field label="Fax" value={displayValue(lead.fax)} />
                            <Field label="Website" value={
                                lead.website && lead.website !== "NA"
                                    ? <a href={lead.website} target="_blank" rel="noopener noreferrer"
                                        className="text-[#5752FE] hover:underline flex items-center gap-1">
                                        <Globe size={11} /> {lead.website}
                                    </a>
                                    : "—"
                            } />
                            <Field label="Skype ID" value={displayValue(lead.skypeId)} />
                            <Field label="Twitter" value={
                                lead.twitter && lead.twitter !== "NA"
                                    ? <span className="flex items-center gap-1"><Twitter size={11} /> {lead.twitter}</span>
                                    : "—"
                            } />
                            <Field label="Email Opt Out" value={lead.emailOptOut === "true" ? "Yes" : "No"} />
                        </div>
                    </div>

                    {/* Company & Business */}
                    <div className="border border-[#e8e8f0] rounded-2xl p-5">
                        <SectionTitle icon={<Building2 size={13} />} label="Company & Business" />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <Field label="Company" value={displayValue(lead.company)} />
                            <Field label="No. of Employees" value={displayValue(lead.noOfEmployees)} />
                            <Field label="Annual Revenue" value={formatCurrency(lead.annualRevenue)} />
                            <Field label="Industry" value={displayValue(lead.industry)} />
                        </div>
                    </div>

                </div>

                {/* Right: Address + Meta */}
                <div className="flex flex-col gap-6">

                    {/* Address */}
                    <div className="border border-[#e8e8f0] rounded-2xl p-5">
                        <SectionTitle icon={<MapPin size={13} />} label="Address" />
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Flat / Door No.", value: displayValue(addr?.flatNo) },
                                { label: "Street", value: displayValue(addr?.street) },
                                { label: "City", value: displayValue(addr?.city) },
                                { label: "State", value: displayValue(addr?.state) },
                                { label: "Zip Code", value: displayValue(addr?.zipCode) },
                                { label: "Country", value: displayValue(addr?.country) },
                            ].map(f => (
                                <div key={f.label}>
                                    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">{f.label}</p>
                                    <p className="text-[13px] text-[#1e1e2d] font-medium mt-0.5">{f.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="border border-[#e8e8f0] rounded-2xl p-5">
                        <SectionTitle icon={<Calendar size={13} />} label="System Info" />
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Lead Number</p>
                                <p className="text-[13px] text-[#1e1e2d] font-mono font-medium mt-0.5">{lead.leadNumber}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Created On</p>
                                <p className="text-[13px] text-[#1e1e2d] font-medium mt-0.5">{formatDate(lead.creationDate)}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Last Modified</p>
                                <p className="text-[13px] text-[#1e1e2d] font-medium mt-0.5">{formatDate(lead.lastModifiedDate)}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Organization ID</p>
                                <p className="text-[13px] text-[#1e1e2d] font-medium mt-0.5">{lead.organizationId ?? "—"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}