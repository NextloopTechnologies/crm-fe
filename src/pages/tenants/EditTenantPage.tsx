import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { usersData } from '@/data/user.data';
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm';
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


  const [tenant, setTenant] = useState<Partial<TenantFormData> | undefined>(undefined);

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    if (found) setTenant(found);
  }, [id]);

  const defaultValues = useMemo<Partial<TenantFormData> | undefined>(() => {
    const found = usersData.find((u) => String(u.id) === id)
    return found ?? undefined
  }, [id])

  const handleSubmit = useCallback((data: TenantFormData) => {
    setLoading(true);
    console.log("Update tenant:", data);
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



