import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as leadsApi from '@/api/leads.api'
import type { LeadFilters } from '@/api/leads.api'
import type { CreateLeadRequest } from '@/types/api.types'

export const LEADS_KEY = 'leads'

export const useLeads = (filters?: LeadFilters) =>
  useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
  })

export const useLead = (id: number) =>
  useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
  })

export const useCreateLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLeadRequest) => leadsApi.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] })
      toast.success('Lead created successfully')
    },
    onError: () => toast.error('Failed to create lead'),
  })
}

export const useUpdateLeadStage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage, reason }: { id: number; stage: string; reason?: string }) =>
      leadsApi.updateLeadStage(id, stage, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] })
      qc.invalidateQueries({ queryKey: ['pipeline'] })
      toast.success('Stage updated')
    },
    onError: () => toast.error('Failed to update stage'),
  })
}

export const useDeleteLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] })
      toast.success('Lead deleted')
    },
    onError: () => toast.error('Failed to delete lead'),
  })
}

export const useInactiveLeads = () =>
  useQuery({
    queryKey: [LEADS_KEY, 'inactive'],
    queryFn: leadsApi.getInactiveLeads,
  })
