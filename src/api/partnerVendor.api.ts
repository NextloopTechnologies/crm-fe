import api from '@/lib/axios'
import type { PartnerVendor, PartnerVendorRequest, PartnerType } from '@/types/partnerVendor.types'

/**
 * Partners and vendors share one endpoint, separated by `type`.
 * Omit the type to fetch both — the screen toggle passes one or the other.
 */
export const getPartnerVendors = async (type?: PartnerType) => {
  const response = await api.get('/partner-vendor', {
    params: type ? { type } : undefined,
  })
  return response.data
}

export const getPartnerVendor = async (partnerNumber: string) => {
  const response = await api.get(`/partner-vendor/${encodeURIComponent(partnerNumber)}`)
  return response.data
}

export const createPartnerVendor = async (payload: PartnerVendorRequest) => {
  const response = await api.post('/partner-vendor', payload)
  return response.data
}

export const updatePartnerVendor = async (
  partnerNumber: string,
  payload: PartnerVendorRequest,
) => {
  const response = await api.put(`/partner-vendor/${encodeURIComponent(partnerNumber)}`, payload)
  return response.data
}

export const deletePartnerVendor = async (partnerNumber: string) => {
  const response = await api.delete(`/partner-vendor/${encodeURIComponent(partnerNumber)}`)
  return response.data
}

export type { PartnerVendor, PartnerVendorRequest }
