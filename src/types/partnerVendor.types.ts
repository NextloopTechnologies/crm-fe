/** Mirrors PartnerType / PartnerStatus / PartnerPriority in crm-be. */
export type PartnerType = 'PARTNER' | 'VENDOR'
export type PartnerStatus = 'ACTIVE' | 'INACTIVE'
export type PartnerPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface PartnerVendorAddress {
  country?: string
  flatNo?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface PartnerVendorRequest {
  companyName: string
  partnerType: PartnerType
  website?: string
  contactPerson?: string
  email?: string
  phone?: string
  mobile?: string
  status?: PartnerStatus
  priority?: PartnerPriority
  gstin?: string
  pan?: string
  msaSigned?: boolean
  /** yyyy-MM-dd */
  msaValidUntil?: string
  partnerOwner?: string
  address?: PartnerVendorAddress
}

export interface PartnerVendor extends PartnerVendorRequest {
  partnerNumber: string
  creationDate?: string
  lastModifiedDate?: string
  organizationId?: string
}
