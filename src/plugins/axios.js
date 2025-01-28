import axios from 'axios'

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken'
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log da requisição em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      })
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log da resposta em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      })
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log detalhado do erro em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Response error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        originalUrl: originalRequest?.url
      })
    }

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh/', { refresh: refreshToken })
          const { access } = response.data
          
          localStorage.setItem('token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          
          return api(originalRequest)
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError)
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    // Se for erro de CORS ou Network
    if (!error.response) {
      console.error('Network/CORS error:', error.message)
      return Promise.reject(new Error('Erro de conexão com o servidor. Verifique se o servidor está rodando e acessível.'))
    }

    console.error('Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
