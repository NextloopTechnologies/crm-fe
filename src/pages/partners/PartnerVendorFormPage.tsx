import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FormPage, { type FormSection } from '@/components/common/Form'
import { Input } from '@/components/common/Input'
import { InlineInput } from '@/components/common/InlineInput'
import { Button } from '@/components/common/Button'
import { Checkbox } from '@/components/common/Checkbox'
import SelectDropdown from '@/components/common/SelectDropdown'
import BackButton from '@/components/common/BackButton'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import {
  createPartnerVendor,
  getPartnerVendor,
  updatePartnerVendor,
} from '@/api/partnerVendor.api'
import {
  PARTNER_PRIORITY_OPTIONS,
  PARTNER_STATUS_OPTIONS,
  PARTNER_TYPE_OPTIONS,
} from '@/constants/PartnerVendor'
import type { PartnerType, PartnerVendorRequest } from '@/types/partnerVendor.types'

const EMPTY: PartnerVendorRequest = {
  companyName: '',
  partnerType: 'PARTNER',
  website: '',
  contactPerson: '',
  email: '',
  phone: '',
  mobile: '',
  status: 'ACTIVE',
  priority: 'MEDIUM',
  gstin: '',
  pan: '',
  msaSigned: false,
  msaValidUntil: '',
  address: { country: '', flatNo: '', street: '', city: '', state: '', zipCode: '' },
}

// Formats mirror the backend so anything accepted here is accepted server-side.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/

export default function PartnerVendorFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const mode: 'add' | 'edit' = id ? 'edit' : 'add'

  const presetType = (location.state as { partnerType?: PartnerType } | null)?.partnerType

  const [form, setForm] = useState<PartnerVendorRequest>({
    ...EMPTY,
    partnerType: presetType ?? 'PARTNER',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    getPartnerVendor(id)
      .then((res) => {
        const d = res?.data
        if (d) setForm({ ...EMPTY, ...d, address: { ...EMPTY.address, ...(d.address ?? {}) } })
      })
      .catch(() =>
        showToast({ title: 'Could not load', description: 'Please try again.', type: 'error' }),
      )
  }, [id])

  const noun = form.partnerType === 'VENDOR' ? 'Vendor' : 'Partner'

  const set = <K extends keyof PartnerVendorRequest>(key: K, value: PartnerVendorRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const setAddress = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }))

  const validate = () => {
    const next: Record<string, string> = {}

    // Only company name is mandatory — same reasoning as leads: don't block
    // capture on detail nobody has yet. Everything else is format-checked
    // when supplied.
    if (!form.companyName?.trim()) next.companyName = 'Company name is required.'
    else if (form.companyName.length > 100) next.companyName = 'Company name must be under 100 characters.'

    if (form.email?.trim() && !EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.phone?.trim() && !PHONE_RE.test(form.phone)) next.phone = 'Phone must be 7–15 digits.'
    if (form.mobile?.trim() && !PHONE_RE.test(form.mobile)) next.mobile = 'Mobile must be 7–15 digits.'
    if (form.gstin?.trim() && !GSTIN_RE.test(form.gstin))
      next.gstin = 'GSTIN must be 15 characters, e.g. 22AAAAA0000A1Z5.'
    if (form.pan?.trim() && !PAN_RE.test(form.pan)) next.pan = 'PAN must be 10 characters, e.g. AAAAA9999A.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload: PartnerVendorRequest = {
        ...form,
        msaValidUntil: form.msaValidUntil?.trim() ? form.msaValidUntil : undefined,
      }
      const res =
        mode === 'edit' && id
          ? await updatePartnerVendor(id, payload)
          : await createPartnerVendor(payload)

      if (res?.status === 'Success') {
        showToast({
          title: mode === 'edit' ? `${noun} updated!` : `${noun} created!`,
          description: `${form.companyName} saved successfully.`,
          type: 'success',
        })
        navigate(ROUTES.PARTNERS)
        return
      }

      // Surface server-side field errors rather than a generic failure.
      if (res?.errors) setErrors(res.errors)
      showToast({
        title: 'Could not save',
        description: res?.description ?? 'Please check the highlighted fields.',
        type: 'error',
      })
    } catch {
      showToast({ title: 'Could not save', description: 'Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const sections: FormSection[] = useMemo(
    () => [
      {
        icon: <span>🏢</span>,
        title: `${noun} Information`,
        subtitle: 'Company and primary contact details.',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        children: (
          <>
            <SelectDropdown
              label="Type"
              placeholder="Select type"
              options={PARTNER_TYPE_OPTIONS}
              value={form.partnerType}
              onChange={(v) => set('partnerType', v as PartnerType)}
              required
              disabled={mode === 'edit'}
            />
            <Input
              id="companyName"
              label="Company Name"
              placeholder="Enter company name"
              required
              value={form.companyName}
              onChange={(e) => set('companyName', e.target.value)}
              error={errors.companyName}
            />
            <Input
              id="website"
              label="Website"
              placeholder="https://example.com"
              value={form.website ?? ''}
              onChange={(e) => set('website', e.target.value)}
              error={errors.website}
            />
            <Input
              id="contactPerson"
              label="Contact Person"
              placeholder="Enter contact name"
              value={form.contactPerson ?? ''}
              onChange={(e) => set('contactPerson', e.target.value)}
              error={errors.contactPerson}
            />
            <Input
              id="email"
              label="Email"
              placeholder="Enter email"
              value={form.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
            />
            <Input
              id="phone"
              label="Phone"
              placeholder="Enter phone"
              value={form.phone ?? ''}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              id="mobile"
              label="Mobile"
              placeholder="Enter mobile"
              value={form.mobile ?? ''}
              onChange={(e) => set('mobile', e.target.value)}
              error={errors.mobile}
            />
          </>
        ),
      },
      {
        icon: <span>🛡️</span>,
        title: 'Classification & Compliance',
        subtitle: 'Status, priority and tax details.',
        iconBg: 'bg-green-50',
        iconColor: 'text-green-500',
        children: (
          <>
            <SelectDropdown
              label="Status"
              placeholder="Select status"
              options={PARTNER_STATUS_OPTIONS}
              value={form.status ?? ''}
              onChange={(v) => set('status', v as PartnerVendorRequest['status'])}
            />
            <SelectDropdown
              label="Priority"
              placeholder="Select priority"
              options={PARTNER_PRIORITY_OPTIONS}
              value={form.priority ?? ''}
              onChange={(v) => set('priority', v as PartnerVendorRequest['priority'])}
            />
            <Input
              id="gstin"
              label="GSTIN"
              placeholder="22AAAAA0000A1Z5"
              value={form.gstin ?? ''}
              onChange={(e) => set('gstin', e.target.value.toUpperCase())}
              error={errors.gstin}
            />
            <Input
              id="pan"
              label="PAN"
              placeholder="AAAAA9999A"
              value={form.pan ?? ''}
              onChange={(e) => set('pan', e.target.value.toUpperCase())}
              error={errors.pan}
            />
            <div className="flex items-center pt-6">
              <Checkbox
                id="msaSigned"
                label="MSA signed"
                checked={Boolean(form.msaSigned)}
                onCheckedChange={(checked) => set('msaSigned', checked)}
              />
            </div>
            <Input
              id="msaValidUntil"
              label="MSA Valid Until"
              type="date"
              value={form.msaValidUntil ?? ''}
              onChange={(e) => set('msaValidUntil', e.target.value)}
              error={errors.msaValidUntil}
            />
          </>
        ),
      },
      {
        icon: <span>📍</span>,
        title: 'Address',
        subtitle: 'Optional — add it when you have it.',
        iconBg: 'bg-[#5752FE1A]',
        iconColor: 'text-[#5752FE]',
        children: (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 pt-6 px-6">
            <InlineInput id="country" label="Country" placeholder="Enter country" value={form.address?.country ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress('country', e.target.value)} error={errors.country} />
            <InlineInput id="street" label="Street" placeholder="Enter street" value={form.address?.street ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress('street', e.target.value)} error={errors.street} />
            <InlineInput id="state" label="State" placeholder="Enter state" value={form.address?.state ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress('state', e.target.value)} error={errors.state} />
            <InlineInput id="flatNo" label="Flat No." placeholder="Enter flat number" value={form.address?.flatNo ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress('flatNo', e.target.value)} error={errors.flatNo} />
            <InlineInput id="city" label="City" placeholder="Enter city" value={form.address?.city ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress('city', e.target.value)} error={errors.city} />
            <InlineInput id="zipCode" label="Zip Code" placeholder="Enter zip code" value={form.address?.zipCode ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress('zipCode', e.target.value)} error={errors.zipCode} />
          </div>
        ),
      },
    ],
    [form, errors, noun, mode],
  )

  return (
    <div className="bg-white min-h-screen rounded-lx">
      <BackButton path={ROUTES.PARTNERS} label="Back To List" icon={<ArrowLeft size={16} />} />
      <div className="mt-6">
        <FormPage
          heading={mode === 'add' ? `Create ${noun}` : `Edit ${noun}`}
          subheading={
            mode === 'add'
              ? form.partnerType === 'PARTNER'
                ? 'Partners share hiring requirements.'
                : 'Vendors share candidate profiles.'
              : `Update ${noun.toLowerCase()} details.`
          }
          sections={sections}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.PARTNERS)}
          submitLabel={
            <Button type="submit" variant="primary" size="lg" fullWidth className="mt-1" disabled={loading}>
              {loading ? 'Saving...' : mode === 'add' ? 'Save' : 'Update'}
            </Button>
          }
        />
      </div>
    </div>
  )
}
