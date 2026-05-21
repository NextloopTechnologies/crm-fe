import { ProfileForm } from "@/components/forms/ProfileForm";
import { useNavigate } from "react-router-dom";
import { usersData } from "@/data/user.data";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = usersData[0];

  return (
    <div className="p-6 flex flex-col gap-4 bg-white min-h-screen">
      <ProfileForm
        user={user}
        mode="edit"
        onSubmit={(data) => console.log("Saving:", data)}
        onCancel={() => navigate("/profile")}
        onUploadPhoto={() => console.log("Upload photo")}
      />
    </div>
  );
}