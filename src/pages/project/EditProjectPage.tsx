import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/components/common/Toast';
import { ROUTES } from '@/lib/route'
import { ResponseCode } from '@/constants/statusCodes';
import { getSuccessToast } from '@/components/common/toastMessages';
import { CreateProjectRequest } from '@/types/api.types';
import ProjectForm from '@/components/forms/ProjectForm';
import { getProjectByProjectNumber, updateProject } from '@/api/projects.api';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
     fetchProjectDetails();
   }
 }, [id]);


  const [project, setProject] = useState<Partial<CreateProjectRequest> | undefined>(undefined);
  const fetchProjectDetails = async () => {
      try {
        setLoading(true);
  
        const response = await getProjectByProjectNumber(id!);
  
        const project = response.data;
        setProject({
            projectName: project.projectName ?? "",
            projectType: project.projectType ?? "",
            projectStatus: project.projectStatus ?? "",
            startDate: project.startDate ?? "",
            endDate: project.endDate ?? "",
            description: project.description ?? "",
        });
      }catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
 

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (data: CreateProjectRequest) => {
      try {
        setLoading(true);
  
        const response = await updateProject(id!, data);
        
        if (response.code === ResponseCode.SUCCESS) {
          showToast(getSuccessToast("Project", "updated"));

  
          setTimeout(() => {
            navigate(ROUTES.PROJECT);
          }, 500);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );

  return (
    <ProjectForm
      mode="edit"
      defaultValues={project}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}



