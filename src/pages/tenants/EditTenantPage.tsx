import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { usersData, type User } from '@/data/user.data';
import { ROUTES } from '@/lib/route'
import TenantForm, { type TenantFormData } from '@/components/forms/TenantForm';

export default function EditTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])



  const mapUserToTenantFormData = (user: User | undefined): TenantFormData | undefined => {
    if (!user) return undefined;

    const [firstName = '', ...lastNameParts] = user.name.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ');

    return {
      firstName,
      lastName,
      industry: '',
      email: user.email ?? '',
      username: user.email?.split('@')[0] ?? '',
      password: '',
      website: '',
      phone: user.phone ?? '',
      country: '',
      street: '',
      state: '',
      flatNo: '',
      city: '',
      zipCode: '',
    };
  };

  // A lookup in static data is derived state, not a side effect: storing it
  // meant an extra render on every id change and a frame showing the previous
  // tenant's details.
  const defaultValues = useMemo<Partial<TenantFormData> | undefined>(
    () => mapUserToTenantFormData(usersData.find((u) => String(u.id) === id)),
    [id],
  )

  const handleSubmit = useCallback(() => {
    setLoading(true);
    // API call here
    showToast({ title: "Tenant updated!", description: "Changes saved successfully.", type: "success" });
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.TENANTS)
    }, 1000)
  }, [navigate])

  return (
    <TenantForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}



