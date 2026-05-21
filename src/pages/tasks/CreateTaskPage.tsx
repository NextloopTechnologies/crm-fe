import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';
import TaskForm, { TaskFormData } from '@/components/forms/TaskForm';

export default function CreateTaskPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: TaskFormData) => {
    setLoading(true);
    console.log("Create tenant:", data);
    // API call here
    showToast({ title: "Task created!", description: "New Task added successfully.", type: "success", icon: <CreatedIcon /> });
    setTimeout(() => { setLoading(false); navigate("/tasks"); }, 1000);
  };

  return <TaskForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}