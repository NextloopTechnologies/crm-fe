import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/route";
import { CreateAccountRequest } from "@/types/api.types";
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
    async () => {
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