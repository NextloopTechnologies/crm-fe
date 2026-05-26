import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

interface ContactItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  line1: string;
  line2: string;
  href: string;
}

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const faqData: FaqItem[] = [
  { question: "How do I create a new tenant?", answer: "Go to Tenants in the sidebar, click Add Tenant, fill in the required details and save." },
  { question: "How can I add users to my organization?", answer: "Navigate to Users, click Create User, and fill in the user's details including their role." },
  { question: "How do I manage user roles and permissions?", answer: "Go to Roles in the sidebar to create or edit roles and assign permissions to each role." },
  { question: "Can I customize fields in the CRM?", answer: "Yes, go to Settings and find the Fields customization section to add or modify fields." },
  { question: "How does the billing and subscription work?", answer: "Billing is handled monthly. Go to Account & Billing to view invoices and manage your plan." },
];

const contactData: ContactItem[] = [
  {
    icon: <MailIcon />,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#5752FE]",
    title: "Email Support",
    line1: "support@nextioop.com",
    line2: "We typically reply within 24 hours",
    href: "mailto:support@nextioop.com",
  },
  {
    icon: <ChatIcon />,
    iconBg: "bg-[#FFF7ED]",
    iconColor: "text-[#F59E0B]",
    title: "Live Chat",
    line1: "Chat with our support team.",
    line2: "Available Mon - Fri, 9AM-6PM (IST)",
    href: "/chat",
  },
  {
    icon: <PhoneIcon />,
    iconBg: "bg-[#ECFDF5]",
    iconColor: "text-[#10B981]",
    title: "Phone Support",
    line1: "+91 9876543210",
    line2: "Available: Mon-Fri, 9AM-6PM (OST)",
    href: "tel:+919876543210",
  },
];

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function CategoryCard({ icon, iconBg, iconColor, title, description }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#5752FE] hover:shadow-sm transition-all bg-white">
      <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-[13px] font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className={idx < items.length - 1 ? "border-b border-gray-100" : ""}>
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between py-[14px] text-left bg-transparent border-none cursor-pointer"
          >
            <span className="text-[13px] text-gray-800">{item.question}</span>
            <ChevronRightIcon />
          </button>
          {openIndex === idx && (
            <p className="text-[12px] text-gray-500 leading-relaxed pb-3">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactRow({ item, isLast }: { item: ContactItem; isLast: boolean }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(item.href)}
      className={`flex items-center justify-between py-[14px] cursor-pointer hover:opacity-70 transition-opacity ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
          {item.icon}
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-800 mb-0.5">{item.title}</p>
          <p className="text-[11px] text-gray-500">{item.line1}</p>
          <p className="text-[11px] text-gray-500">{item.line2}</p>
        </div>
      </div>
      <span className="text-gray-400"><ChevronRightIcon /></span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function HelpSupportPage() {
  const [search, setSearch] = useState("");

  const categories = [
    { icon: <UserIcon />, iconBg: "bg-[#EEF2FF]", iconColor: "text-[#5752FE]", title: "Getting Started", description: "Learn the basics and get started quickly" },
    { icon: <BookIcon />, iconBg: "bg-[#ECFDF5]", iconColor: "text-[#10B981]", title: "User Guides", description: "Step-by-step guides and tutorials" },
    { icon: <BillingIcon />, iconBg: "bg-[#FFF7ED]", iconColor: "text-[#F59E0B]", title: "Account & Billing", description: "Manage your account and subscriptions" },
    { icon: <ServerIcon />, iconBg: "bg-[#EFF6FF]", iconColor: "text-[#3B82F6]", title: "System Status", description: "Check system health and uptime status" },
  ];

  return (
    <div className="p-6 flex flex-col gap-4 bg-gray-50 min-h-screen">

      {/* Search + Categories card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-[13px] text-gray-500 mb-4">Search for articles, guides or topics...</p>
        <div className="relative max-w-sm mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5752FE]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search for articles, guides or topics...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#5752FE] focus:border-[#5752FE]"
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>
      </div>

      {/* FAQ + Contact row */}
      <div className="grid grid-cols-2 gap-4">

        {/* FAQ */}
        <div className="bg-white border-2 border-[#5752FE] rounded-xl p-6">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-5">Frequently Asked Questions</h2>
          <FaqAccordion items={faqData} />
        </div>

        {/* Contact Support */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Contact Support</h2>
          <p className="text-[12px] text-gray-500 mb-4">Can't find what you're looking for? Reach out to our support team.</p>
          <div>
            {contactData.map((item, idx) => (
              <ContactRow key={item.title} item={item} isLast={idx === contactData.length - 1} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}