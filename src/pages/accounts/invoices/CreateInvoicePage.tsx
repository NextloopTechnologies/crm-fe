import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatedIcon } from "@/assets/icons/components";
import AccountForm from "@/components/forms/AccountForm";
import { ROUTES } from "@/lib/route";
import { CreateAccountRequest, CreateInvoiceRequest } from "@/types/api.types";
import { createAccount } from "@/api/account.api";
import { ResponseCode } from "@/constants/statusCodes";
import { getSuccessToast , getErrorToast } from "@/components/common/toastMessages";
import { showToast } from "@/components/common/Toast";
import InvoiceForm from "@/components/forms/InvoiceForm";
export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
    };
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateInvoiceRequest) => {
      try {
        setLoading(true);
        // const response = await createAccount(data);
        // if (response?.code === ResponseCode.SUCCESS) {
        //   showToast(getSuccessToast("Account", "created"));
        
            navigate(ROUTES.ACCOUNTS);
        
      } catch (error) {
        console.error(error);

        showToast(getErrorToast("create", "Account"));
        
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return (
    <InvoiceForm
      mode="add"
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}