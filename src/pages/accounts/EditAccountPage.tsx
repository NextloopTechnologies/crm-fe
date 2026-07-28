import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showToast } from '@/components/common/Toast'
import AccountForm from '@/components/forms/AccountForm'
import { ROUTES } from '@/lib/route'
import { CreateAccountRequest } from '@/types/api.types'
import { getAccountByAccountNumber, updateAccount } from '@/api/account.api'
import { ResponseCode } from '@/constants/statusCodes'
import { getSuccessToast } from '@/components/common/toastMessages'

export default function EditAccountPage() {
  const navigate    = useNavigate()
  const [loading, setLoading] = useState(false)
 const { id } = useParams();
  const [formData, setFormData] = useState<CreateAccountRequest>({} as CreateAccountRequest);

  useEffect(() => {
     if (id) {
      fetchAccountDetails();
    }
  }, [id]);

   const fetchAccountDetails = async () => {
      try {
        setLoading(true);
  
        const response = await getAccountByAccountNumber(id!);
  
        const account = response.data;
  
        setFormData({
            accountName: account.accountName ?? "",
            accountSite: account.accountSite ?? "",
            accountType: account.accountType ?? "",
            rating: account.rating ?? "",
            website: account.website ?? "",
            tickerSymbol: account.tickerSymbol ?? "",
            ownership: account.ownership ?? "",
            parentAccount: account.parentAccount ?? "",
            employees: account.employees ?? "",
            annualRevenue: account.annualRevenue ?? "",
        
            contacts: [
              {
                title: account.contacts?.[0]?.title ?? "",
                firstName: account.contacts?.[0]?.firstName ?? "",
                lastName: account.contacts?.[0]?.lastName ?? "",
                email: account.contacts?.[0]?.email ?? "",
                secondaryEmail: account.contacts?.[0]?.secondaryEmail ?? "",
                phone: account.contacts?.[0]?.phone ?? "",
                mobile: account.contacts?.[0]?.mobile ?? "",
                skypeId: account.contacts?.[0]?.skypeId ?? "",
                designation: account.contacts?.[0]?.designation ?? "",
                department: account.contacts?.[0]?.department ?? "",
                dateOfBirth: account.contacts?.[0]?.dateOfBirth ?? "",
                fax: account.contacts?.[0]?.fax ?? "",
              },
            ],
        
            addresses: [
              {
                addressType: account.addresses?.[0]?.addressType ?? "",
                country: account.addresses?.[0]?.country ?? "",
                flatNo: account.addresses?.[0]?.flatNo ?? "",
                street: account.addresses?.[0]?.street ?? "",
                city: account.addresses?.[0]?.city ?? "",
                state: account.addresses?.[0]?.state ?? "",
                zipCode: account.addresses?.[0]?.zipCode ?? "",
                latitude: account.addresses?.[0]?.latitude ?? "",
                longitude: account.addresses?.[0]?.longitude ?? "",
              },
            ],
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
  // const defaultValues = useMemo<Partial<CreateAccountRequest> | undefined>(() => {
  //   const found = usersData.find((u) => String(u.id) === id)
  //   return found ?? undefined
  // }, [id])

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (data: CreateAccountRequest) => {
      try {
        setLoading(true);
  
        const response = await updateAccount(id!, data);
  
        if (response.code === ResponseCode.SUCCESS) {
          showToast(getSuccessToast("Account", "updated"));
  
          setTimeout(() => {
            navigate(ROUTES.ACCOUNTS);
          }, 500);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );
    
  return (
    <AccountForm
      mode="edit"
      defaultValues={formData}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}