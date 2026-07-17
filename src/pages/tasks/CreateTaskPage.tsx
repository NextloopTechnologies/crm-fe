import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import TaskForm from '@/components/forms/TaskForm';
import { ROUTES } from '@/lib/route'
import { CreateTaskRequest } from '@/types/api.types';
import { ResponseCode } from '@/constants/statusCodes';
import { createTask } from '@/api/tasks.api';
import { getErrorToast, getSuccessToast } from '@/components/common/toastMessages';

export default function CreateTaskPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = useCallback(async (data: CreateTaskRequest) => {
    try {
           setLoading(true);
           const response = await createTask(data);
           if (response?.code === ResponseCode.SUCCESS) {
            showToast(getSuccessToast("Task", "created"));
   
               navigate(ROUTES.TASKS);
           }
         } catch (error) {
           console.error(error);
   
           showToast(getErrorToast("create", "Task"));
         } finally {
           setLoading(false);
         }
       },
       [navigate]
      );
  return <TaskForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}