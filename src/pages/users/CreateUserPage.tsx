import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { ROUTES } from '@/lib/route';
import UserForm from '@/components/forms/UserForm';
import { CreateUserRequest } from '@/types/api.types';
import { registerUser } from '@/api/user.api';
import { UserFormData } from '@/schemas';
import { getSuccessToast } from '@/components/common/toastMessages';

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  
  const callerRole = localStorage.getItem("roleName") || "SUPER_ADMIN"
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleSubmit = useCallback((data: UserFormData) => {
    setLoading(true);

    const payload: CreateUserRequest = {
      firstName:              data.firstName,
      lastName:               data.lastName,
      email:                  data.email,
      phone:                  data.phone,
      username:               data.username,
      password:               data.password,
      roleName:               data.roleName,

      assignToManagerUsername: data.assignToManagerUsername || "",
    };

    registerUser(payload);
    showToast(getSuccessToast("User" , "created"));

    timerRef.current = setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.USERS);
    }, 1000);
  }, [navigate]);
  return (<UserForm mode="add" callerRole={callerRole} onSubmit={handleSubmit} isLoading={loading} />);
}