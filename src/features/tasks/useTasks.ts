import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as tasksApi from '@/api/tasks.api'
import type { CreateTaskRequest} from '@/types/api.types'

export const TASKS_KEY = 'tasks'

export const useTasks = (params?: Parameters<typeof tasksApi.getTasks>[0]) =>
  useQuery({
    queryKey: [TASKS_KEY, params],
    queryFn: () => tasksApi.getTasks(params),
  })

export const useCreateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateTaskRequest>) => tasksApi.createTask(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] })
      toast.success('Task created')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

