import api from '@/lib/axios'
import type { Project, CreateProjectRequest } from '@/types/api.types'

export const getAllProjects = async () => {

  const response = await api.get('project/getAllProjects');

  return response.data;
};

export const createProject = async (data: CreateProjectRequest) => {
  const response = await api.post(
    'project/createProject',
    data
  );

  return response.data;
};

export const updateProject = async (
  projectNumber: string,
  payload: CreateProjectRequest
) => {
  const response = await api.post(
    `project/updateProjectDetails?projectNumber=${projectNumber}`,
    payload
  );

  return response.data;
};
export const getProjectByProjectNumber = async (projectNumber: string) => {
  const response = await api.get(
    `project/getProject?projectNumber=${projectNumber}`
  );  
  return response.data;
};


export const updateProjectStatus = (id: number, status: string) =>
  api.patch(`/projects/${id}/status`, { status }).then((r) => r.data)

export const getMilestones = (id: number) =>
  api.get(`/projects/${id}/milestones`).then((r) => r.data)

export const addMilestone = (id: number, data: object) =>
  api.post(`/projects/${id}/milestones`, data).then((r) => r.data)
