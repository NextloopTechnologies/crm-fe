/** Mirrors PartnerStatus / PartnerPriority / PartnerType in crm-be. */

export const PARTNER_STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
]

export const PARTNER_PRIORITY_OPTIONS = [
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
]

export const PARTNER_TYPE_OPTIONS = [
  { label: 'Partner', value: 'PARTNER' },
  { label: 'Vendor', value: 'VENDOR' },
]

type Swatch = { bg: string; text: string }

export const STATUS_COLOR: Record<string, Swatch> = {
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  INACTIVE: { bg: 'bg-slate-100', text: 'text-slate-600' },
}

export const PRIORITY_COLOR: Record<string, Swatch> = {
  HIGH: { bg: 'bg-red-50', text: 'text-red-700' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700' },
  LOW: { bg: 'bg-blue-50', text: 'text-blue-700' },
}
