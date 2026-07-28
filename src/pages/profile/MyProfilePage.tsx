import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
} from "@/assets/icons/components";
import { Button } from "@/components/common/Button";
import { User, usersData } from "@/data/user.data";
import  goggleLogo from "@/assets/icons/svgs/Google-icon.svg";
import  microSoftLogo from "@/assets/icons/svgs/MicroSoft-icon.svg";
import  linkedInLogo from "@/assets/icons/svgs/LinkedIn-icon.svg";
import { myProfile } from "@/api/profile.api";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface ProfilePageProps {
  data?: User;
  onEditClick?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const BriefcaseIcon = () => (
  <svg  viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const BuildingIcon = () => (
  <svg  viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const CalendarIcon = () => (
  <svg  viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const BellIcon = () => (
  <svg color="black" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const GlobeIcon = () => (
  <svg color="black" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const LockIcon = () => (
  <svg color="black" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Info Field
// ─────────────────────────────────────────────────────────────

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function InfoField({ icon, label, value }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Icon box */}
      <div className="mt-1 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400 !important">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// Connected Account Logos
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function MyProfilePage({ data, onEditClick }: ProfilePageProps) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await myProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);


  const user = data || usersData[0];

  const fullName = profile?.firstName + " " + profile?.lastName;

  const initials =
    profile?.firstName
      ?.split(" ")
      .map((word: string) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      navigate("/profile/edit" , {state : 
        {profile}
      });
    }
  };
  
  return (
    <div className="p-6 flex flex-col gap-4 bg-[#FFFFFF] min-h-screen">

      {/* ── Personal Information card ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">

        {/* Card header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-base font-bold text-gray-900">
            Personal Information
          </h1>
          <Button
            type="button"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-1.5 !border !border-[#5752FE] !text-[#5752FE] !bg-transparent hover:!bg-[#5752FE0D] rounded-lg text-sm font-medium"
          >
            <EditIcon />
            Edit Profile
          </Button>
        </div>

        {/* Avatar + fields */}
        <div className="flex items-start gap-[4.25rem]">

          {/* Avatar */}
          <div className="flex-shrink-0 ml-5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={fullName}
                className="w-[150px] h-[150px] rounded-full object-cover ring-4 ring-gray-100"
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-full bg-[#FDE68A] flex items-center justify-center text-2xl font-bold text-yellow-800 select-none ring-4 ring-gray-100">
                {initials}
              </div>
            )}
          </div>

          {/* Info grid — 2 columns, tight gap */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 flex-1 min-w-0">
            <InfoField
              icon={<UserIcon  />}
              label="Full Name"
              value={fullName}
            />
            <InfoField
              icon={<BriefcaseIcon />}
              label="Role"
              value={profile?.roleName}
            />
            <InfoField
              icon={<MailIcon />}
              label="Email Address"
              value={profile?.email}
            />
            <InfoField
              icon={<BuildingIcon />}
              label="Location"
              value={profile?.isActive}
            />
            <InfoField
              icon={<PhoneIcon  />}
              label="Phone Number"
              value={profile?.phone}
            />
            <InfoField
              icon={<CalendarIcon />}
              label="Joined At"
              value={profile?.creationDate}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Preferences */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Preferences
          </h2>
          <div className="flex flex-col divide-y divide-gray-50">
            {[
              { icon: <BellIcon />, label: "Notification", href: "/settings/notifications" },
              { icon: <GlobeIcon />, label: "Language & Region", href: "/settings/language" },
              { icon: <LockIcon />, label: "Privacy & Security", href: "/settings/privacy" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.href)}
                className="flex items-center justify-between py-3.5 hover:opacity-60 transition-opacity text-left w-full"
              >
                <span className="flex items-center gap-3 text-sm text-[#4A4A4A]-700">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <span className="text-[#969696]">
                  <ChevronRightIcon />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Connected Accounts
          </h2>
          <div className="flex flex-col divide-y divide-gray-50">
            {[
              { logo: <img src={goggleLogo} alt="Google" />, name: "Google", status: "Connected" },
              { logo: <img src={microSoftLogo} alt="Microsoft" />, name: "Microsoft", status: "Connected" },
              { logo: <img src={linkedInLogo} alt="LinkedIn" />, name: "LinkedIn", status: "Connected" },
            ].map((account) => (
              <div
                key={account.name}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                    {account.logo}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {account.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {account.status}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}