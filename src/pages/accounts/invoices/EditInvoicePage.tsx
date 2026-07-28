import { useCallback, useEffect, useState } from 'react'
import { showToast } from '@/components/common/Toast'
import { CreateInvoiceRequest } from '@/types/api.types'
import { getSuccessToast, getErrorToast } from '@/components/common/toastMessages'
import InvoiceForm from '@/components/forms/InvoiceForm'
import { STATIC_INVOICES } from './InvoicesList'

interface Props {
  invoiceId: string;
  accountNumber?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const toFormData = (inv: typeof STATIC_INVOICES[number]): Partial<CreateInvoiceRequest> => ({
  invoiceDate: inv.date,
  dueDate: "",
  status: inv.status as CreateInvoiceRequest["status"],
  description: "",
  items: [
    {
      itemDetails: inv.customerName,
      quantity: 1,
      rate: inv.amount,
      amount: inv.amount,
    },
  ],
  subTotal: inv.amount,
  discount: 0,
  tax: 0,
  grandTotal: inv.amount,
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankAddress: "",
  bankRoutingNo: "",
  accountHolderAddress:"",
});

export default function EditInvoicePage({ invoiceId, accountNumber, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Partial<CreateInvoiceRequest>>({});

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setFetching(true);
    //   const res = await getInvoiceById(invoiceId);
    //   const data = res.data || res;
    const found = STATIC_INVOICES.find((inv) => inv.id === invoiceId);
      if (found) {
        setFormData(toFormData(found));
      } else {
        showToast(getErrorToast("fetch", "Invoice"));
      }
    } catch (error) {
      console.error(error);
      showToast(getErrorToast("fetch", "Invoice"));
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = useCallback(
    async () => {
      try {
        setLoading(true);
        showToast(getSuccessToast("Invoice", "updated"));
        onSuccess?.();
      } catch (error) {
        console.error(error);
        showToast(getErrorToast("update", "Invoice"));
      } finally {
        setLoading(false);
      }
    },
    [invoiceId, accountNumber, onSuccess]
  );

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16 text-[#94a3b8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#5752FE] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading invoice…</p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceForm
      mode="edit"
      defaultValues={formData}
      accountNumber={accountNumber}
      onSubmit={handleSubmit}
      isLoading={loading}
      onCancel={onCancel}
    />
  );
}