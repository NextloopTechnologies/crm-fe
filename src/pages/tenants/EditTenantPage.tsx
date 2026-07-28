import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { usersData, type User } from '@/data/user.data';
import { ROUTES } from '@/lib/route'
import TenantForm, { TenantFormData } from '@/components/forms/TenantForm';

export default function EditTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])


  const [tenant, setTenant] = useState<TenantFormData | undefined>(undefined);

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

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    setTenant(mapUserToTenantFormData(found));
  }, [id]);

  const defaultValues = useMemo<Partial<TenantFormData> | undefined>(() => tenant, [tenant])

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



