import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`, // URL base da API configurada dinamicamente
});

export default api;