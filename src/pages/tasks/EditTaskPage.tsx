import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { usersData } from '@/data/user.data';
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm';
import { ROUTES } from '@/lib/route'

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])


  const [task, setTask] = useState<Partial<TaskFormData> | undefined>(undefined);

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    if (found) setTask(found);
  }, [id]);

  const defaultValues = useMemo<Partial<TaskFormData> | undefined>(() => {
    const found = usersData.find((u) => String(u.id) === id)
    return found ?? undefined
  }, [id])

  const handleSubmit = useCallback((data: TaskFormData) => {
    setLoading(true);
    // API call here
    showToast({ title: "Task updated!", description: "Changes saved successfully.", type: "success" });
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.TASKS)
    }, 1000)
  }, [navigate])

  return (
    <TaskForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}



