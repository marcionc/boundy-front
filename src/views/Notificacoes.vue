<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h1>Notificações</h1>
      <button 
        v-if="notifications.length" 
        @click="markAllAsRead" 
        class="mark-all-read-btn"
      >
        Marcar todas como lidas
      </button>
    </div>

    <div 
      v-if="loading" 
      class="loading-container"
    >
      <Icon name="spinner" color="var(--primary-color)" size="48px" />
      <p>Carregando notificações...</p>
    </div>

    <div 
      v-else-if="notifications.length === 0" 
      class="empty-notifications"
    >
      <Icon name="bell-off" color="var(--secondary-color)" size="64px" />
      <p>Você não tem notificações no momento</p>
    </div>

    <div 
      v-else 
      class="notifications-list"
    >
      <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        class="notification-item"
        :class="{ 'unread': !notification.read }"
        @click="markAsRead(notification.id)"
      >
        <div class="notification-icon">
          <Icon :name="getIconForType(notification.type)" :color="getColorForType(notification.type)" />
        </div>
        
        <div class="notification-content">
          <h3>{{ notification.title }}</h3>
          <p>{{ notification.message }}</p>
          <span class="notification-time">
            {{ formatDate(notification.created_at) }}
          </span>
        </div>

        <div 
          v-if="!notification.read" 
          class="notification-badge"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import Icon from '@/components/icons/Icon.vue'
import { formatRelativeTime } from '@/utils/date'

const notificationStore = useNotificationStore()
const notifications = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    notifications.value = await notificationStore.fetchNotifications()
  } catch (error) {
    console.error('Erro ao carregar notificações:', error)
  } finally {
    loading.value = false
  }
})

const markAsRead = async (notificationId) => {
  try {
    await notificationStore.markAsRead(notificationId)
    notifications.value = notifications.value.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
  }
}

const markAllAsRead = async () => {
  try {
    const unreadNotifications = notifications.value.filter(n => !n.read)
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id)
    }
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error)
  }
}

const formatDate = (dateString) => {
  return formatRelativeTime(dateString)
}

const getIconForType = (type) => {
  const iconMap = {
    'course': 'video',
    'exam': 'exam',
    'support': 'technical-support',
    'system': 'info-circle',
    'default': 'bell'
  }
  return iconMap[type] || iconMap['default']
}

const getColorForType = (type) => {
  const colorMap = {
    'course': '#3498db',
    'exam': '#2ecc71',
    'support': '#e74c3c',
    'system': '#f39c12',
    'default': '#7f8c8d'
  }
  return colorMap[type] || colorMap['default']
}
</script>

<style scoped>
.notifications-container {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.mark-all-read-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  transition: color var(--transition-normal);
}

.mark-all-read-btn:hover {
  color: var(--accent-color);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.empty-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: var(--secondary-color);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.notification-item {
  display: flex;
  align-items: center;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  position: relative;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.notification-item.unread {
  background-color: var(--cloud-white);
  border-left: 4px solid var(--accent-color);
}

.notification-icon {
  margin-right: var(--spacing-md);
}

.notification-content {
  flex-grow: 1;
}

.notification-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1rem;
  color: var(--text-color);
}

.notification-content p {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--secondary-text-color);
  font-size: 0.9rem;
}

.notification-time {
  font-size: 0.8rem;
  color: var(--secondary-text-color);
}

.notification-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 10px;
  height: 10px;
  background-color: var(--accent-color);
  border-radius: 50%;
}
</style>
