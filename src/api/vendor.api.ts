import api from '@/lib/axios'
import type { Vendor, VendorRequest } from '@/types/vendor.types'

export const getVendors = async () => {
  const response = await api.get('/vendor')
  return response.data
}

export const getVendor = async (vendorNumber: string) => {
  const response = await api.get(`/vendor/${encodeURIComponent(vendorNumber)}`)
  return response.data
}

export const createVendor = async (payload: VendorRequest) => {
  const response = await api.post('/vendor', payload)
  return response.data
}

export const updateVendor = async (vendorNumber: string, payload: VendorRequest) => {
  const response = await api.put(`/vendor/${encodeURIComponent(vendorNumber)}`, payload)
  return response.data
}

export const deleteVendor = async (vendorNumber: string) => {
  const response = await api.delete(`/vendor/${encodeURIComponent(vendorNumber)}`)
  return response.data
}

export type { Vendor, VendorRequest }
