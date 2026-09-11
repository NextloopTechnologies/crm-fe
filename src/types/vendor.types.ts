/** Mirrors VendorStatus / VendorPriority in crm-be. */
export type VendorStatus = 'ACTIVE' | 'INACTIVE'
export type VendorPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface VendorAddress {
  country?: string
  flatNo?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface VendorRequest {
  companyName: string
  website?: string
  contactPerson?: string
  email?: string
  phone?: string
  mobile?: string
  status?: VendorStatus
  priority?: VendorPriority
  gstin?: string
  pan?: string
  msaSigned?: boolean
  /** yyyy-MM-dd */
  msaValidUntil?: string
  vendorOwner?: string
  address?: VendorAddress
}

export interface Vendor extends VendorRequest {
  vendorNumber: string
  creationDate?: string
  lastModifiedDate?: string
  organizationId?: string
}
