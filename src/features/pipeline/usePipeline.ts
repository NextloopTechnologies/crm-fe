import { useQuery } from '@tanstack/react-query'
import * as pipelineApi from '@/api/pipeline.api'

export const usePipelineBoard = () =>
  useQuery({
    queryKey: ['pipeline', 'board'],
    queryFn: pipelineApi.getPipelineBoard,
  })

export const usePipelineStats = () =>
  useQuery({
    queryKey: ['pipeline', 'stats'],
    queryFn: pipelineApi.getPipelineStats,
  })

export const usePipelineActivity = () =>
  useQuery({
    queryKey: ['pipeline', 'activity'],
    queryFn: pipelineApi.getPipelineActivity,
  })
