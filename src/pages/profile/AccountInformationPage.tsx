import SelectDropdown from "@/components/common/SelectDropdown";
import { Input } from "@/components/common/Input";

export default function AccountInformationPage() {

    const option = [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Developer", value: "developer" },
        { label: "Viewer", value: "viewer" },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">

                {/* Header */}
                <div className="px-10 py-6 border-b border-[#E0E0E0] bg-[#FAFAFA]">
                    <h1 className="text-2xl font-semibold text-[#2B2B2B]">
                        Account Informtion
                    </h1>
                </div>

                <div className="flex items-center justify-between px-10 py-6 bg-white">

                    {/* Left Section */}
                    <div className="flex items-center gap-5">

                        {/* Profile Image */}
                        <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="profile"
                            className="w-14 h-14 rounded-full object-cover border"
                        />

                        {/* User Info */}
                        <div>
                            <h2 className="text-md font-bold text-[#2B2B2B]">
                                Robert Patinson
                            </h2>

                            <p className="text-sm text-[#5F616E] ">
                                arjunsingh@nextloop.com
                            </p>
                        </div>

                    </div>

                    {/* Right Section */}
                    <button
                    style={{ border: "1px solid #5752FE" }}
                        className="px-6 h-10 border border-[#5752FE] text-[#5752FE] rounded-lg font-medium hover:bg-[#5752FE0D] transition"
                    >
                        Edit Profile
                    </button>

                </div>

                {/* Content */}
                <div className="px-10 pb-8 grid grid-cols-2 gap-x-12 gap-y-4 ">

                    <Input id="firstName" label="Full Name" placeholder="Enter first name" />

                    <SelectDropdown
                        label="Select Manager"
                        placeholder="Select Reason"
                        options={option}

                    />
                    <Input id="email" label="Email" placeholder="Enter email" type="email" />
                    <Input id="lastName" label="Role Name" placeholder="Enter role name" />
                    <Input id="phone" label="Phone" placeholder="Enter phone number" />
                    <Input id="dob" label="Date of Birth" type="date" placeholder="Enter Date of Birth" />

                </div>
            </div>
        </div>
    );
}