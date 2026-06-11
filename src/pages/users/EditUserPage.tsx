import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { ROUTES } from '@/lib/route';
import UserForm from '@/components/forms/UserForm';
import { getUserByEmail, updateUser } from '@/api/user.api';
import { UserFormData } from '@/schemas';
import { getErrorToast, getSuccessToast } from '@/components/common/toastMessages';

export default function EditUserPage() {
  const { email: encodedEmail } = useParams();
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : undefined;

  const [loading, setLoading]             = useState(false);
  const [fetching, setFetching]           = useState(true);
  const [defaultValues, setDefaultValues] = useState<Partial<UserFormData>>();
  const [userId, setUserId]               = useState<number>();

  const navigate   = useNavigate();
  const timerRef   = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callerRole = localStorage.getItem("roleName") || "SUPER_ADMIN";

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // ← Move it here, at the top level
  useEffect(() => {
\  }, [userId]);

  useEffect(() => {
    if (!email) {
      showToast({ title: "Error", description: "User not found.", type: "error" });
      navigate(ROUTES.USERS);
      return;
    }

    const fetchUser = async () => {
      try {
        setFetching(true);
        const response = await getUserByEmail(email);
        const data = response.data ?? response;
        const resolvedId = data.userId ?? data.id;
        setUserId(Number(resolvedId));
        setDefaultValues({
          email:     data.email     ?? "",
          firstName: data.firstName ?? "",
          lastName:  data.lastName  ?? "",
          phone:     data.phone     ?? "",
          roleName:  data.roleName  ?? "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        showToast({ title: "Error", description: "Failed to load user data.", type: "error" });
        navigate(ROUTES.USERS);
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [email, navigate]);

  // ─── Submit ───────────────────────────────────────────────
  const handleSubmit = useCallback((data: UserFormData) => {
    if (!userId) {
      showToast({ title: "Error", description: "User ID not found.", type: "error" });
      return;
    }

    setLoading(true);

    const { roleName, assignToManagerUsername, password, username, ...updatePayload } = data;

    updateUser(userId, updatePayload)
      .then(() => {
        showToast(getSuccessToast("User", "updated"));
        timerRef.current = setTimeout(() => {
          setLoading(false);
          navigate(ROUTES.USERS);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        showToast(getErrorToast("User", "updated"));
        setLoading(false);
      });
  }, [userId, navigate]);

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#5752FE] border-t-transparent" />
      </div>
    );
  }

  return (
    <UserForm
      mode="edit"
      callerRole={callerRole}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={loading}
      onCancel={() => navigate(ROUTES.USERS)}
    />
  );
}