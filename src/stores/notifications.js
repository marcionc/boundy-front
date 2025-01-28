import { defineStore } from 'pinia'
import api from '@/services/api'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0
  }),

  actions: {
    async fetchNotifications() {
      try {
        const response = await api.get('/notifications/')
        this.notifications = response.data
        this.unreadCount = this.notifications.filter(n => !n.read).length
        return this.notifications
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
        throw error
      }
    },

    async markAsRead(notificationId) {
      try {
        await api.patch(`/notifications/${notificationId}/read/`)
        const index = this.notifications.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          this.notifications[index].read = true
          this.unreadCount--
        }
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error)
        throw error
      }
    },

    async getUnreadCount() {
      try {
        const response = await api.get('/notifications/unread-count/')
        this.unreadCount = response.data.count
        return this.unreadCount
      } catch (error) {
        console.error('Erro ao buscar contagem de notificações não lidas:', error)
        return 0
      }
    }
  }
})
