import api from '@/lib/axios'
import type { Interaction } from '@/types/api.types'

export interface LogInteractionRequest {
  type: string
  notes: string
  interactedAt: string
}

export const getInteractions = (leadId: number) =>
  api.get<Interaction[]>(`/leads/${leadId}/interactions`).then((r) => r.data)

export const logInteraction = (leadId: number, data: LogInteractionRequest) =>
  api.post<Interaction>(`/leads/${leadId}/interactions`, data).then((r) => r.data)

export const updateInteraction = (leadId: number, id: number, data: Partial<LogInteractionRequest>) =>
  api.put<Interaction>(`/leads/${leadId}/interactions/${id}`, data).then((r) => r.data)

export const deleteInteraction = (leadId: number, id: number) =>
  api.delete(`/leads/${leadId}/interactions/${id}`).then((r) => r.data)
