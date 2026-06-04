import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/common/Toast";
import { CreatedIcon } from "@/assets/icons/components";
import AccountForm from "@/components/forms/AccountForm";
import { ROUTES } from "@/lib/route";
import { CreateAccountRequest } from "@/types/api.types";
import { createAccount } from "@/api/account.api";
import { ResponseCode } from "@/constants/statusCodes";

export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
    };
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateAccountRequest) => {
      try {
        setLoading(true);
        const response = await createAccount(data);
        if (response?.code === ResponseCode.SUCCESS) {
          showToast({
            title: "Account created!",
            description: "New account added successfully.",
            type: "success",
            icon: <CreatedIcon />,
          });

            navigate(ROUTES.ACCOUNTS);
        }
      } catch (error) {
        console.error(error);

        showToast({
          title: "Failed!",
          description: "Unable to create account.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return (
    <AccountForm
      mode="add"
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}