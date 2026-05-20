import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TenantFormData } from '@/components/forms/TenantForm';
import { showToast } from '@/components/common/Toast';
import { usersData } from '@/data/user.data';
import TenantForm from '@/components/forms/TenantForm';

export default function EditTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState<Partial<TenantFormData> | undefined>(undefined);

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    if (found) setTenant(found);
  }, [id]);

  const handleSubmit = (data: TenantFormData) => {
    setLoading(true);
    console.log("Update tenant:", data);
    // API call here
    showToast({ title: "Tenant updated!", description: "Changes saved successfully.", type: "success" });
    setTimeout(() => { setLoading(false); navigate("/tenants"); }, 1000);
  };

  return (
    <TenantForm
      mode="edit"
      defaultValues={tenant}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}