import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { usersData } from '@/data/user.data';
import AccountForm, { AccountFormData } from '@/components/forms/AccountForm';

export default function EditAccountPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Partial<AccountFormData> | undefined>(undefined);

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    if (found) setUser(found);
  }, [id]);

  const handleSubmit = (data: AccountFormData) => {
    setLoading(true);
    console.log("Update account:", data);
    // API call here
    showToast({ title: "Account updated!", description: "Changes saved successfully.", type: "success" });
    setTimeout(() => { setLoading(false); navigate("/accounts"); }, 1000);
  };

  return (
    <AccountForm
      mode="edit"
      defaultValues={user}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}