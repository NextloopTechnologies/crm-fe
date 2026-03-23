import api from '@/lib/axios'
import type { Task, PaginatedResponse } from '@/types/api.types'

export const getTasks = (params?: { assignedTo?: number; status?: string; page?: number }) =>
  api.get<PaginatedResponse<Task>>('/tasks', { params }).then((r) => r.data)

export const getMyTasks = () =>
  api.get<Task[]>('/tasks/my').then((r) => r.data)

export const getOverdueTasks = () =>
  api.get<Task[]>('/tasks/overdue').then((r) => r.data)

export const createTask = (data: Partial<Task>) =>
  api.post<Task>('/tasks', data).then((r) => r.data)

export const updateTask = (id: number, data: Partial<Task>) =>
  api.put<Task>(`/tasks/${id}`, data).then((r) => r.data)

export const completeTask = (id: number) =>
  api.patch<Task>(`/tasks/${id}/complete`).then((r) => r.data)
