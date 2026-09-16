/** Mirrors VendorStatus / VendorPriority in crm-be. */

export const VENDOR_STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
]

export const VENDOR_PRIORITY_OPTIONS = [
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
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
