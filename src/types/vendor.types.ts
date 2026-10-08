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
  /**
   * Cities the vendor can source in — distinct from address.city, which is
   * where they are registered.
   *
   * Omit the field on update to leave the stored list alone; send [] to clear
   * it. The backend trims, collapses whitespace, drops blanks and deduplicates
   * case-insensitively, and returns the list sorted.
   */
  operatingCities?: string[]
}

export interface Vendor extends VendorRequest {
  vendorNumber: string
  creationDate?: string
  lastModifiedDate?: string
  organizationId?: string
}
