// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import * as notifApi from '@/api/notifications.api'

// const KEY = 'notifications'

// export const useNotifications = () =>
//   useQuery({
//     queryKey: [KEY],
//     queryFn: notifApi.getNotifications,
//     refetchInterval: 30000, // Poll every 30 seconds
//   })

// export const useMarkAsRead = () => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: (id: number) => notifApi.markAsRead(id),
//     onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
//   })
// }

// export const useMarkAllAsRead = () => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: notifApi.markAllAsRead,
//     onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
//   })
// }


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as notifApi from '@/api/notifications.api'

const KEY = 'notifications'

export const useNotifications = () =>
  useQuery({
    queryKey: [KEY],
    queryFn: notifApi.getNotifications,
    refetchInterval: 30000,
    retry: false,          // do not retry when backend is offline
    enabled: false,        // DEV ONLY — disable until backend is ready
  })

export const useMarkAsRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notifApi.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useMarkAllAsRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notifApi.markAllAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}
