import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showToast } from '@/components/common/Toast'
import { usersData } from '@/data/user.data'
import { ROUTES } from '@/lib/route'
import ReportForm, { ReportFormData } from '@/components/forms/ReportForm'

export default function EditReportPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [loading, setLoading] = useState(false)
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const defaultValues = useMemo<Partial<ReportFormData> | undefined>(() => {
    const found = usersData.find((u) => String(u.id) === id)
    return found ?? undefined
  }, [id])

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    setLoading(true)
    showToast({
      title: "Report updated!",
      description: "Changes saved successfully.",
      type: "success",
    })
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.REPORTS)
    }, 1000)
  }, [navigate])

  return (
    <ReportForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  )
}


