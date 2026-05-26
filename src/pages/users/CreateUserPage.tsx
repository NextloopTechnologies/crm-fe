import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';
import { ROUTES } from '@/lib/route'
import UserForm, { UserFormData } from '@/components/forms/UserForm';

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = useCallback((data: UserFormData) => {
    setLoading(true);
    console.log("Create User:", data);
    // API call here
    showToast({ title: "User created!", description: "New User added successfully.", type: "success", icon: <CreatedIcon /> });
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.USERS)
    }, 1000)
  }, [navigate])
  return <UserForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}