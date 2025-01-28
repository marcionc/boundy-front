import axios from 'axios'

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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
    if (import.meta.env.DEV) {
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
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Tratar erros de requisição
    if (error.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error('Erro de resposta:', error.response.data)
      console.error('Status:', error.response.status)
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      console.error('Sem resposta do servidor')
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro ao configurar requisição:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
