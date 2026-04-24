import api from '@/lib/axios'
import type { Project, PaginatedResponse } from '@/types/api.types'

export const getProjects = (params?: { status?: string; page?: number }) =>
  api.get<PaginatedResponse<Project>>('/projects', { params }).then((r) => r.data)

export const getProjectById = (id: number) =>
  api.get<Project>(`/projects/${id}`).then((r) => r.data)

export const createProject = (data: Partial<Project>) =>
  api.post<Project>('/projects', data).then((r) => r.data)

export const updateProject = (id: number, data: Partial<Project>) =>
  api.put<Project>(`/projects/${id}`, data).then((r) => r.data)

export const updateProjectStatus = (id: number, status: string) =>
  api.patch(`/projects/${id}/status`, { status }).then((r) => r.data)

export const getMilestones = (id: number) =>
  api.get(`/projects/${id}/milestones`).then((r) => r.data)

export const addMilestone = (id: number, data: object) =>
  api.post(`/projects/${id}/milestones`, data).then((r) => r.data)
