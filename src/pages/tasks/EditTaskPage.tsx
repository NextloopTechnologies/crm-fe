import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import TaskForm from '@/components/forms/TaskForm';
import { ROUTES } from '@/lib/route'
import { CreateTaskRequest } from '@/types/api.types';
import { getTaskByTaskNumber, updateTask } from '@/api/tasks.api';
import { ResponseCode } from '@/constants/statusCodes';
import { getSuccessToast } from '@/components/common/toastMessages';

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
     fetchAccountDetails();
   }
 }, [id]);


  const [task, setTask] = useState<Partial<CreateTaskRequest> | undefined>(undefined);
  const fetchAccountDetails = async () => {
      try {
        setLoading(true);
  
        const response = await getTaskByTaskNumber(id!);
  
        const task = response.data;
        setTask({
          subject: task.subject ?? "",
          description: task.description ?? "",
          dueDate: task.dueDate ?? "",
          status: task.status ?? "",
          priority: task.priority ?? "",
          accountNumber: task.accountNumber ?? "",
          contactId: task.contactId ?? "",
          isReminder: task.isReminder?.toString() ?? "false",
          isRepeat: task.isRepeat?.toString() ?? "false",
          relatedToType: task.relatedToType ?? "",
          repeatDetails: {
            repeatType: task.repeatDetails?.repeatType ?? "",
            frequency: task.repeatDetails?.frequency ?? "",
            everyX: task.repeatDetails?.everyX ?? 0,
            endType: task.repeatDetails?.endType ?? "",
            endAfterTimes: task.repeatDetails?.endAfterTimes ?? 0,
            endOnDate: task.repeatDetails?.endOnDate ?? "",
          },
        });
      }catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
 

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (data: CreateTaskRequest) => {
      try {
        setLoading(true);
  
        const response = await updateTask(id!, data);
        
        if (response.code === ResponseCode.SUCCESS) {
          showToast(getSuccessToast("Task", "updated"));

  
          setTimeout(() => {
            navigate(ROUTES.TASKS);
          }, 500);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );

  return (
    <TaskForm
      mode="edit"
      defaultValues={task}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}



