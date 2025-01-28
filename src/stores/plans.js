import { defineStore } from 'pinia'
import api from '@/services/api'

export const usePlanStore = defineStore('plans', {
  state: () => ({
    currentPlan: null,
    availablePlans: []
  }),

  actions: {
    async getCurrentPlan() {
      try {
        const response = await api.get('/plans/current/')
        this.currentPlan = response.data
        return this.currentPlan
      } catch (error) {
        console.error('Erro ao buscar plano atual:', error)
        throw error
      }
    },

    async getAvailablePlans() {
      try {
        const response = await api.get('/plans/')
        this.availablePlans = response.data
        return this.availablePlans
      } catch (error) {
        console.error('Erro ao buscar planos disponíveis:', error)
        throw error
      }
    },

    async changePlan(planId) {
      try {
        const response = await api.post('/plans/change/', { plan_id: planId })
        this.currentPlan = response.data
        return this.currentPlan
      } catch (error) {
        console.error('Erro ao alterar plano:', error)
        throw error
      }
    }
  }
})
