import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';
import { ROUTES } from '@/lib/route'
import TenantForm, { TenantFormData } from '@/components/forms/TenantForm';

export default function CreateTenantPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = useCallback((data: TenantFormData) => {
    setLoading(true);
    console.log("Create tenant:", data);
    // API call here
    showToast({ title: "Tenant created!", description: "New Tenant added successfully.", type: "success", icon: <CreatedIcon /> });
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.TENANTS)
    }, 1000)
  }, [navigate])
  return <TenantForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}