import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';
import AccountForm, { AccountFormData } from '@/components/forms/AccountForm';

export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: AccountFormData) => {
    setLoading(true);
    console.log("Create account:", data);
    // API call here
    showToast({ title: "Account created!", description: "New account added successfully.", type: "success", icon: <CreatedIcon /> });
    setTimeout(() => { setLoading(false); navigate("/accounts"); }, 1000);
  };

  return <AccountForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}