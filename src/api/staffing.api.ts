import api from '@/lib/axios'
import type {
  CandidateRequest,
  DashboardPeriod,
  RequirementRequest,
  SubmissionRequest,
} from '@/types/staffing.types'

// ── Requirements ────────────────────────────────────────────────────────────

export const getRequirements = async () => (await api.get('/staffing/requirement')).data

export const getRequirement = async (requirementNumber: string) =>
  (await api.get(`/staffing/requirement/${encodeURIComponent(requirementNumber)}`)).data

export const createRequirement = async (payload: RequirementRequest) =>
  (await api.post('/staffing/requirement', payload)).data

export const updateRequirement = async (requirementNumber: string, payload: RequirementRequest) =>
  (await api.put(`/staffing/requirement/${encodeURIComponent(requirementNumber)}`, payload)).data

export const changeRequirementStatus = async (requirementNumber: string, status: string) =>
  (await api.patch(`/staffing/requirement/${encodeURIComponent(requirementNumber)}/status`, { status })).data

export const deleteRequirement = async (requirementNumber: string) =>
  (await api.delete(`/staffing/requirement/${encodeURIComponent(requirementNumber)}`)).data

// ── Candidates ──────────────────────────────────────────────────────────────

export const getCandidates = async () => (await api.get('/staffing/candidate')).data

export const getCandidate = async (candidateNumber: string) =>
  (await api.get(`/staffing/candidate/${encodeURIComponent(candidateNumber)}`)).data

export const createCandidate = async (payload: CandidateRequest) =>
  (await api.post('/staffing/candidate', payload)).data

export const updateCandidate = async (candidateNumber: string, payload: CandidateRequest) =>
  (await api.put(`/staffing/candidate/${encodeURIComponent(candidateNumber)}`, payload)).data

export const deleteCandidate = async (candidateNumber: string) =>
  (await api.delete(`/staffing/candidate/${encodeURIComponent(candidateNumber)}`)).data

// ── Submissions ─────────────────────────────────────────────────────────────

export const createSubmission = async (payload: SubmissionRequest) =>
  (await api.post('/staffing/submission', payload)).data

export const getSubmission = async (submissionNumber: string) =>
  (await api.get(`/staffing/submission/${encodeURIComponent(submissionNumber)}`)).data

export const updateSubmission = async (submissionNumber: string, payload: SubmissionRequest) =>
  (await api.put(`/staffing/submission/${encodeURIComponent(submissionNumber)}`, payload)).data

export const getBoard = async (requirementNumber: string) =>
  (await api.get(`/staffing/submission/board/${encodeURIComponent(requirementNumber)}`)).data

export const getSubmissionHistory = async (submissionNumber: string) =>
  (await api.get(`/staffing/submission/${encodeURIComponent(submissionNumber)}/history`)).data

/**
 * The drag-and-drop call. `version` is what the board last saw; the API
 * refuses the move if someone else got there first rather than overwriting.
 */
export const moveSubmissionStage = async (
  submissionNumber: string,
  payload: { toStage: string; sortKey?: number; reason?: string; version?: number },
) => (await api.patch(`/staffing/submission/${encodeURIComponent(submissionNumber)}/stage`, payload)).data

export const changeSubmissionOutcome = async (
  submissionNumber: string,
  payload: { outcome: string; reason?: string; version?: number },
) => (await api.patch(`/staffing/submission/${encodeURIComponent(submissionNumber)}/outcome`, payload)).data

export const deleteSubmission = async (submissionNumber: string) =>
  (await api.delete(`/staffing/submission/${encodeURIComponent(submissionNumber)}`)).data

// ── Documents ───────────────────────────────────────────────────────────────

export const getCandidateDocuments = async (candidateNumber: string) =>
  (await api.get(`/staffing/candidate/${encodeURIComponent(candidateNumber)}/document`)).data

export const uploadCandidateDocument = async (
  candidateNumber: string,
  file: File,
  variant?: string,
) => {
  const form = new FormData()
  form.append('file', file)
  if (variant) form.append('variant', variant)

  // The shared axios instance sets Content-Type: application/json for every
  // request. That overrides the multipart type FormData would otherwise carry,
  // so the boundary never reaches the server and it answers
  // HttpMediaTypeNotSupportedException. Undefined here makes axios drop the
  // header and let the browser set the correct one, boundary included —
  // scoped to this call so nothing else is affected.
  return (
    await api.post(
      `/staffing/candidate/${encodeURIComponent(candidateNumber)}/document`,
      form,
      { headers: { 'Content-Type': undefined } },
    )
  ).data
}

export const deleteCandidateDocument = async (documentNumber: string) =>
  (await api.delete(`/staffing/document/${encodeURIComponent(documentNumber)}`)).data

/** Opened in a tab rather than fetched — the API streams it back inline. */
export const documentUrl = (documentNumber: string) =>
  `/api/staffing/document/${encodeURIComponent(documentNumber)}`

// ── Bench & folders ─────────────────────────────────────────────────────────

export const getBench = async () => (await api.get('/staffing/bench')).data

export const setBenchStatus = async (
  candidateNumber: string,
  payload: { benchStatus: string; availableFrom?: string },
) => (await api.patch(`/staffing/candidate/${encodeURIComponent(candidateNumber)}/bench`, payload)).data

export const getFolderTree = async () => (await api.get('/staffing/folder')).data

export const createFolder = async (payload: {
  folderName: string
  parentFolderId?: number
  description?: string
}) => (await api.post('/staffing/folder', payload)).data

export const updateFolder = async (
  folderId: number,
  payload: { folderName: string; parentFolderId?: number; description?: string },
) => (await api.put(`/staffing/folder/${folderId}`, payload)).data

export const deleteFolder = async (folderId: number) =>
  (await api.delete(`/staffing/folder/${folderId}`)).data

export const getFolderCandidates = async (folderId: number) =>
  (await api.get(`/staffing/folder/${folderId}/candidate`)).data

export const addCandidateToFolder = async (folderId: number, candidateNumber: string) =>
  (await api.post(`/staffing/folder/${folderId}/candidate/${encodeURIComponent(candidateNumber)}`)).data

export const removeCandidateFromFolder = async (folderId: number, candidateNumber: string) =>
  (await api.delete(`/staffing/folder/${folderId}/candidate/${encodeURIComponent(candidateNumber)}`)).data

// ── Dashboard ───────────────────────────────────────────────────────────────

export const getHrDashboard = async (period: DashboardPeriod, on?: string, member?: string) =>
  (await api.get('/staffing/dashboard/hr', { params: { period, on, member } })).data

export const getSalesDashboard = async (period: DashboardPeriod, on?: string, member?: string) =>
  (await api.get('/staffing/dashboard/sales', { params: { period, on, member } })).data

/** Everyone who has submitted a profile, for the per-member KPI picker. */
export const getStaffingMembers = async () => (await api.get('/staffing/dashboard/member')).data

export const getStandup = async (on?: string) =>
  (await api.get('/staffing/dashboard/standup', { params: { on } })).data

export const getKpiTargets = async () => (await api.get('/staffing/dashboard/kpi-target')).data

export const setKpiTarget = async (params: {
  kpiKey: string
  period: string
  comparator?: string
  value: number
}) => (await api.put('/staffing/dashboard/kpi-target', null, { params })).data
