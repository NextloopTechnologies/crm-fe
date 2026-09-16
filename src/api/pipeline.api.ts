import api from '@/lib/axios'
import type { PipelineBoard, PipelineStats } from '@/types/api.types'

export const getPipelineBoard = () =>
  api.get<PipelineBoard>('/pipeline/board').then((r) => r.data)

export const getPipelineStats = () =>
  api.get<PipelineStats>('/pipeline/stats').then((r) => r.data)

export const getPipelineForecast = () =>
  api.get('/pipeline/forecast').then((r) => r.data)

export const getPipelineActivity = () =>
  api.get('/pipeline/activity').then((r) => r.data)
