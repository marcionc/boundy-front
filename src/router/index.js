import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    // Rota de registro comentada temporariamente
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: () => import('../views/Register.vue')
    // },
    {
      path: '/dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/Home.vue')
        },
        {
          path: '/videoaulas',
          name: 'Videoaulas',
          component: () => import('../views/Videoaulas.vue')
        },
        {
          path: '/simulados',
          name: 'Simulados',
          component: () => import('../views/Simulados.vue')
        },
        {
          path: '/cursos',
          name: 'Cursos',
          component: () => import('../views/Cursos.vue')
        },
        {
          path: '/suporte',
          name: 'Suporte',
          component: () => import('../views/Suporte.vue')
        },
        {
          path: '/noticias/:slug',
          name: 'NewsDetail',
          component: () => import('../views/NewsDetail.vue')
        },
        {
          path: '/notificacoes',
          name: 'Notificacoes',
          component: () => import('../views/Notificacoes.vue')
        },
        {
          path: '/minha-conta',
          name: 'MinhaConta',
          component: () => import('../views/MinhaConta.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')
  
  // Se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Se não estiver autenticado ou não tiver token
    if (!authStore.isAuthenticated || !token) {
      // Se tiver token mas não estiver autenticado, tenta buscar os dados do usuário
      if (token && !authStore.isAuthenticated) {
        try {
          await authStore.fetchUserData()
          if (authStore.user) {
            authStore.isAuthenticated = true
            next()
            return
          }
        } catch (error) {
          console.error('Erro ao recuperar dados do usuário:', error)
        }
      }
      
      // Se não conseguiu autenticar, redireciona para login
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // Se está indo para login e já está autenticado, redireciona para dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router