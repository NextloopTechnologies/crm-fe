import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { ROUTES } from '@/lib/route'
import ProjectForm from '@/components/forms/ProjectForm';
import { getErrorToast, getSuccessToast } from '@/components/common/toastMessages';
import { ResponseCode } from '@/constants/statusCodes';
import { CreateProjectRequest } from '@/types/api.types';
import { createProject } from '@/api/projects.api';

export default function CreateProjectPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

 const handleSubmit = useCallback(async (data: CreateProjectRequest) => {
     try {
            setLoading(true);
            const response = await createProject(data);
            if (response?.code === ResponseCode.SUCCESS) {
             showToast(getSuccessToast("Project", "created"));
    
                navigate(ROUTES.PROJECT);
            }
          } catch (error) {
            console.error(error);
    
            showToast(getErrorToast("Project", "created"));
          } finally {
            setLoading(false);
          }
        },
        [navigate]
       );
  return <ProjectForm mode="add" onSubmit={handleSubmit} isLoading={loading} />;
}