import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { CreatedIcon } from '@/assets/icons/components/index';
import ReportForm, { ReportFormData } from '@/components/forms/ReportForm';

export default function CreateReportPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: ReportFormData) => {
    setLoading(true);
    console.log("Create Report:", data);
    // API call here
    showToast({ title: "Report created!", description: "New Report added successfully.", type: "success", icon: <CreatedIcon /> });
    setTimeout(() => { setLoading(false); navigate("/tasks"); }, 1000);
  };

  return <ReportForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}