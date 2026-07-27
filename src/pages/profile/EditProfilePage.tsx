import { ProfileForm } from "@/components/forms/ProfileForm";
import { useNavigate, useLocation } from "react-router-dom";
import { updateProfileDetail } from "@/api/profile.api";
import { useState } from "react";
import { ResponseCode } from "@/constants/statusCodes";
import { showToast } from "@/components/common/Toast";
import { getErrorToast, getSuccessToast } from "@/components/common/toastMessages";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      const payload: any = {};

      if (data.firstName !== profile?.firstName)
        payload.firstName = data.firstName;

      if (data.lastName !== profile?.lastName)
        payload.lastName = data.lastName;

      if (data.phone !== profile?.phone)
        payload.phone = data.phone;

      if (data.email !== profile?.email)
        payload.email = data.email;

      if (data.username !== profile?.username)
        payload.username = data.username;

      if (Object.keys(payload).length === 0) {
        navigate("/profile");
        return;
      }

      const response = await updateProfileDetail(payload);

      if (response.code === ResponseCode.SUCCESS) {
       showToast(getSuccessToast("Profile", "updated"));

        navigate("/profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      showToast(getErrorToast("Profile", "updated"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4 bg-white min-h-screen">
      <ProfileForm
        profile={profile}
        mode="edit"
        isLoading={isLoading}
        onCancel={() => navigate("/profile")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}