import api from '@/lib/axios'
import type { Lead, CreateLeadRequest } from '@/types/api.types'

export interface LeadFilters {
  stage?: string
  source?: string
  ownerId?: number
  search?: string
  page?: number
  size?: number
}

export const getAllLeads = async () => {

  const response = await api.get('lead/getAllActiveLeads');

  return response.data;
};

  export const createLead = async (data: CreateLeadRequest) => {
    const response = await api.post(
      '/lead/register',
      data
    );
  
    return response.data;
  };

  export const getLeadByLeadNumber = async (leadNumber: string) => {
    const response = await api.get(
      `/lead/getLead?leadNoOrMobileOrEmail=${leadNumber}`
    );  
    return response.data;
  };

  export const updateLead = async (
    accountNumber: string,
    payload: CreateLeadRequest
  ) => {
    const response = await api.patch(
      `/lead/updateLeadDetails?accountNumber=${accountNumber}`,
      payload
    );
  
    return response.data;
  };

  export const updateLeadStatusbyLeadNumber = async (
    leadNumber: string,
    status: string
  ) => {
    const response = await api.patch(
      `lead/updateLeadStatus`,
      {leadNumber,
        status
      }
    );
  
    return response.data;
  };

export const getLeadById = (id: number) =>
  api.get<Lead>(`/leads/${id}`).then((r) => r.data)

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
