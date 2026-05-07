import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm, { UserFormData } from '@/components/forms/UserForm';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';

export default function CreateUsers() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: UserFormData) => {
    setLoading(true);
    console.log("Create user:", data);
    // API call here
    showToast({ title: "User created!", description: "New user added successfully.", type: "success", icon: <CreatedIcon /> });
    setTimeout(() => { setLoading(false); navigate("/users"); }, 1000);
  };

  return <UserForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}