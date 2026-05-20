import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantForm, { TenantFormData } from '@/components/forms/TenantForm';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';

export default function CreateTenantPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: TenantFormData) => {
    setLoading(true);
    console.log("Create tenant:", data);
    // API call here
    showToast({ title: "Tenant created!", description: "New tenant added successfully.", type: "success", icon: <CreatedIcon /> });
    setTimeout(() => { setLoading(false); navigate("/tenants"); }, 1000);
  };

  return <TenantForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}