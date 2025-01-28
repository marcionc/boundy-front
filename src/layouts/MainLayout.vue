<template>
  <div class="layout" :class="{ 'is-mobile': isMobile }">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <button v-if="isMobile" class="menu-toggle" @click="toggleMenu">
          <i class="fas fa-bars"></i>
        </button>
        <router-link to="/" class="logo">
          <img src="@/assets/logo.png" alt="Bounky" />
        </router-link>
        <!-- Menu desktop -->
        <nav v-if="!isMobile" class="nav-desktop">
          <router-link to="/simulados">Simulados</router-link>
          <router-link to="/materiais">Materiais</router-link>
          <router-link to="/perfil">Perfil</router-link>
          <router-link to="/suporte">Suporte</router-link>
        </nav>
      </div>
    </header>

    <!-- Menu mobile -->
    <nav v-if="isMobile" class="nav-mobile" :class="{ 'is-open': isMenuOpen }">
      <router-link to="/simulados" @click="closeMenu">Simulados</router-link>
      <router-link to="/materiais" @click="closeMenu">Materiais</router-link>
      <router-link to="/perfil" @click="closeMenu">Perfil</router-link>
      <router-link to="/suporte" @click="closeMenu">Suporte</router-link>
    </nav>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResponsive } from '@/composables/useResponsive'

const { isMobile, isTablet, isDesktop } = useResponsive()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--background-color);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-index-dropdown);
}

.header-content {
  max-width: var(--breakpoint-lg);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 40px;
}

.nav-desktop {
  display: flex;
  gap: var(--spacing-md);
}

.nav-desktop a {
  color: var(--text-color);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.3s;
}

.nav-desktop a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-desktop a.router-link-active {
  color: var(--primary-color);
  font-weight: bold;
}

/* Mobile */
.layout.is-mobile .header {
  position: fixed;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--text-color);
  padding: var(--spacing-sm);
  cursor: pointer;
}

.nav-mobile {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: var(--background-color);
  padding: var(--spacing-md);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: var(--z-index-dropdown);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.nav-mobile.is-open {
  transform: translateX(0);
}

.nav-mobile a {
  color: var(--text-color);
  text-decoration: none;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.3s;
}

.nav-mobile a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.main-content {
  margin-top: 60px;
  padding: var(--spacing-md);
  flex: 1;
}

/* Tablet */
@media (min-width: 768px) and (max-width: 991px) {
  .main-content {
    padding: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 992px) {
  .main-content {
    max-width: var(--breakpoint-lg);
    margin: 60px auto 0;
    padding: var(--spacing-xl);
  }
}
</style>
