import api from '@/lib/axios'
import type { Lead, CreateLeadRequest, PaginatedResponse } from '@/types/api.types'

export interface LeadFilters {
  stage?: string
  source?: string
  ownerId?: number
  search?: string
  page?: number
  size?: number
}

import axios from "axios";

export const getAllLeads = async () => {

  const response = await api.get('lead/getAllLeads');

  return response.data;
};

  export const createLead = async (data: CreateLeadRequest) => {
    const response = await api.post(
      '/lead/register',
      data
    );
  
    return response.data;
  };

export const getLeadById = (id: number) =>
  api.get<Lead>(`/leads/${id}`).then((r) => r.data)



export const updateLead = (id: number, data: Partial<CreateLeadRequest>) =>
  api.put<Lead>(`/leads/${id}`, data).then((r) => r.data)

export const updateLeadStage = (id: number, stage: string, reason?: string) =>
  api.patch<Lead>(`/leads/${id}/stage`, { newStage: stage, reason }).then((r) => r.data)

export const assignLead = (id: number, ownerId: number) =>
  api.patch<Lead>(`/leads/${id}/assign`, { ownerId }).then((r) => r.data)

export const deleteLead = (id: number) =>
  api.delete(`/leads/${id}`).then((r) => r.data)

export const getLeadHistory = (id: number) =>
  api.get(`/leads/${id}/history`).then((r) => r.data)

export const getInactiveLeads = () =>
  api.get<Lead[]>('/leads/inactive').then((r) => r.data)

export const getDuplicateLeads = () =>
  api.get<Lead[]>('/leads/duplicates').then((r) => r.data)
