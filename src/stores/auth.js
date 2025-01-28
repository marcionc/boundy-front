import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token')
  }),
  
  getters: {
    userFullName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : '',
    userEmail: (state) => state.user?.email,
    isAdmin: (state) => state.user?.is_staff || false,
  },
  
  actions: {
    async login(username, password) {
      try {
        // Limpar tokens antigos
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')

        // Fazer login
        const response = await api.post('/api/token/', {
          username,
          password
        })

        // Verificar se recebemos os tokens
        if (!response.data?.access || !response.data?.refresh) {
          throw new Error('Tokens de autenticação não recebidos')
        }

        // Salvar tokens
        localStorage.setItem('token', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)

        // Buscar dados do usuário
        await this.fetchUserData()

        // Verificar se temos os dados do usuário
        if (!this.user?.id) {
          throw new Error('Dados do usuário não recebidos após login')
        }

        // Atualizar estado de autenticação
        this.isAuthenticated = true

        return true
      } catch (error) {
        console.error('Erro no login:', error)
        
        // Limpar dados em caso de erro
        this.clearAuth()

        // Tratar mensagens de erro específicas
        if (!error.response) {
          throw new Error('Erro de conexão com o servidor. Verifique se o servidor está rodando.')
        } else if (error.response.status === 401) {
          throw new Error('Usuário ou senha inválidos')
        } else {
          throw new Error(error.response?.data?.detail || error.message || 'Erro desconhecido no login')
        }
      }
    },

    async fetchUserData() {
      try {
        const response = await api.get('/auth/users/me/')
        if (!response.data) {
          throw new Error('Dados do usuário não recebidos')
        }
        this.user = response.data
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error.response?.data || error.message)
        throw error
      }
    },

    async refreshUserToken() {
      try {
        if (!this.refreshToken) {
          throw new Error('Refresh token não encontrado')
        }

        const refreshResponse = await api.post('/api/token/refresh/', {
          refresh: this.refreshToken
        })

        if (!refreshResponse.data?.access) {
          throw new Error('Novo token de acesso não recebido')
        }

        this.token = refreshResponse.data.access
        localStorage.setItem('token', refreshResponse.data.access)
        return true
      } catch (error) {
        console.error('Erro ao renovar token:', error.response?.data || error.message)
        this.clearAuth()
        throw error
      }
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      this.refreshToken = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },

    logout() {
      this.clearAuth()
    },

    async checkAuth() {
      if (!this.token) {
        this.clearAuth()
        return false
      }

      try {
        await this.fetchUserData()
        return true
      } catch (error) {
        this.clearAuth()
        return false
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/users/', userData)
        
        if (!response.data?.id) {
          throw new Error('Erro ao criar usuário')
        }

        return response.data
      } catch (error) {
        console.error('Erro no registro:', error)
        
        if (!error.response) {
          throw new Error('Erro de conexão com o servidor')
        } else if (error.response.status === 400) {
          // Tratar erros de validação
          const errors = error.response.data
          if (errors.email) {
            throw new Error(Array.isArray(errors.email) ? errors.email[0] : errors.email)
          } else if (errors.password) {
            throw new Error(Array.isArray(errors.password) ? errors.password[0] : errors.password)
          } else if (errors.full_name) {
            throw new Error(Array.isArray(errors.full_name) ? errors.full_name[0] : errors.full_name)
          } else if (errors.non_field_errors) {
            throw new Error(Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors)
          } else {
            // Se não encontrar um erro específico, pega o primeiro erro encontrado
            const firstError = Object.values(errors)[0]
            throw new Error(Array.isArray(firstError) ? firstError[0] : firstError)
          }
        } else if (error.response.status === 409) {
          throw new Error('Este email já está em uso')
        } else {
          throw new Error('Erro ao criar conta. Por favor, tente novamente.')
        }
      }
    },

    async fetchUserProfile() {
      try {
        const response = await api.get('/auth/users/me/')
        this.user = response.data
        return this.user
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error)
        throw error
      }
    },

    async updateProfile(profileData) {
      try {
        const response = await api.patch('/auth/users/me/', profileData)
        this.user = response.data
        return this.user
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        throw error
      }
    },

    async changePassword(passwordData) {
      try {
        await api.post('/auth/password/change/', passwordData)
        // Opcionalmente, fazer logout após mudança de senha
        // this.logout()
      } catch (error) {
        console.error('Erro ao alterar senha:', error)
        throw error
      }
    },

    async deleteAccount() {
      try {
        await api.delete('/auth/users/me/')
        this.logout()
      } catch (error) {
        console.error('Erro ao excluir conta:', error)
        throw error
      }
    }
  }
})