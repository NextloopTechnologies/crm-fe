import api from '@/lib/axios'
import type { Client, PaginatedResponse } from '@/types/api.types'

export const getClients = (params?: { search?: string; status?: string; page?: number }) =>
  api.get<PaginatedResponse<Client>>('/clients', { params }).then((r) => r.data)

export const getClientById = (id: number) =>
  api.get<Client>(`/clients/${id}`).then((r) => r.data)

export const createClient = (data: Partial<Client>) =>
  api.post<Client>('/clients', data).then((r) => r.data)

export const updateClient = (id: number, data: Partial<Client>) =>
  api.put<Client>(`/clients/${id}`, data).then((r) => r.data)

export const getClientContacts = (id: number) =>
  api.get(`/clients/${id}/contacts`).then((r) => r.data)

export const addClientContact = (id: number, data: object) =>
  api.post(`/clients/${id}/contacts`, data).then((r) => r.data)

export const getClientProjects = (id: number) =>
  api.get(`/clients/${id}/projects`).then((r) => r.data)
