import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@/components/common/Toast'
import { CreatedIcon } from '@/assets/icons/components/index'
import ReportForm, { ReportFormData } from '@/components/forms/ReportForm';
import { ROUTES } from '@/lib/route'

export default function CreateReportPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = useCallback((data: ReportFormData) => {
    setLoading(true);
    // API call here
    showToast({ title: "Report created!", description: "New Report added successfully.", type: "success", icon: <CreatedIcon /> });
    timerRef.current = setTimeout(() => {
      setLoading(false)
      navigate(ROUTES.ACCOUNTS)
    }, 1000)
  }, [navigate]
)

  return <ReportForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}