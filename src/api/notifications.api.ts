import api from '@/lib/axios'
import type { Notification } from '@/types/api.types'

export const getNotifications = () =>
  api.get<Notification[]>('/notifications').then((r) => r.data)

export const markAsRead = (id: number) =>
  api.patch(`/notifications/${id}/read`).then((r) => r.data)

export const markAllAsRead = () =>
  api.patch('/notifications/read-all').then((r) => r.data)
