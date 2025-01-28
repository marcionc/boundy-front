<template>
    <div class="dashboard">
        <!-- Cabeçalho -->
        <header class="header">
            <div class="logo-container">
                <img src="/src/assets/bounky-logo.svg" alt="Bounky Logo" class="logo-icon" />
                <span class="logo-text">Bounky</span>
            </div>
            <div class="header-spacer"></div>
            <div class="user-info">
                <span class="user-greeting">Bem-vindo, {{ authStore.user?.first_name || 'Usuário' }}</span>
                <div class="header-actions">
                    <button 
                        class="header-button notifications-button" 
                        @click="openNotifications"
                        title="Notificações"
                    >
                        <Icon name="bell" color="white" size="24px" />
                        <span v-if="unreadNotifications > 0" class="notification-badge">
                            {{ unreadNotifications }}
                        </span>
                    </button>
                    <button 
                        @click="logout" 
                        class="header-button logout-button"
                        title="Sair"
                    >
                        <Icon name="logout" color="white" />
                    </button>
                </div>
            </div>
        </header>

        <!-- Layout Principal -->
        <div class="main-layout">
            <!-- Menu Lateral para Desktop -->
            <div v-if="!isMobile" class="desktop-sidebar">
                <div class="nav-menu">
                    <router-link to="/dashboard" class="nav-link">
                        <Icon name="home" class="nav-icon" />
                        <span>Início</span>
                    </router-link>
                    <router-link to="/cursos" class="nav-link">
                        <Icon name="video" class="nav-icon" />
                        <span>Cursos</span>
                    </router-link>
                    <router-link to="/simulados" class="nav-link">
                        <Icon name="exam" class="nav-icon" />
                        <span>Simulados</span>
                    </router-link>
                    <router-link to="/suporte" class="nav-link">
                        <Icon name="technical-support" class="nav-icon" />
                        <span>Suporte</span>
                    </router-link>
                    <button @click="showSettings" class="nav-link settings-link">
                        <Icon name="settings" class="nav-icon" />
                        <span>Configurações</span>
                    </button>
                </div>
            </div>

            <!-- Conteúdo Principal -->
            <main class="content">
                <router-view></router-view>
            </main>

            <!-- Menu de Rodapé para Mobile -->
            <div v-if="isMobile" class="mobile-footer-nav">
                <div class="nav-menu">
                    <router-link to="/dashboard" class="nav-link">
                        <Icon name="home" class="nav-icon" />
                    </router-link>
                    <router-link to="/cursos" class="nav-link">
                        <Icon name="video" class="nav-icon" />
                    </router-link>
                    <router-link to="/simulados" class="nav-link">
                        <Icon name="exam" class="nav-icon" />
                    </router-link>
                    <router-link to="/suporte" class="nav-link">
                        <Icon name="technical-support" class="nav-icon" />
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Icon from '../components/icons/Icon.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const isMobile = ref(window.innerWidth <= 768)
const unreadNotifications = ref(0)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', checkMobile)
  
  // Buscar notificações não lidas
  fetchUnreadNotifications()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const showSettings = () => {
  router.push('/minha-conta')
}

const openNotifications = () => {
  router.push('/notificacoes')
}

const fetchUnreadNotifications = async () => {
  try {
    unreadNotifications.value = await notificationStore.getUnreadCount()
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
  }
}
</script>

<style scoped>
.dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Cabeçalho */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    color: var(--white);
    padding: var(--spacing-sm) var(--spacing-md);
    box-shadow: var(--shadow-md);
}

.header-spacer {
    flex-grow: 1;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo-icon {
    width: 2rem;
    height: 2rem;
}

.logo-text {
    font-size: 1.2rem;
    font-weight: 600;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-greeting {
    font-size: 0.9rem;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--white);
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.header-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-md);
    padding: 0.5rem;
    cursor: pointer;
    transition: all var(--transition-normal);
    width: 40px;
    height: 40px;
    opacity: 0.8;
    position: relative;
}

.header-button:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
}

.logout-button {
    background: transparent;
}

.notifications-button {
    position: relative;
}

.notification-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: var(--accent-color);
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    border: 2px solid var(--primary-light);
}

.settings-link {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
    transition: background-color var(--transition-normal);
}

.settings-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.main-layout {
    display: flex;
    flex-grow: 1;
    position: relative;
}

/* Desktop Sidebar */
.desktop-sidebar {
    display: none;
}

.content {
    flex-grow: 1;
    padding: var(--spacing-md);
}

/* Mobile Footer Navigation */
.mobile-footer-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--white);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.mobile-footer-nav .nav-menu {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
}

.mobile-footer-nav .nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-color);
    text-decoration: none;
}

.mobile-footer-nav .nav-icon {
    font-size: 1.5rem;
    margin-bottom: 5px;
}

.nav-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    object-fit: contain;
    filter: invert(0) brightness(1);
}

.nav-link {
    display: flex;
    align-items: center;
    color: inherit;
}

/* Responsiveness */
@media (min-width: 768px) {
    .mobile-footer-nav {
        display: none;
    }

    .desktop-sidebar {
        display: block;
        width: 250px;
        background-color: var(--white);
        box-shadow: var(--shadow-sm);
        padding: var(--spacing-md);
    }

    .desktop-sidebar .nav-menu {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .desktop-sidebar .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: var(--spacing-sm) var(--spacing-md);
        color: var(--text-color);
        text-decoration: none;
        border-radius: var(--border-radius-md);
        transition: all var(--transition-normal);
    }

    .desktop-sidebar .nav-link:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
    }

    .desktop-sidebar .nav-icon {
        font-size: 1.25rem;
        color: var(--primary-color);
    }

    .main-layout {
        padding-bottom: 0;
    }
}
</style>