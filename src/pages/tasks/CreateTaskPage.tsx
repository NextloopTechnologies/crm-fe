import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm';
import { ROUTES } from '@/lib/route'

export default function CreateTaskPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = useCallback((data: TaskFormData) => {
    setLoading(true);
    // API call here
    showToast({ title: "Task created!", description: "New Task added successfully.", type: "success", icon: <CreatedIcon /> });
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.TASKS)
    }, 1000)
  }, [navigate])
  return <TaskForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}