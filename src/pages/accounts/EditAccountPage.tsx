import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showToast } from '@/components/common/Toast'
import { usersData } from '@/data/user.data'
import AccountForm, { AccountFormData } from '@/components/forms/AccountForm'
import { ROUTES } from '@/lib/route'

export default function EditAccountPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [loading, setLoading] = useState(false)
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const defaultValues = useMemo<Partial<AccountFormData> | undefined>(() => {
    const found = usersData.find((u) => String(u.id) === id)
    return found ?? undefined
  }, [id])

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = useCallback((data: AccountFormData) => {
    setLoading(true)
    showToast({
      title: "Account updated!",
      description: "Changes saved successfully.",
      type: "success",
    })
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.ACCOUNTS)
    }, 1000)
  }, [navigate])

  return (
    <AccountForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}