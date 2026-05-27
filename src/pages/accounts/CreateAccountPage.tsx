import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@/components/common/Toast'
import { CreatedIcon } from '@/assets/icons/components/index'
import AccountForm, { AccountFormData } from '@/components/forms/AccountForm'
import { ROUTES } from '@/lib/route'

export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = useCallback((data: AccountFormData) => {
    setLoading(true)
    showToast({
      title: "Account created!",
      description: "New account added successfully.",
      type: "success",
      icon: <CreatedIcon />
    })
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.ACCOUNTS)
    }, 1000)
  }, [navigate])

  return <AccountForm mode="add" onSubmit={handleSubmit} isLoading={loading} />
}