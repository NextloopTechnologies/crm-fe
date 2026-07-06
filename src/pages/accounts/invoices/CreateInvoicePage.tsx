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

interface Props {
  accountNumber?: string;
  account?: CreateAccountRequest;
  onSuccess?: () => void; 
  onCancel?: () => void;
}


export default function CreateInvoicePage({ accountNumber, account, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
    };
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateInvoiceRequest) => {
      try {
        //  await createInvoice({ ...data, accountNumber_ref: accountNumber });
        showToast(getSuccessToast("Invoices" , "created"));
        onSuccess?.();
        setLoading(true);
            navigate(ROUTES.ACCOUNTS);
        
      } catch (error) {
        console.error(error);

        showToast(getErrorToast("create", "Account"));
        
      } finally {
        setLoading(false);
      }
    },
    [accountNumber, onSuccess]
  );

  return (
    <InvoiceForm
      mode="add"
      account={account}
      onSubmit={handleSubmit}
      isLoading={loading}
      onCancel={onCancel}
    />
  );
}