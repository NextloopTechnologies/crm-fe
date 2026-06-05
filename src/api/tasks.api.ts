import api from '@/lib/axios'
import type { CreateTaskRequest, PaginatedResponse } from '@/types/api.types'

export const createTask = async (data: CreateTaskRequest) => {
  const response = await api.post(
    '/task/register',
    data
  );

  return response.data;
};
export const getAllTasks = async () => {

  const response = await api.get('task/getAllTask');

  return response.data;
};
export const getTaskByTaskNumber = async (taskNumber: string) => {
  const response = await api.get(
    `task/getTask?taskNumber=${taskNumber}`
  );  
  return response.data;
};

 export const updateTask = async (
    taskNumber: string,
    payload: CreateTaskRequest
  ) => {
    const response = await api.patch(
      `task/updateTaskDetails?taskNumber=${taskNumber}`,
      payload
    );
  
    return response.data;
  };

export const getMyCreateTaskRequests = () =>
  api.get<CreateTaskRequest[]>('/CreateTaskRequests/my').then((r) => r.data)

export const getOverdueCreateTaskRequests = () =>
  api.get<CreateTaskRequest[]>('/CreateTaskRequests/overdue').then((r) => r.data)

export const createCreateTaskRequest = (data: Partial<CreateTaskRequest>) =>
  api.post<CreateTaskRequest>('/CreateTaskRequests', data).then((r) => r.data)

export const updateCreateTaskRequest = (id: number, data: Partial<CreateTaskRequest>) =>
  api.put<CreateTaskRequest>(`/CreateTaskRequests/${id}`, data).then((r) => r.data)

export const completeCreateTaskRequest = (id: number) =>
  api.patch<CreateTaskRequest>(`/CreateTaskRequests/${id}/complete`).then((r) => r.data)
