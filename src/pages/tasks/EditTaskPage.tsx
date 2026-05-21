import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { usersData } from '@/data/user.data';
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm';

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<Partial<TaskFormData> | undefined>(undefined);

  useEffect(() => {
    const found = usersData.find((u) => String(u.id) === id);
    if (found) setTask(found);
  }, [id]);

  const handleSubmit = (data: TaskFormData) => {
    setLoading(true);
    console.log("Update tenant:", data);
    // API call here
    showToast({ title: "Tenant updated!", description: "Changes saved successfully.", type: "success" });
    setTimeout(() => { setLoading(false); navigate("/tasks"); }, 1000);
  };

  return (
    <TaskForm
      mode="edit"
      defaultValues={task}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}