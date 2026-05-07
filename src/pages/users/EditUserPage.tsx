import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm, { UserFormData } from '@/components/forms/UserForm';
import { showToast } from '@/components/common/Toast';
import { usersData } from '@/data/user.data';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Partial<UserFormData> | undefined>(undefined);

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    if (found) setUser(found);
  }, [id]);

  const handleSubmit = (data: UserFormData) => {
    setLoading(true);
    console.log("Update user:", data);
    // API call here
    showToast({ title: "User updated!", description: "Changes saved successfully.", type: "success" });
    setTimeout(() => { setLoading(false); navigate("/users"); }, 1000);
  };

  return (
    <UserForm
      mode="edit"
      defaultValues={user}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}